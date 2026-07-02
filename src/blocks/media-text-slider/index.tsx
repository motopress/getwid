import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { MaybeBlockIsDisabled } from 'getwid-components';

import metadata from './block.json';
import deprecated from './deprecated';
import Edit from './edit';
import MediaTextSliderIcon from './icon';
import Save from './save';
import { convertBlockTo, convertFromMediaSlider } from './transforms';
import type { MediaTextSliderAttributes } from './types';

const blockName = 'getwid/media-text-slider';

registerBlockType(
	metadata as BlockConfiguration< MediaTextSliderAttributes >,
	{
		title: __( 'Media & Text Slider', 'getwid' ),
		icon: <MediaTextSliderIcon />,
		transforms: {
			from: [
				{
					type: 'block',
					blocks: [ 'core/gallery' ],
					transform: convertFromMediaSlider,
				},
				{
					type: 'block',
					blocks: [ 'getwid/images-stack' ],
					transform: convertFromMediaSlider,
				},
				{
					type: 'block',
					blocks: [ 'getwid/images-slider' ],
					transform: convertFromMediaSlider,
				},
				{
					type: 'block',
					isMultiBlock: true,
					blocks: [ 'core/image' ],
					transform: convertFromMediaSlider,
				},
			],
			to: [
				{
					type: 'block',
					blocks: [ 'core/gallery' ],
					transform: ( attributes ) =>
						convertBlockTo( attributes, 'core/gallery', null ),
				},
				{
					type: 'block',
					blocks: [ 'getwid/images-stack' ],
					transform: ( attributes ) =>
						convertBlockTo( attributes, 'getwid/images-stack', [] ),
				},
				{
					type: 'block',
					blocks: [ 'getwid/images-slider' ],
					transform: ( attributes ) =>
						convertBlockTo(
							attributes,
							'getwid/images-slider',
							[]
						),
				},
				{
					type: 'block',
					blocks: [ 'core/image' ],
					transform: ( attributes ) =>
						convertBlockTo( attributes, 'core/image', null ),
				},
				{
					type: 'block',
					blocks: [ 'getwid/content-timeline' ],
					transform: ( attributes ) =>
						convertBlockTo(
							attributes,
							'getwid/content-timeline',
							null
						),
				},
			],
		},
		deprecated,
		edit: MaybeBlockIsDisabled( blockName ) || Edit,
		save: Save,
	}
);
