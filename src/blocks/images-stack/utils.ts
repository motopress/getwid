import clsx from 'clsx';

import type { ImagesStackAttributes, StackImage } from './types';

export const baseClass = 'wp-block-getwid-images-stack';

export const validAlignments = [ 'center', 'wide', 'full' ];

export function chunkImages< T >( items: T[], size: number ) {
	const chunks: T[][] = [];

	for ( let index = 0; index < items.length; index += size ) {
		chunks.push( items.slice( index, index + size ) );
	}

	return chunks;
}

export function getImageUrl( image: StackImage, imageSize: string ) {
	return (
		image.media_details?.sizes?.[ imageSize ]?.source_url ||
		image.media_details?.sizes?.large?.source_url ||
		image.media_details?.sizes?.full?.source_url ||
		image.sizes?.[ imageSize ]?.url ||
		image.url ||
		image.source_url
	);
}

export function pickRelevantMediaFile( image: StackImage, imageSize: string ) {
	return {
		id: image.id,
		link: image.link,
		caption:
			typeof image.caption === 'string' ||
			typeof image.caption === 'undefined'
				? image.caption
				: image.caption.raw,
		original_url: image.url || image.source_url,
		alt: image.alt || image.alt_text,
		url: getImageUrl( image, imageSize ),
	};
}

export function getContainerClassName(
	attributes: ImagesStackAttributes,
	className?: string
) {
	const { align, stackStyle } = attributes;

	return clsx(
		className,
		{
			[ `is-layout-${ stackStyle }` ]: stackStyle !== 'default',
		},
		align ? `align${ align }` : null
	);
}

export function getImageHref( image: StackImage, linkTo: string ) {
	switch ( linkTo ) {
		case 'media':
			return image.original_url;
		case 'attachment':
			return image.link;
		default:
			return undefined;
	}
}

export function getIdsFromImages( images: StackImage[] ) {
	return images.map( ( image ) => image.id );
}
