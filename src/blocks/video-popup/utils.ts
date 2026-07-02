import clsx from 'clsx';

import type { MediaObject, VideoPopupAttributes } from './types';

export const baseClass = 'wp-block-getwid-video-popup';
export const allowedMediaTypes = [ 'image' ];

export function getImageUrl( media: MediaObject, imageSize: string ) {
	return (
		media.media_details?.sizes?.[ imageSize ]?.source_url ||
		media.media_details?.sizes?.large?.source_url ||
		media.media_details?.sizes?.full?.source_url ||
		media.sizes?.[ imageSize ]?.url ||
		media.url
	);
}

export function getWrapperClassName( attributes: VideoPopupAttributes ) {
	const { url, align, imageAnimation, overlayOpacity } = attributes;

	return clsx(
		{
			'has-image': url !== undefined,
			[ `has-animation-${ imageAnimation }` ]: imageAnimation !== 'none',
			[ `has-foreground-${ overlayOpacity }` ]: overlayOpacity !== 35,
		},
		align ? `align${ align }` : undefined
	);
}
