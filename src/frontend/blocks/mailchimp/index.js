/*!
 * getwid-mailchimp
 */

( function ( $ ) {
    $( document ).ready( ( event ) => {

		//Init block loaded via AJAX
		$(document.body).on('post-load', function (e) {
			getwid_init_subscribe_forms();
		});

		var getwid_init_subscribe_forms = () => {
			const $getwid_subscribe_forms = $( '.wp-block-getwid-mailchimp__form:not(.getwid-init)' );

			$getwid_subscribe_forms.each( (index, form) => {

				//Add init class
				$(this).addClass('getwid-init');

				const $result  = $( form ).find( 'p[class$=__result]'      );
				const $submit  = $( form ).find( 'button[type=\'submit\']' );

				$result.hide();

				$( form ).submit( event => {
					event.preventDefault();

					$submit.prop( 'disabled', true );

					const data = {
						'action': 'getwid_subscribe',
						'data': $( form ).serialize()
					};

					if ( $result.text() != '' ) {
						$result.hide( 300 );
					}

					$.post( Getwid.ajax_url, data, response => {

						if ( $result.hasClass( 'success' ) ) {
							$result.removeClass( 'success' );

						} else if ( $result.hasClass( 'fail' ) ) {
							$result.removeClass( 'fail' );
						}

						$submit.prop( 'disabled', false );

						if ( response.success ) {
							$( form )[ 0 ].reset();
							$result.addClass( 'success' );
						} else {
							$result.addClass( 'fail' );
						}

						$result.html( response.data );
						$result.show( 300 );
					} );
				} );
			} );
		};

		getwid_init_subscribe_forms();

    } );
} )( jQuery );
