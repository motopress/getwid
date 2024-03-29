/**
* Internal dependencies
*/
import attributes from './attributes';
import edit from './edit';
import './style.scss'


/**
* External dependencies
*/
import { __, _x } from 'wp.i18n';
const { registerBlockType } = wp.blocks;


/**
* Register the block
*/
registerBlockType( 'getwid/template-post-link', {
	title: __( 'Link', 'getwid' ),
	icon: 'admin-links',
	category: ( Getwid.settings.post_type == Getwid.templates.name ? 'getwid-post-blocks' : 'getwid-blocks' ),
	keywords: [ ],
	supports: {
		inserter: ( Getwid.settings.post_type == Getwid.templates.name ? true : false ) //Show Only on Templates page
	},
	attributes,
	edit,
	save: () => {
		return null;
	}
} );