import type { MediaObject } from './types';

export function getThumbnailUrl( image: MediaObject ) {
	if ( ! image.sizes ) {
		return image.url;
	}

	if ( ! Object.keys( image.sizes ).includes( 'thumbnail' ) ) {
		return image.sizes.full?.url || image.url;
	}

	return image.sizes.thumbnail?.url || image.url;
}
