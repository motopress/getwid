import jQuery from 'jquery';

import type { ImageBoxAttributes, InnerBlock, MediaObject } from './types';

export const baseClass = 'wp-block-getwid-image-box';

export function getImageUrl( media: MediaObject, imageSize: string ) {
	return (
		media.media_details?.sizes?.[ imageSize ]?.source_url ||
		media.media_details?.sizes?.large?.source_url ||
		media.media_details?.sizes?.full?.source_url ||
		media.sizes?.[ imageSize ]?.url ||
		media.url
	);
}

export function getBlockClassName( attributes: ImageBoxAttributes ) {
	const {
		hoverAnimation,
		layout,
		textAlignment,
		mobileLayout,
		mobileAlignment,
	} = attributes;

	return {
		'getwid-animation': !! hoverAnimation,
		'has-image-left': layout === 'left',
		'has-image-right': layout === 'right',
		'has-text-left': textAlignment === 'left',
		'has-text-center': textAlignment === 'center',
		'has-text-right': textAlignment === 'right',
		[ `has-mobile-layout-${ mobileLayout }` ]: !! mobileLayout,
		[ `has-mobile-alignment-${ mobileAlignment }` ]: !! mobileAlignment,
	};
}

export function getImageContainerClassName( attributes: ImageBoxAttributes ) {
	const { imagePosition } = attributes;

	return {
		'is-position-top': imagePosition === 'top',
		'is-position-middle': imagePosition === 'middle',
		'is-position-bottom': imagePosition === 'bottom',
	};
}

export function getInnerContent(
	innerBlocks: InnerBlock[],
	blockName: string
) {
	return innerBlocks.find( ( item ) => item.name === blockName )?.attributes
		.content;
}

export function getInnerTextContent( innerBlocks: InnerBlock[] ) {
	return {
		heading: getInnerContent( innerBlocks, 'core/heading' ) || '',
		text: getInnerContent( innerBlocks, 'core/paragraph' ) || '',
	};
}

export function animateElement(
	element: JQuery< HTMLElement >,
	animationSettings: {
		animation?: string;
		duration?: string;
		delay?: string;
	},
	callback?: () => void
) {
	const animationEnd = ( () => {
		const elementStyle = document.createElement( 'div' ).style;
		const animations = {
			animation: 'animationend',
			OAnimation: 'oAnimationEnd',
			MozAnimation: 'mozAnimationEnd',
			WebkitAnimation: 'webkitAnimationEnd',
		};

		for ( const key in animations ) {
			if ( key in elementStyle ) {
				return animations[ key as keyof typeof animations ];
			}
		}

		return 'animationend';
	} )();
	const animationName = animationSettings.animation || '';
	const animationDuration = animationSettings.duration || '1s';
	const animationDelay = animationSettings.delay || '0s';

	element.css( {
		'animation-duration': animationDuration,
		'animation-delay': animationDelay,
		'-webkit-animation-delay': animationDelay,
	} );

	element
		.addClass( `animated ${ animationName }` )
		.one( animationEnd, function () {
			jQuery( this ).removeClass( `animated ${ animationName }` );

			if ( typeof callback === 'function' ) {
				callback();
			}
		} );
}
