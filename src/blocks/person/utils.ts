import type { MediaObject } from './types';

export const baseClass = 'wp-block-getwid-person';

export function getImageUrl( media: MediaObject, imageSize: string ) {
	return (
		media.media_details?.sizes?.[ imageSize ]?.source_url ||
		media.media_details?.sizes?.large?.source_url ||
		media.media_details?.sizes?.full?.source_url ||
		media.sizes?.[ imageSize ]?.url ||
		media.url
	);
}
