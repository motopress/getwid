import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { MaybeBlockIsDisabled } from 'getwid-components';

import CustomPostTypeIcon from './icon';
import metadata from './block.json';
import Edit from './edit';
import Save from './save';
import transforms from './transforms';
import type { CustomPostTypeAttributes } from './types';

const blockName = 'getwid/custom-post-type';

registerBlockType( metadata as BlockConfiguration< CustomPostTypeAttributes >, {
	title: __( 'Custom Post Type', 'getwid' ),
	icon: <CustomPostTypeIcon />,
	transforms,
	edit: MaybeBlockIsDisabled( blockName ) || Edit,
	save: Save,
} );
