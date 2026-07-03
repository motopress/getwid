import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { MaybeBlockIsDisabled } from 'getwid-components';

import metadata from './block.json';
import { deprecated } from './deprecated';
import Edit from './edit';
import ToggleIcon from './icon';
import Save from './save';
import { transforms } from './transforms';
import type { ToggleAttributes } from './types';

const blockName = 'getwid/toggle';

registerBlockType( metadata as BlockConfiguration< ToggleAttributes >, {
	title: __( 'Toggle', 'getwid' ),
	icon: <ToggleIcon />,
	deprecated,
	transforms,
	edit: MaybeBlockIsDisabled( blockName ) || Edit,
	save: Save,
} );
