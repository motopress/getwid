import $ from 'jquery';

function initContentTimeline() {
	const $getwidContentTimelines = $(
		'.wp-block-getwid-content-timeline:not(.getwid-init)'
	);

	$getwidContentTimelines.each( ( index, item ) => {
		const $timeline = $( item );

		$timeline.addClass( 'getwid-init' );

		let scrolling = false;
		const className = 'wp-block-getwid-content-timeline-item';
		const $timelineItems = $timeline.find( `.${ className }` );
		const animationClass =
			$timeline.data( 'animation' ) !== 'none'
				? $timeline.data( 'animation' )
				: null;
		const pointColor = $timeline
			.find( 'div[class$=__point]' )
			.data( 'point-color' );
		const useFilling = $timeline.data( 'filling' );

		$timelineItems.each( ( itemIndex, timelineItem ) => {
			if ( animationClass ) {
				if (
					timelineItem.getBoundingClientRect().top >
					window.innerHeight * 0.8
				) {
					$( timelineItem ).addClass( 'is-hidden' );
				} else {
					$( timelineItem ).addClass( animationClass );
				}
			}

			const cardContent = $( timelineItem ).find(
				`.${ className }__content-wrapper`
			);

			if (
				cardContent.children().length === 0 ||
				cardContent
					.find( `.${ className }__mobile-meta` )
					.is( ':only-child' )
			) {
				cardContent.addClass( 'has-no-content' );
			}
		} );

		const checkScroll = ( nextAnimationClass: string ) => {
			$timelineItems.each( ( itemIndex, timelineItem ) => {
				if (
					$( timelineItem ).hasClass( 'is-hidden' ) &&
					timelineItem.getBoundingClientRect().top <=
						window.innerHeight * 0.8
				) {
					$( timelineItem ).removeClass( 'is-hidden' );
					$( timelineItem ).addClass( nextAnimationClass );
				}
			} );

			scrolling = false;
		};

		if ( animationClass ) {
			$( document ).on( 'scroll', () => {
				if ( scrolling ) {
					return;
				}

				scrolling = true;

				if ( ! window.requestAnimationFrame ) {
					window.setTimeout(
						() => checkScroll( animationClass ),
						250
					);
				} else {
					window.requestAnimationFrame( () =>
						checkScroll( animationClass )
					);
				}
			} );
		}

		const viewportHeightHalf = ( $( window ).height() || 0 ) / 2;

		const updateLineHeight = () => {
			const $points = $timeline.find( `.${ className }__point` );

			let lineHeight = 0;
			$points.each( ( pointIndex, point ) => {
				const nextPoint = $points[ pointIndex + 1 ];

				if ( nextPoint ) {
					lineHeight +=
						nextPoint.getBoundingClientRect().top -
						point.getBoundingClientRect().top;
				}
			} );

			const $line = $timeline.find( 'div[class$=__line]' );
			const first = $points.get()[ 0 ];

			if ( ! first ) {
				return;
			}

			const topOffset =
				$( first ).position().top + $( first ).height() / 2;

			$line.css( {
				height: lineHeight,
				top: topOffset,
			} );
		};

		const setColorByScroll = () => {
			const $points = $timeline.find( `.${ className }__point` );
			const [ first, ...rest ] = $points.get();

			if ( ! first || ! rest.length ) {
				return;
			}

			$points.each( ( pointIndex, point ) => {
				const pointOffsetTop = point.getBoundingClientRect().top;
				const timelineItem = $( point ).parents(
					`.${ className }`
				)[ 0 ];

				if ( pointOffsetTop <= viewportHeightHalf ) {
					if ( ! $( timelineItem ).hasClass( 'is-active' ) ) {
						$( timelineItem ).addClass( 'is-active' );
					}

					$( point )
						.find( ':first-child' )
						.css( {
							borderColor: pointColor || '',
						} );
				} else {
					if ( $( timelineItem ).hasClass( 'is-active' ) ) {
						$( timelineItem ).removeClass( 'is-active' );
					}

					$( point ).find( ':first-child' ).css( {
						borderColor: '',
					} );
				}
			} );
		};

		const updateBarHeight = () => {
			const $points = $timeline.find( `.${ className }__point` );
			const bar = $timeline.find( 'div[class*=__bar]' )[ 0 ];
			const [ first, ...rest ] = $points.toArray();

			if ( ! bar || ! first || ! rest.length ) {
				return;
			}

			const barOffsetTop = bar.getBoundingClientRect().top;
			const barHeight =
				viewportHeightHalf - first.getBoundingClientRect().top;
			const last = rest.slice( -1 ).pop();

			if ( ! last ) {
				return;
			}

			const lastOffsetTop = last.getBoundingClientRect().top;

			if (
				barOffsetTop <= viewportHeightHalf &&
				lastOffsetTop >= viewportHeightHalf
			) {
				$( bar ).css( { height: barHeight } );
			}

			if ( barOffsetTop >= viewportHeightHalf ) {
				$( bar ).css( { height: 0 } );
			}

			if ( lastOffsetTop <= viewportHeightHalf ) {
				$( bar ).css( { height: '100%' } );
			}
		};

		const waitLoadContent = window.setInterval( () => {
			if ( document.readyState !== 'complete' ) {
				return;
			}

			updateLineHeight();

			if ( useFilling ) {
				setColorByScroll();
				updateBarHeight();
				$( document ).on( 'scroll', () => {
					setColorByScroll();
					updateBarHeight();
				} );
			}

			window.clearInterval( waitLoadContent );
		}, 1000 );

		$( window ).on( 'resize', () => {
			updateLineHeight();

			if ( useFilling ) {
				setColorByScroll();
				updateBarHeight();
			}
		} );
	} );
}

$( () => {
	$( document.body ).on( 'post-load', initContentTimeline );
	initContentTimeline();
} );
