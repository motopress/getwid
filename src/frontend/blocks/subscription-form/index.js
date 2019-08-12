( function ( $ ) {
    $( document ).ready( ( event ) => {

        const $getwid_subscribe_forms = $( '.wp-block-getwid-subscription-form__form' );

        $getwid_subscribe_forms.each( (index, form) => {
            
            const $result  = $( form ).find( 'p[class$=__result]'      );
            const $submit  = $( form ).find( 'button[type=\'submit\']' );

            $result.hide();

            $( form ).submit( event => {
                event.preventDefault();

                $submit.prop( 'disabled', true );
                            
                const data = {
                    'action': 'getwid_process_submission',
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
    } );
} )( jQuery );