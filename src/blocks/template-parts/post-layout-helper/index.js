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
	title: __( 'Layout', 'getwid' ),
	icon: 'layout',
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