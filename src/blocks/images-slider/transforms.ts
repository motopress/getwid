import { createBlock } from '@wordpress/blocks';

import type { ImagesSliderAttributes, SliderImage } from './types';

const transforms = {
	from: [
		{
			type: 'block' as const,
			isMultiBlock: true,
			blocks: [ 'core/image' ],
			transform: ( attributes: SliderImage[] ) => {
				let { align } = attributes[ 0 ];
				align = attributes.every( ( image ) => image.align === align )
					? align
					: undefined;
				const validImages = attributes.filter( ( { id, url } ) =>
					Boolean( id && url )
				);

				return createBlock( 'getwid/images-slider', {
					images: validImages.map(
						( { id, url, alt, caption } ) => ( {
							id,
							url,
							alt,
							caption,
						} )
					),
					ids: validImages.map( ( { id } ) => id ),
					align,
				} );
			},
		},
		{
			type: 'block' as const,
			blocks: [ 'core/gallery' ],
			transform: ( attributes: ImagesSliderAttributes ) =>
				createBlock( 'getwid/images-slider', attributes ),
		},
	],
	to: [
		{
			type: 'block' as const,
			blocks: [ 'core/gallery' ],
			transform: ( attributes: ImagesSliderAttributes ) =>
				createBlock( 'core/gallery', attributes ),
		},
		{
			type: 'block' as const,
			blocks: [ 'getwid/images-stack' ],
			transform: ( attributes: ImagesSliderAttributes ) =>
				createBlock( 'getwid/images-stack', attributes ),
		},
		{
			type: 'block' as const,
			blocks: [ 'core/image' ],
			transform: ( { images, align }: ImagesSliderAttributes ) => {
				if ( images.length > 0 ) {
					return images.map( ( { id, url, alt, caption } ) =>
						createBlock( 'core/image', {
							id,
							url,
							alt,
							caption,
							align,
						} )
					);
				}

				return createBlock( 'core/image', { align } );
			},
		},
	],
};

export default transforms;
