import { createBlock } from '@wordpress/blocks';
import { select } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import { convertBlockFrom as convertToContentTimeline } from '../content-timeline/transforms';

type ImageLike = {
	id?: number;
	url?: string;
	caption?: string;
};

type ImageSource = ImageLike[] | { images?: ImageLike[] };

function getImages( content: ImageSource ) {
	return Array.isArray( content ) ? content : content.images ?? [];
}

export function convertFromMediaSlider( content: ImageSource ) {
	const images = getImages( content );
	const sliderLabels = JSON.stringify(
		images.map( ( _item, index ) => `Slide ${ index + 1 }` )
	);

	return createBlock(
		'getwid/media-text-slider',
		{
			slideCount: images.length,
			sliderArrays: sliderLabels,
		},
		images.map( ( item, index ) =>
			createBlock(
				'getwid/media-text-slider-slide',
				{ slideId: index + 1 },
				[
					createBlock(
						'getwid/media-text-slider-slide-content',
						{
							mediaId: item.id,
							mediaUrl: item.url,
							mediaType: 'image',
						},
						[
							createBlock( 'core/heading', {
								placeholder: __( 'Write heading…', 'getwid' ),
								content: item.caption,
							} ),
							createBlock( 'core/paragraph', {
								placeholder: __( 'Write text…', 'getwid' ),
							} ),
						]
					),
				]
			)
		)
	);
}

export function convertBlockTo(
	attributes: { imageSize?: string },
	toBlock: string,
	ids: number[] | null
) {
	const images: ImageLike[] = [];
	const selectedClientId =
		select( 'core/block-editor' ).getSelectedBlockClientId();
	const block = selectedClientId
		? select( 'core/block-editor' ).getBlock( selectedClientId )
		: null;

	block?.innerBlocks.forEach( ( slide ) => {
		const contentBlock = slide.innerBlocks[ 0 ];

		if ( contentBlock?.attributes.mediaUrl !== undefined ) {
			if ( ids ) {
				ids.push( contentBlock.attributes.mediaId );
			}

			const heading = contentBlock.innerBlocks[ 0 ];

			images.push( {
				id: contentBlock.attributes.mediaId,
				url: contentBlock.attributes.mediaUrl,
				caption: ids ? undefined : heading?.attributes.content || '',
			} );
		}
	} );

	if ( toBlock === 'core/image' ) {
		if ( images.length ) {
			return images.map( ( { id, url, caption } ) =>
				createBlock( toBlock, { id, url, caption } )
			);
		}

		return createBlock( toBlock, {} );
	}

	if ( toBlock === 'getwid/content-timeline' ) {
		return convertToContentTimeline( images );
	}

	return createBlock( toBlock, {
		imageSize: ids ? attributes.imageSize : undefined,
		images: images.map( ( { id, url, caption } ) => ( {
			id,
			url,
			caption,
		} ) ),
		ids: ids ? ids.filter( Boolean ) : undefined,
	} );
}
