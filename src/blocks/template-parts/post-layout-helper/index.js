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
const {jQuery: $} = window;
const { registerBlockType } = wp.blocks;


/**
* Register the block
*/
registerBlockType( 'getwid/template-post-layout-helper', {
	title: __( 'Layout', 'getwid' ),
	icon: 'layout',
	category: 'getwid-post-blocks',
	keywords: [ ],
	supports: {
		multiple: false,
		customClassName: false,
	},
	edit,
	attributes,
	save: () => {
		return null;
	}
} );
