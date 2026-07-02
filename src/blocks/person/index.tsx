import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { MaybeBlockIsDisabled } from 'getwid-components';

import metadata from './block.json';
import deprecated from './deprecated';
import Edit from './edit';
import PersonIcon from './icon';
import Save from './save';
import transforms from './transforms';
import type { PersonAttributes } from './types';

const blockName = 'getwid/person';

registerBlockType( metadata as BlockConfiguration< PersonAttributes >, {
	title: __( 'Person', 'getwid' ),
	icon: <PersonIcon />,
	transforms,
	deprecated,
	edit: MaybeBlockIsDisabled( blockName ) || Edit,
	save: Save,
} );
