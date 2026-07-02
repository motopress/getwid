import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { MaybeBlockIsDisabled } from 'getwid-components';

import ImageBoxIcon from './icon';
import metadata from './block.json';
import Edit from './edit';
import Save from './save';
import deprecated from './deprecated';
import transforms from './transforms';
import type { ImageBoxAttributes } from './types';

const blockName = 'getwid/image-box';

registerBlockType( metadata as BlockConfiguration< ImageBoxAttributes >, {
	title: __( 'Image Box', 'getwid' ),
	icon: <ImageBoxIcon />,
	transforms,
	example: {
		attributes: {
			url: 'https://cldup.com/cXyG__fTLN.jpg',
			textAlignment: 'center',
		},
		innerBlocks: [
			{
				name: 'core/heading',
				attributes: {
					content: 'Title',
				},
			},
			{
				name: 'core/paragraph',
				attributes: {
					content:
						'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
				},
			},
		],
	},
	edit: MaybeBlockIsDisabled( blockName ) || Edit,
	save: Save,
	deprecated,
} );
