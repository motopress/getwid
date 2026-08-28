import clsx from 'clsx';

import {
	baseClass,
	imageBackgroundType,
	videoBackgroundType,
} from './constants';
import type { BannerAttributes, ColorValue, MediaObject } from './types';

export function getMediaType( media: MediaObject ) {
	if ( media.media_type ) {
		return media.media_type === imageBackgroundType
			? imageBackgroundType
			: videoBackgroundType;
	}

	if (
		media.type !== imageBackgroundType &&
		media.type !== videoBackgroundType
	) {
		return undefined;
	}

	return media.type;
}

export function getMediaUrl( media: MediaObject, imageSize: string ) {
	return (
		media.media_details?.sizes?.[ imageSize ]?.source_url ||
		media.media_details?.sizes?.large?.source_url ||
		media.media_details?.sizes?.full?.source_url ||
		media.sizes?.[ imageSize ]?.url ||
		media.url
	);
}

export function getWrapperClassName( attributes: BannerAttributes ) {
	const {
		align,
		backgroundOpacity,
		blockAnimation,
		horizontalAlign,
		textAnimation,
		verticalAlign,
	} = attributes;

	return clsx( {
		[ `has-animation-${ blockAnimation }` ]: blockAnimation !== 'none',
		[ `has-text-animation-${ textAnimation }` ]: textAnimation !== 'none',
		[ `has-foreground-${ backgroundOpacity }` ]: backgroundOpacity !== 35,
		[ `has-vertical-alignment-${ verticalAlign }` ]:
			verticalAlign !== 'center',
		[ `has-horizontal-alignment-${ horizontalAlign }` ]:
			horizontalAlign !== 'center',
		alignwide: align === 'wide',
		alignfull: align === 'full',
	} );
}

export function getImageProps(
	attributes: BannerAttributes,
	backgroundColor: ColorValue = {}
) {
	return {
		className: clsx( `${ baseClass }__wrapper`, {
			'has-background':
				backgroundColor.color || attributes.customBackgroundColor,
			[ backgroundColor.class ?? '' ]: backgroundColor.class,
		} ),
		style: {
			backgroundColor: backgroundColor.color
				? undefined
				: attributes.customBackgroundColor,
		},
	};
}

export function getCaptionProps(
	attributes: BannerAttributes,
	textColor: ColorValue = {}
) {
	return {
		className: clsx( `${ baseClass }__caption`, {
			'has-text-color': textColor.color || attributes.customTextColor,
			[ textColor.class ?? '' ]: textColor.class,
		} ),
		style: {
			color: textColor.color ? undefined : attributes.customTextColor,
			minHeight: attributes.minHeight,
		},
	};
}
