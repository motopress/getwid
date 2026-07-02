import jQuery from 'jquery';

import { animateElement, baseClass } from './utils';

function initImageBoxes() {
	const imageBoxes = jQuery( `.${ baseClass }:not(.getwid-init)` );

	imageBoxes.each( ( _index, imageBox ) => {
		const $imageBox = jQuery( imageBox );

		$imageBox.addClass( 'getwid-init' );

		$imageBox
			.filter( `.getwid-animation.${ baseClass }` )
			.on( 'mouseenter', function () {
				animateElement(
					jQuery( this ).find(
						`.${ baseClass }__image-wrapper`
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
		initImageBoxes();
	} );

	initImageBoxes();
} );
