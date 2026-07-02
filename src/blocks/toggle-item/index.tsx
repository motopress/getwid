import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import metadata from './block.json';
import Edit from './edit';
import Save from './save';
import type { ToggleItemAttributes } from './types';

registerBlockType( metadata as BlockConfiguration< ToggleItemAttributes >, {
	title: __( 'Toggle Item', 'getwid' ),
	edit: Edit,
	save: Save,
} );
