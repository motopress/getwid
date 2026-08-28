import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { MaybeBlockIsDisabled } from 'getwid-components';

import IconBlockIcon from './icon';
import metadata from './block.json';
import Edit from './edit';
import Save from './save';
import transforms from './transforms';
import type { IconAttributes } from './types';

const blockName = 'getwid/icon';

registerBlockType( metadata as BlockConfiguration< IconAttributes >, {
	title: __( 'Icon', 'getwid' ),
	icon: <IconBlockIcon />,
	transforms,
	edit: MaybeBlockIsDisabled( blockName ) || Edit,
	save: Save,
} );
