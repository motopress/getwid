import jQuery from 'jquery';

import type {
	ImageHotspotAttributes,
	ImageHotspotPoint,
	MediaObject,
} from './types';

export const baseClass = 'wp-block-getwid-image-hotspot';

export function getImageUrl( media: MediaObject, imageSize: string ) {
	return (
		media.media_details?.sizes?.[ imageSize ]?.source_url ||
		media.media_details?.sizes?.large?.source_url ||
		media.media_details?.sizes?.full?.source_url ||
		media.sizes?.[ imageSize ]?.url ||
		media.url
	);
}

export function parseImagePoints( imagePoints?: string ): ImageHotspotPoint[] {
	if ( ! imagePoints ) {
		return [];
	}

	try {
		return JSON.parse( imagePoints ) as ImageHotspotPoint[];
	} catch ( error ) {
		return [];
	}
}

export function getBlockClassName( attributes: ImageHotspotAttributes ) {
	const { hoverAnimation, dotAppearanceAnimation } = attributes;

	return {
		'getwid-animation': !! hoverAnimation,
		'has-animated-dots': dotAppearanceAnimation !== 'none',
	};
}

export function decodeEntities( value?: string ) {
	if ( ! value ) {
		return '';
	}

	const element = document.createElement( 'textarea' );
	element.innerHTML = value;

	return element.value;
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
