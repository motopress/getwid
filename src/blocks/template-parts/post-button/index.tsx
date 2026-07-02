import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import metadata from './block.json';
import Edit from './edit';
import save from './save';
import type { TemplatePostButtonAttributes } from './types';

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

const icon = (
	<svg
		width="24"
		height="24"
		viewBox="0 0 24 24"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path fill="none" d="M0 0h24v24H0V0z" />
		<g>
			<path d="M19 6H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H5V8h14v8z" />
		</g>
	</svg>
);

const getwidSettings = getGetwidSettings();
const isTemplateEditor =
	getwidSettings?.settings?.post_type === getwidSettings?.templates?.name;

registerBlockType(
	metadata as BlockConfiguration< TemplatePostButtonAttributes >,
	{
		title: __( 'Button', 'getwid' ),
		icon,
		category: isTemplateEditor ? 'getwid-post-blocks' : 'getwid-blocks',
		supports: {
			...( metadata.supports || {} ),
			inserter: isTemplateEditor,
		},
		edit: Edit,
		save,
	}
);
