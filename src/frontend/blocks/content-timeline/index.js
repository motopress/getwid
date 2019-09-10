( function ( $ ) {
    $( document ).ready( ( event ) => {

        const $getwid_content_timelines = $( '.wp-block-getwid-content-timeline' );

        $getwid_content_timelines.each( (index, item) => {

            let scrolling = false;

            const className = 'wp-block-getwid-content-timeline-item';

            const $card  = $( item ).find( `.${className}__card`          );
            const $point = $( item ).find( `.${className}__point-content` );
            const $meta  = $( item ).find( `.${className}__meta`          );

            const animationClass = $( item ).data( 'animation' ) != 'none' ? $( item ).data( 'animation' ) : null;
            const pointColor     = $( item ).find( 'div[class$=__point]' ).data( 'point-color' );
            const useFilling     = $( item ).data( 'filling' );

            if ( animationClass ) {
                $.each( $card, (index, item) => {
                    if ( item.getBoundingClientRect().top > window.innerHeight * 0.8 ) {
                        $( item ) .addClass( 'is-hidden' );
                        $( $meta [ index ] ).addClass( 'is-hidden' );
                        $( $point[ index ] ).addClass( 'is-hidden' );
                    }
                } );
            }

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

            const viewportHeightHalf = $( window ).height() / 2;

            const updateLineHeight = () => {
                const $points = $( item ).find( `.${className}__point` );

                let lineHeight = 0;
                $.each ($points, (index, point) => {
                    if ( $points[ index + 1 ] ) {
                        lineHeight += $points[ index + 1 ].getBoundingClientRect().top - point.getBoundingClientRect().top;
                    }
                } );

                const $line = $( item ).find( 'div[class$=__line]' );

                const [ first, ...rest ] = $points.get();
                const topOffset = $( first ).position().top + $( first ).height() / 2;

                $line.css( {
                    height: lineHeight,
                    top: topOffset
                } );
            }

            /* #region update points color and bar height */
            const setColorByScroll = () => {
                const $points = $( item ).find( `.${className}__point` );

                const [ first, ...rest ] = $points.get();
                if ( rest.length ) {
                    $.each( $points, (index, point) => {
                        const pointOffsetTop = point.getBoundingClientRect().top;
                        const item = $( point ).parents( `.${className}` )[ 0 ];

                        if ( pointOffsetTop <= viewportHeightHalf ) {
                            if ( ! $( item ).hasClass( 'is-active' ) ) {
                                $( item ).addClass( 'is-active' );
                            }

                            $( point ).find( ':first-child' ).css( {
                                borderColor: pointColor ? pointColor : '#11a7e7'
                            } );
                            
                        } else {
                            if ( $( item ).hasClass( 'is-active' ) ) {
                                $( item ).removeClass( 'is-active' );
                            }

                            $( point ).find( ':first-child' ).css( {
                                borderColor: ''
                            } );
                        }
                    } );
                }
            }

            const updateBarHeight = () => {

                const $points = $( item ).find( `.${className}__point` );
                const bar     = $( item ).find( 'div[class*=__bar]'    )[ 0 ];

                const barOffsetTop = bar.getBoundingClientRect().top;

                const [ first, ...rest ] = $points.toArray();
                const barHeight = viewportHeightHalf - first.getBoundingClientRect().top;

                if ( rest.length ) {
                    const last = rest.slice( -1 ).pop();
                    const lastOffsetTop = last.getBoundingClientRect().top;

                    if ( barOffsetTop <= viewportHeightHalf && lastOffsetTop >= viewportHeightHalf ) {
                        $( bar ).css( { height: barHeight } );
                    }

                    if ( barOffsetTop >= viewportHeightHalf  ) {
                        $( bar ).css( { height: 0 } );
                    }

                    if ( lastOffsetTop <= viewportHeightHalf ) {
                        $( bar ).css( { height: '100%' } );
                    }
                }
            }
            /* #endregion */
            $( document ).ready( () => {

                updateLineHeight();

                if ( useFilling ) {
                    setColorByScroll();
                    updateBarHeight();
                }

                if ( useFilling ) {
                    $( document ).scroll( () => {
                        setColorByScroll();
                        updateBarHeight();
                    } );
                }
            } );

            $( window ).resize( () => {
                updateLineHeight();

                if ( useFilling ) {
                    setColorByScroll();
                    updateBarHeight();
                }
            } );
        } );
    } );
} )( jQuery );
