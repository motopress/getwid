import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { MaybeBlockIsDisabled } from 'getwid-components';

import IconBoxIcon from './icon';
import metadata from './block.json';
import Edit from './edit';
import Save from './save';
import transforms from './transforms';
import type { IconBoxAttributes } from './types';

const blockName = 'getwid/icon-box';

registerBlockType( metadata as BlockConfiguration< IconBoxAttributes >, {
	title: __( 'Icon Box', 'getwid' ),
	icon: <IconBoxIcon />,
	transforms,
	example: {
		attributes: {
			icon: 'fab fa-wordpress',
			iconStyle: 'default',
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
} );
