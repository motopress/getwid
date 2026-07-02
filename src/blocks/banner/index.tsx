import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { MaybeBlockIsDisabled } from 'getwid-components';

import { deprecated } from './deprecated';
import Edit from './edit';
import BannerIcon from './icon';
import metadata from './block.json';
import Save from './save';
import { transforms } from './transforms';
import type { BannerAttributes } from './types';

registerBlockType( metadata as BlockConfiguration< BannerAttributes >, {
	title: __( 'Banner', 'getwid' ),
	description: __( 'Link an image or video with a text overlay.', 'getwid' ),
	icon: <BannerIcon />,
	deprecated,
	transforms,
	edit: MaybeBlockIsDisabled( 'getwid/banner' ) || Edit,
	save: Save,
} );
