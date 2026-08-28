import jQuery from 'jquery';

import { animateElement } from './utils';

const baseClass = 'wp-block-getwid-icon-box';

function initIconBoxes() {
	const iconBoxes = jQuery( `.${ baseClass }:not(.getwid-init)` );

	iconBoxes.each( ( _index, iconBox ) => {
		const $iconBox = jQuery( iconBox );

		$iconBox.addClass( 'getwid-init' );

		$iconBox
			.filter( `.getwid-animation.${ baseClass }` )
			.on( 'mouseenter', function () {
				animateElement(
					jQuery( this ).find(
						`.${ baseClass }__icon-wrapper`
					) as JQuery< HTMLElement >,
					{
						animation: jQuery( this ).attr( 'data-animation' ),
					}
				);
			} );
	} );
}

jQuery( document ).ready( () => {
	jQuery( document.body ).on( 'post-load', () => {
		initIconBoxes();
	} );

	initIconBoxes();
} );
