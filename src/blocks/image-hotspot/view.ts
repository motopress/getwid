import jQuery from 'jquery';

import type { RuntimeGlobal } from './types';
import { animateElement, baseClass } from './utils';

function initImageHotspot() {
	const runtimeGlobal = window as RuntimeGlobal;
	const hotspots = jQuery( `.${ baseClass }:not(.getwid-init)` );

	if ( ! hotspots.length || ! runtimeGlobal.tippy ) {
		return;
	}

	hotspots.each( function ( _index, imageHotspot ) {
		const hotspot = jQuery( imageHotspot );
		const tooltipTrigger = hotspot.data( 'trigger' );
		const tooltipTheme = hotspot.data( 'theme' );
		const tooltipAnimation = hotspot.data( 'tooltip-animation' );
		const tooltipArrow = hotspot.data( 'arrow' );
		const imagePoints = hotspot.data( 'image-points' ) || [];

		hotspot.addClass( 'getwid-init' );

		jQuery( `.getwid-animation .${ baseClass }__dot` ).on(
			'mouseenter',
			function () {
				animateElement( jQuery( this ), {
					animation: jQuery( this )
						.closest( '.getwid-animation' )
						.attr( 'data-animation' ),
				} );
			}
		);

		hotspot
			.find( `.${ baseClass }__dot` )
			.each( function ( _dotIndex, dot ) {
				const element = jQuery( dot );
				const pointId = Number( element.data( 'point-id' ) );
				const point = imagePoints[ pointId ] || {};
				const unescape =
					runtimeGlobal._unescape || ( ( value: string ) => value );
				const title = unescape(
					element.find( `.${ baseClass }__dot-title` ).html() || ''
				);
				const content = unescape( point.content || '' );
				const tooltip = runtimeGlobal.tippy?.( dot, {
					maxWidth: parseInt( String( point.popUpWidth ), 10 ),
					hideOnClick:
						tooltipTrigger === 'multiple' ? 'toggle' : true,
					theme: tooltipTheme,
					animation: tooltipAnimation,
					animateFill: false,
					interactive: true,
					trigger:
						tooltipTrigger === 'hover' ? 'mouseenter' : 'click',
					arrow: tooltipArrow,
					placement: point.placement,
					allowHTML: true,
					content: `<div class="${ baseClass }__tooltip"><div class="${ baseClass }__tooltip-title">${ title }</div><div class="${ baseClass }__tooltip-content">${ content }</div></div>`,
				} );

				if ( point.popUpOpen ) {
					setTimeout( () => {
						tooltip?.show?.();
					}, 1000 );
				}

				element.find( `.${ baseClass }__dot-description` ).remove();

				if ( runtimeGlobal.Waypoint ) {
					new runtimeGlobal.Waypoint( {
						element: dot,
						handler() {
							jQuery( this.element ).addClass( 'is-visible' );
						},
						offset: '100%',
					} );
				}
			} );
	} );
}

jQuery( document ).ready( () => {
	jQuery( document.body ).on( 'post-load', initImageHotspot );

	initImageHotspot();
} );
