import jQuery from 'jquery';

import { animateElement } from './utils';

function initIcons() {
	const icons = jQuery( '.wp-block-getwid-icon:not(.getwid-init)' );

	icons.each( ( _index, icon ) => {
		const $icon = jQuery( icon );

		$icon.addClass( 'getwid-init' );

		$icon
			.find( '.getwid-animation.wp-block-getwid-icon__wrapper' )
			.on( 'mouseenter', function () {
				animateElement( jQuery( this ), {
					animation: jQuery( this ).attr( 'data-animation' ),
				} );
			} );
	} );
}

jQuery( document ).ready( () => {
	jQuery( document.body ).on( 'post-load', () => {
		initIcons();
	} );

	initIcons();
} );
