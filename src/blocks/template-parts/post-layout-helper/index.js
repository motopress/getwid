/**
* Internal dependencies
*/
import edit from './edit';
import './style.scss';
import attributes from './attributes';


/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const { registerBlockType } = wp.blocks;


/**
* Register the block
*/
registerBlockType( 'getwid/template-post-layout-helper', {
	title: __( 'Post - Layout', 'getwid' ),
	// icon: <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"	viewBox="0 0 24 24"><path d="M0,0v10h10V0H0z M8,8H2V2h6V8z"/><rect x="12" y="2" width="12" height="2"/><rect x="12" y="6" width="8" height="2"/><path d="M0,14v10h10V14H0z M8,22H2v-6h6V22z"/><rect x="12" y="16" width="12" height="2"/><rect x="12" y="20" width="8" height="2"/></svg>,
	category: (Getwid.settings.post_type == Getwid.templates.name ? 'getwid-post-blocks' : 'getwid-blocks'),
	keywords: [ ],
	supports: {
		inserter: (Getwid.settings.post_type == Getwid.templates.name ? true : false), //Show Only on Templates page
		multiple: false,
		customClassName: false,
	},
	edit,
	attributes,
	save: () => {
		return null;
	}
} );