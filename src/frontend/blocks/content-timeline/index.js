( function ( $ ) {
    $( document ).ready( ( event ) => {

		//Init block loaded via AJAX
		$(document.body).on('post-load', function (e) {
			getwid_init_content_timeline();
		});

		var getwid_init_content_timeline = () => {
			const $getwid_content_timelines = $( '.wp-block-getwid-content-timeline:not(.getwid-init)' );

			$getwid_content_timelines.each( (index, item) => {

				//Add init class
				$(this).addClass('getwid-init');

				let scrolling = false;

				const className = 'wp-block-getwid-content-timeline-item';

				const $timelineItems = $( item ).find( `.${className}` );

				const animationClass = $( item ).data( 'animation' ) != 'none' ? $( item ).data( 'animation' ) : null;
				const pointColor     = $( item ).find( 'div[class$=__point]' ).data( 'point-color' );
				const useFilling     = $( item ).data( 'filling' );

				$.each( $timelineItems, (index, item) => {
					if ( animationClass ) {
						if (item.getBoundingClientRect().top > window.innerHeight * 0.8) {
							$( item ).addClass('is-hidden');
						}else{
							$( item ).addClass( animationClass );
						}
					}

					let cardContent = $( item ).find( `.${className}__content-wrapper` );
					if( cardContent.children().length == 0 || cardContent.find( `.${className}__mobile-meta` ).is( ':only-child' ) ){
						cardContent.addClass('has-no-content');
					}

				} );

				const checkScroll = animationClass => {
					$.each( $timelineItems, (index, item) => {
						if ( $( item ).hasClass('is-hidden') && item.getBoundingClientRect().top <= window.innerHeight * 0.8) {
							$( item ).removeClass( 'is-hidden' );
							$( item ).addClass( animationClass );
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
									borderColor: pointColor ? pointColor : ''
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
					const waitLoadContent = setInterval( () => {
						if ( document.readyState == 'complete' ) {

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

							clearInterval( waitLoadContent );
						}
					}, 1000 );
				} );

				$( window ).resize( () => {
					updateLineHeight();

					if ( useFilling ) {
						setColorByScroll();
						updateBarHeight();
					}
				} );
			} );
		};

		getwid_init_content_timeline();

    } );
} )( jQuery );
