/**
* Internal dependencies
*/
import edit from './edit';

import './style.scss';

/**
* External dependencies
*/
import { __ } from 'wp.i18n';

const { registerBlockType } = wp.blocks;

/**
* Register the block
*/
registerBlockType( 'getwid/template-post-title', {
	title: __( 'Title', 'getwid' ),
	icon: 'editor-textcolor',
	category: ( Getwid.settings.post_type == Getwid.templates.name ? 'getwid-post-blocks' : 'getwid-blocks' ),
	keywords: [ ],
	supports: {
		inserter: ( Getwid.settings.post_type == Getwid.templates.name ? true : false ) //Show Only on Templates page
	},
	edit,
	save: () => {
		return null;
	}
} );