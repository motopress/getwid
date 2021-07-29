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
	category: 'getwid-post-blocks',
	keywords: [ ],
	attributes,
	edit,
	save: () => {
		return null;
	}
} );
