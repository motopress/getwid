import {
	registerBlockType,
	unregisterBlockType,
	type BlockConfiguration,
} from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import metadata from './block.json';
import Edit from './edit';
import save from './save';
import type { TemplateAcfBackgroundImageAttributes } from './types';

function getGetwidSettings() {
	return (
		window as unknown as {
			Getwid?: {
				settings?: { post_type?: string };
				templates?: { name?: string };
				acf_exist?: string;
			};
		}
	 ).Getwid;
}

const getwidSettings = getGetwidSettings();
const isTemplateEditor =
	getwidSettings?.settings?.post_type === getwidSettings?.templates?.name;

registerBlockType(
	metadata as BlockConfiguration< TemplateAcfBackgroundImageAttributes >,
	{
		title: __( 'ACF Background Image', 'getwid' ),
		icon: 'images-alt2',
		category: isTemplateEditor ? 'getwid-acf-blocks' : 'getwid-blocks',
		supports: {
			...( metadata.supports || {} ),
			inserter: isTemplateEditor,
		},
		edit: Edit,
		save,
	}
);

if ( getwidSettings?.acf_exist === '' ) {
	unregisterBlockType( 'getwid/template-acf-background-image' );
}
