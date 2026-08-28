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

const isTemplateEditor = Getwid.settings.post_type === Getwid.templates.name;

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

if ( ! Getwid.acf_exist ) {
	unregisterBlockType( 'getwid/template-acf-background-image' );
}
