import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { MaybeBlockIsDisabled } from 'getwid-components';

import metadata from './block.json';
import Edit from './edit';
import Save from './save';
import type { TableAttributes } from './types';

const blockName = 'getwid/table';

registerBlockType( metadata as BlockConfiguration< TableAttributes >, {
	title: __( 'Table', 'getwid' ),
	icon: 'editor-table',
	edit: MaybeBlockIsDisabled( blockName ) || Edit,
	save: Save,
} );
