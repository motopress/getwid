import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { MaybeBlockIsDisabled } from 'getwid-components';

import metadata from './block.json';
import deprecated from './deprecated';
import Edit from './edit';
import ImagesSliderIcon from './icon';
import Save from './save';
import transforms from './transforms';
import type { ImagesSliderAttributes } from './types';

const blockName = 'getwid/images-slider';

registerBlockType( metadata as BlockConfiguration< ImagesSliderAttributes >, {
	title: __( 'Image Slider', 'getwid' ),
	icon: <ImagesSliderIcon />,
	transforms,
	example: {
		attributes: {
			images: [
				{
					id: 1,
					url: 'https://cldup.com/cXyG__fTLN.jpg',
					alt: '',
				},
				{
					id: 2,
					url: 'https://cldup.com/cXyG__fTLN.jpg',
					alt: '',
				},
			],
			ids: [ 1, 2 ],
		},
	},
	edit: MaybeBlockIsDisabled( blockName ) || Edit,
	save: Save,
	deprecated,
} );
