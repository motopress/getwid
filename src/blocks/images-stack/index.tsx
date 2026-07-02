import {
	createBlock,
	registerBlockType,
	type BlockConfiguration,
} from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { MaybeBlockIsDisabled } from 'getwid-components';

import metadata from './block.json';
import deprecated from './deprecated';
import Edit from './edit';
import Save from './save';
import type { ImagesStackAttributes, StackImage } from './types';
import { pickRelevantMediaFile, validAlignments } from './utils';

const blockName = 'getwid/images-stack';

const icon = (
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
		<path d="M14,10h8V2H14Zm6-6V8H16V4Z" />
		<path d="M12,12V0H0V18H7v6H24V12ZM2,16V2h8V16H2Zm20,6H9V18h3V14H22Z" />
	</svg>
);

registerBlockType( metadata as BlockConfiguration< ImagesStackAttributes >, {
	title: __( 'Image Stack Gallery', 'getwid' ),
	icon,
	transforms: {
		from: [
			{
				type: 'block',
				isMultiBlock: true,
				blocks: [ 'core/image' ],
				transform: ( imageAttributes: StackImage[] ) => {
					const firstAlign = imageAttributes[ 0 ]?.align;
					const align = imageAttributes.every(
						( image ) => image.align === firstAlign
					)
						? firstAlign
						: undefined;
					const validImages = imageAttributes.filter(
						( { id, url } ) => id && url
					);

					return createBlock( blockName, {
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
				type: 'block',
				blocks: [ 'core/gallery' ],
				transform: ( attributes: ImagesStackAttributes ) =>
					createBlock( blockName, attributes ),
			},
		],
		to: [
			{
				type: 'block',
				blocks: [ 'core/gallery' ],
				transform: ( attributes: ImagesStackAttributes ) =>
					createBlock( 'core/gallery', attributes ),
			},
			{
				type: 'block',
				blocks: [ 'getwid/images-slider' ],
				transform: ( attributes: ImagesStackAttributes ) =>
					createBlock( 'getwid/images-slider', attributes ),
			},
			{
				type: 'block',
				blocks: [ 'core/image' ],
				transform: ( { images, align }: ImagesStackAttributes ) => {
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
	},
	getEditWrapperProps( attributes: ImagesStackAttributes ) {
		const { align } = attributes;

		if ( align && validAlignments.includes( align ) ) {
			return { 'data-align': align };
		}

		return undefined;
	},
	edit: MaybeBlockIsDisabled( blockName ) || Edit,
	save: Save,
	deprecated,
} );

export { pickRelevantMediaFile };
