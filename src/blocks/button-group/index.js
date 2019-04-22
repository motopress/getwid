/**
* External dependencies
*/
import attributes from './attributes';
import edit from './edit';
import save from './save';
import './style.scss'


/**
* WordPress dependencies
*/
import { __ } from '@wordpress/i18n';
const {
	registerBlockType,
} = wp.blocks;


/**
* Register the block
*/
registerBlockType('getwid/button-group', {
	title: __('Button Group', 'getwid'),
	icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22,3v6H2V3H22 M24,1H0v10h24V1L24,1z"/><g><rect x="4" y="5" width="16" height="2"/></g><path d="M22,15v6H2v-6H22 M24,13H0v10h24V13L24,13z"/><g><rect x="4" y="17" width="16" height="2"/></g></svg>,
	category: 'getwid-blocks',
	keywords: [
	],
	attributes: attributes,
	edit,
	save
});