import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import metadata from './block.json';
import Edit from './edit';
import save from './save';
import type { TemplatePostDateAttributes } from './types';

const isTemplateEditor = Getwid.settings.post_type === Getwid.templates.name;

registerBlockType(
	metadata as BlockConfiguration< TemplatePostDateAttributes >,
	{
		title: __( 'Date', 'getwid' ),
		icon: 'calendar-alt',
		category: isTemplateEditor ? 'getwid-post-blocks' : 'getwid-blocks',
		supports: {
			...( metadata.supports || {} ),
			inserter: isTemplateEditor,
		},
		edit: Edit,
		save,
	}
);
