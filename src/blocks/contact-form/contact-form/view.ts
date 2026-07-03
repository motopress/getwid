import $ from 'jquery';

type GetwidContactFormGlobal = {
	ajax_url: string;
	nonces: {
		contact_form: string;
	};
};

type Grecaptcha = {
	ready: ( callback: () => void ) => void;
	render: (
		element: HTMLElement,
		options: {
			sitekey: string;
			theme: string;
		}
	) => number;
	reset: ( widgetId?: number ) => void;
};

const getwid = ( window as Window & { Getwid: GetwidContactFormGlobal } )
	.Getwid;
const grecaptcha = ( window as Window & { grecaptcha?: Grecaptcha } )
	.grecaptcha;

function initContactForms() {
	const $getwidContactForms = $(
		'.wp-block-getwid-contact-form__form:not(.getwid-init)'
	);

	$getwidContactForms.each( ( index, form ) => {
		const $form = $( form );

		$form.addClass( 'getwid-init' );

		const $result = $form.find( 'p[class$=__result]' );
		const $submit = $form.find( "button[type='submit']" );
		const $captcha = $form.find( '.wp-block-getwid-captcha' );

		let captchaId: number | undefined;

		if ( $captcha.length && grecaptcha ) {
			const getwidSiteKey = String( $captcha.data( 'sitekey' ) || '' );
			const getwidTheme = String( $captcha.data( 'theme' ) || '' );

			grecaptcha.ready( () => {
				captchaId = grecaptcha.render( $captcha[ 0 ], {
					sitekey: getwidSiteKey,
					theme: getwidTheme,
				} );
			} );
		}

		$result.hide();

		$form.on( 'submit', ( event ) => {
			event.preventDefault();

			$submit.prop( 'disabled', true );

			const formValues: Record< string, string > = {};

			$form.serializeArray().forEach( ( field ) => {
				formValues[ field.name ] = String( field.value );
			} );

			const data = {
				action: 'getwid_send_mail',
				nonce: getwid.nonces.contact_form,
				data: formValues,
			};

			if ( $result.text() !== '' ) {
				$result.hide( 300 );
			}

			$.post( getwid.ajax_url, data, ( response ) => {
				if ( $result.hasClass( 'success' ) ) {
					$result.removeClass( 'success' );
				} else if ( $result.hasClass( 'fail' ) ) {
					$result.removeClass( 'fail' );
				}

				$submit.prop( 'disabled', false );

				if ( $captcha.length && response.success && grecaptcha ) {
					grecaptcha.reset( captchaId );
				}

				if ( response.success ) {
					( form as HTMLFormElement ).reset();
					$result.addClass( 'success' );
				} else {
					$result.addClass( 'fail' );
				}

				$result.html( response.data );
				$result.show( 300 );
			} );
		} );
	} );
}

$( () => {
	$( document.body ).on( 'post-load', initContactForms );
	initContactForms();
} );
