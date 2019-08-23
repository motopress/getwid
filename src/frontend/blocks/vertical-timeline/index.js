( function ( $ ) {
    $( document ).ready( ( event ) => {

        const $getwid_vertical_timelines = $( '.wp-block-getwid-vertical-timeline' );

        $getwid_vertical_timelines.each( (index, item) => {
             
            let scrolling = false;

            const className = 'wp-block-getwid-vertical-timeline-item';
            
            const $card  = $( item ).find( `.${className}__card`          );
            const $point = $( item ).find( `.${className}__point-content` );
            const $meta  = $( item ).find( `.${className}__meta`          );

            $.each( $card, (index, item) => {
                if ( item.getBoundingClientRect().top > window.innerHeight * 0.8 ) {
                    $( item ) .addClass( 'is-hidden' );
                    $( $meta [ index ] ).addClass( 'is-hidden' );
                    $( $point[ index ] ).addClass( 'is-hidden' );
                }
            } );

            const checkScroll = animationClass => {
                $.each( $card, (index, item) => {
                    if ( $( item ).hasClass( 'is-hidden' ) && item.getBoundingClientRect().top <= window.innerHeight * 0.8 ) {                        
                        $( item ) .addClass( animationClass );
                        $( $meta [ index ] ).addClass( animationClass );
                        $( $point[ index ] ).addClass( 'bounce-in' );
    
                        $( item ).removeClass( 'is-hidden' );
                        $( $meta [ index ] ).removeClass( 'is-hidden' );
                        $( $point[ index ] ).removeClass( 'is-hidden' );
                    }
                } );                
                scrolling = false;
            };

            const animationClass = $( item ).data( 'animation' ) != 'none' ? $( item ).data( 'animation' ) : null;

            if ( animationClass ) {
                $( document ).scroll( () => {
                    if ( ! scrolling ) {
                        scrolling = true;
                        
                        ( ! window.requestAnimationFrame ) ? setTimeout(
                            () => checkScroll( animationClass ), 250
                        ) : window.requestAnimationFrame(
                            () => checkScroll( animationClass )
                        );
                    }
                } );
            }            
        } );
    } );
} )( jQuery );