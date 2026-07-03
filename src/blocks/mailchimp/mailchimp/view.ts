import jQuery from 'jquery';

type MailchimpRuntime = Window & {
	Getwid?: {
		ajax_url?: string;
	};
};

type AjaxResponse =
	| {
			success: true;
			data: string;
	  }
	| {
			success: false;
			data: string;
	  };

const runtimeGlobal = window as MailchimpRuntime;

function initSubscribeForms() {
	const $forms = jQuery(
		'.wp-block-getwid-mailchimp__form:not(.getwid-init)'
	);

	if ( ! $forms.length || ! runtimeGlobal.Getwid?.ajax_url ) {
		return;
	}

	$forms.each( ( _index, form ) => {
		const $form = jQuery( form );
		const $result = $form.find( 'p[class$=__result]' );
		const $submit = $form.find( "button[type='submit']" );

		$form.addClass( 'getwid-init' );
		$result.hide();

		$form.on( 'submit', ( event ) => {
			event.preventDefault();

			$submit.prop( 'disabled', true );

			const formValues: Record< string, string > = {};

			$form.serializeArray().forEach( ( field ) => {
				formValues[ field.name ] = field.value;
			} );

			if ( $result.text() !== '' ) {
				$result.hide( 300 );
			}

			jQuery.post(
				runtimeGlobal.Getwid?.ajax_url || '',
				{
					action: 'getwid_subscribe',
					data: formValues,
				},
				( response: AjaxResponse ) => {
					if ( $result.hasClass( 'success' ) ) {
						$result.removeClass( 'success' );
					} else if ( $result.hasClass( 'fail' ) ) {
						$result.removeClass( 'fail' );
					}

					$submit.prop( 'disabled', false );

					if ( response.success ) {
						$form.get( 0 )?.reset();
						$result.addClass( 'success' );
					} else {
						$result.addClass( 'fail' );
					}

					$result.html( response.data );
					$result.show( 300 );
				}
			);
		} );
	} );
}

jQuery( () => {
	jQuery( document.body ).on( 'post-load', initSubscribeForms );
	initSubscribeForms();
} );
