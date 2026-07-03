import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import metadata from './block.json';
import Edit from './edit';
import Save from './save';

registerBlockType( metadata, {
	title: __( 'Accordion Item', 'getwid' ),
	edit: Edit,
	save: Save,
} );
