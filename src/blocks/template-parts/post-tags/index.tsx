import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import metadata from './block.json';
import Edit from './edit';
import save from './save';
import type { TemplatePostTagsAttributes } from './types';

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
	metadata as BlockConfiguration< TemplatePostTagsAttributes >,
	{
		title: __( 'Tags', 'getwid' ),
		icon: 'tag',
		category: isTemplateEditor ? 'getwid-post-blocks' : 'getwid-blocks',
		supports: {
			...( metadata.supports || {} ),
			inserter: isTemplateEditor,
		},
		edit: Edit,
		save,
	}
);
