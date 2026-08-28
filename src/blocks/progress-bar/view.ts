import jQuery from 'jquery';

import type { WaypointConstructor } from './types';

declare global {
	interface Window {
		Waypoint?: WaypointConstructor;
	}
}

const baseClass = '.wp-block-getwid-progress-bar';

function setProgress( $block: JQuery, fillAmount: number ) {
	$block
		.find( `${ baseClass }__progress` )
		.css( 'width', `${ fillAmount }%` );
	$block.find( `${ baseClass }__percent` ).text( `${ fillAmount }%` );
}

function animateProgress( $block: JQuery, fillAmount: number ) {
	const $progress = $block.find( `${ baseClass }__progress` );

	$progress.animate(
		{ width: `${ fillAmount }%` },
		{
			duration: 2000,
			progress: () => {
				const parentWidth = $progress.parent().width() || 1;
				const percent = Math.round(
					( ( $progress.width() || 0 ) / parentWidth ) * 100
				);

				$block.find( `${ baseClass }__percent` ).text( percent + '%' );
			},
		}
	);
}

function initProgressBars() {
	const Waypoint = window.Waypoint;

	if ( typeof Waypoint !== 'function' ) {
		return;
	}

	jQuery( '.wp-block-getwid-progress-bar:not(.getwid-init)' ).each(
		( _index, progressBar ) => {
			const $progressBar = jQuery( progressBar );
			const $wrapper = $progressBar.find( `${ baseClass }__wrapper` );
			const wrapper = $wrapper.get( 0 );
			const fillAmount = Number.parseInt(
				String( $wrapper.data( 'fill-amount' ) || '0' ),
				10
			);
			const isAnimated = Boolean( $wrapper.data( 'is-animated' ) );

			if ( ! wrapper ) {
				return;
			}

			$progressBar.addClass( 'getwid-init' );

			const waypoint = new Waypoint( {
				element: wrapper,
				handler: () => {
					if ( isAnimated ) {
						animateProgress( $progressBar, fillAmount );
					} else {
						setProgress( $progressBar, fillAmount );
					}

					waypoint.destroy();
				},
				offset: '100%',
			} );

			jQuery( window ).on( 'resize', () => {
				setProgress( $progressBar, fillAmount );
			} );
		}
	);
}

jQuery( document ).ready( () => {
	jQuery( document.body ).on( 'post-load', () => {
		initProgressBars();
	} );

	initProgressBars();
} );
