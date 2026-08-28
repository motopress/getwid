import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import metadata from './block.json';
import Edit from './edit';
import save from './save';
import type { TemplatePostFeaturedBackgroundImageAttributes } from './types';

const isTemplateEditor = Getwid.settings.post_type === Getwid.templates.name;

registerBlockType(
	metadata as BlockConfiguration< TemplatePostFeaturedBackgroundImageAttributes >,
	{
		title: __( 'Background Featured Image', 'getwid' ),
		icon: 'images-alt2',
		category: isTemplateEditor ? 'getwid-post-blocks' : 'getwid-blocks',
		supports: {
			...( metadata.supports || {} ),
			inserter: isTemplateEditor,
		},
		edit: Edit,
		save,
	}
);
