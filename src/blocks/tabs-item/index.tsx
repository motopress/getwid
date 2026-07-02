import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import metadata from './block.json';
import { deprecated } from './deprecated';
import Edit from './edit';
import Save from './save';
import type { TabsItemAttributes } from './types';

registerBlockType( metadata as BlockConfiguration< TabsItemAttributes >, {
	title: __( 'Tabs Item', 'getwid' ),
	deprecated,
	edit: Edit,
	save: Save,
} );
