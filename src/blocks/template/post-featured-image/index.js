/**
* External dependencies
*/
import edit from './edit';
import './style.scss'


/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {
	registerBlockType,
} = wp.blocks;


/**
* Register the block
*/
registerBlockType( 'getwid/template-post-featured-image', {
	title: __('Post (Image)', 'getwid'),
	// icon: <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"	viewBox="0 0 24 24"><path d="M0,0v10h10V0H0z M8,8H2V2h6V8z"/><rect x="12" y="2" width="12" height="2"/><rect x="12" y="6" width="8" height="2"/><path d="M0,14v10h10V14H0z M8,22H2v-6h6V22z"/><rect x="12" y="16" width="12" height="2"/><rect x="12" y="20" width="8" height="2"/></svg>,
	category: 'getwid-blocks',
	keywords: [
	],
	supports: {
		anchor: true,
	},
	getEditWrapperProps( attributes ) {
		const { align } = attributes;
		if ( [ 'wide', 'full', 'left', 'center', 'right' ].includes( align ) ) {
			return { 'data-align': align };
		}
	},
	edit,
	save: () => {
		return null;
	},
} );