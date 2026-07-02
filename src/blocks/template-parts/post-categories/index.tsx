import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import metadata from './block.json';
import Edit from './edit';
import save from './save';
import type { TemplatePostCategoriesAttributes } from './types';

function getGetwidSettings() {
	return (
		window as unknown as {
			Getwid?: {
				settings?: { post_type?: string };
				templates?: { name?: string };
			};
		}
	 ).Getwid;
}

const getwidSettings = getGetwidSettings();
const isTemplateEditor =
	getwidSettings?.settings?.post_type === getwidSettings?.templates?.name;

registerBlockType(
	metadata as BlockConfiguration< TemplatePostCategoriesAttributes >,
	{
		title: __( 'Categories', 'getwid' ),
		icon: 'category',
		category: isTemplateEditor ? 'getwid-post-blocks' : 'getwid-blocks',
		supports: {
			...( metadata.supports || {} ),
			inserter: isTemplateEditor,
		},
		edit: Edit,
		save,
	}
);
