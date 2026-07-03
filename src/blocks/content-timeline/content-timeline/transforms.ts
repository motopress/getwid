import { createBlock } from '@wordpress/blocks';
import { select } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

type ImageLike = {
	id?: number;
	url?: string;
	alt?: string;
	caption?: string;
};

type GalleryLike = {
	images?: ImageLike[];
	imageSize?: string;
};

type BlockLike = {
	attributes: Record< string, unknown >;
	innerBlocks: BlockLike[];
};

function normalizeImages( content: GalleryLike | ImageLike[] ): ImageLike[] {
	return Array.isArray( content ) ? content : content.images || [];
}

export function convertBlockFrom( content: GalleryLike | ImageLike[] ) {
	const images = normalizeImages( content );
	const imageSize = Array.isArray( content ) ? undefined : content.imageSize;

	return createBlock(
		'getwid/content-timeline',
		{
			filling: 'false',
		},
		images.map( ( item ) =>
			createBlock(
				'getwid/content-timeline-item',
				{
					id: item.id,
					alt: item.alt,
					url: item.url,
					imageSize,
				},
				[
					createBlock( 'core/heading', {
						placeholder: __( 'Write heading…', 'getwid' ),
						content: item.caption,
					} ),
					createBlock( 'core/paragraph', {
						placeholder: __( 'Write heading…', 'getwid' ),
					} ),
				]
			)
		)
	);
}

function getTimelineImages() {
	const store = select( 'core/block-editor' ) as {
		getSelectedBlockClientId: () => string | null;
		getBlock: ( clientId: string | null ) => BlockLike | null;
	};
	const clientId = store.getSelectedBlockClientId();
	const innerBlocks = store.getBlock( clientId )?.innerBlocks || [];

	return innerBlocks
		.filter( ( item ) => typeof item.attributes.url !== 'undefined' )
		.map( ( item ) => {
			const heading = item.innerBlocks[ 0 ];

			return {
				id: item.attributes.id as number | undefined,
				url: item.attributes.url as string | undefined,
				alt: item.attributes.alt as string | undefined,
				caption: heading?.attributes.content as string | undefined,
				imageSize: item.attributes.imageSize as string | undefined,
			};
		} );
}

export function convertBlockTo( name: string ) {
	const images = getTimelineImages();

	if ( name === 'core/image' ) {
		if ( images.length ) {
			return images.map( ( { id, url, alt, caption } ) =>
				createBlock( name, {
					id,
					url,
					alt,
					caption,
				} )
			);
		}

		return createBlock( name, {} );
	}

	if ( name === 'getwid/media-text-slider' ) {
		return createBlock(
			'getwid/media-text-slider',
			{
				slideCount: images.length,
				sliderArrays: JSON.stringify(
					images.map( ( _image, index ) => `Slide ${ index + 1 }` )
				),
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
							},
							[
								createBlock( 'core/heading', {
									placeholder: __(
										'Write heading…',
										'getwid'
									),
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

	return createBlock( name, {
		imageSize: images[ 0 ]?.imageSize,
		images: images.map( ( { id, url, alt, caption } ) => ( {
			id,
			url,
			alt,
			caption,
		} ) ),
		ids: images.map( ( { id } ) => id ),
	} );
}

export const transforms = {
	from: [
		{
			type: 'block' as const,
			blocks: [ 'core/gallery' ],
			transform: convertBlockFrom,
		},
		{
			type: 'block' as const,
			isMultiBlock: true,
			blocks: [ 'core/image' ],
			transform: convertBlockFrom,
		},
		{
			type: 'block' as const,
			blocks: [ 'getwid/images-stack' ],
			transform: convertBlockFrom,
		},
		{
			type: 'block' as const,
			blocks: [ 'getwid/images-slider' ],
			transform: convertBlockFrom,
		},
	],
	to: [
		{
			type: 'block' as const,
			blocks: [ 'core/gallery' ],
			transform: () => convertBlockTo( 'core/gallery' ),
		},
		{
			type: 'block' as const,
			blocks: [ 'core/image' ],
			transform: () => convertBlockTo( 'core/image' ),
		},
		{
			type: 'block' as const,
			blocks: [ 'getwid/images-stack' ],
			transform: () => convertBlockTo( 'getwid/images-stack' ),
		},
		{
			type: 'block' as const,
			blocks: [ 'getwid/images-slider' ],
			transform: () => convertBlockTo( 'getwid/images-slider' ),
		},
		{
			type: 'block' as const,
			blocks: [ 'getwid/media-text-slider' ],
			transform: () => convertBlockTo( 'getwid/media-text-slider' ),
		},
	],
};
