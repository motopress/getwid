/**
* External dependencies
*/
import attributes from './attributes';
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
registerBlockType( 'getwid/post-carousel', {
	title: __('Post Carousel', 'getwid'),
	icon: <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24"><polygon points="16,11 8,11 8,13 16,13 16,11 "/><polygon points="14,15 8,15 8,17 14,17 14,15 "/><polygon points="16,7 8,7 8,9 16,9 16,7 "/><path d="M24,4h-4V2H4v2H0v16h4v2h16v-2h4V4z M2,18V6h2v12H2z M6,20V4h12v16H6z M22,18h-2V6h2V18z"/></svg>,
	category: 'getwid-blocks',
	keywords: [
	],
	supports: {
		anchor: true,
	},
	attributes,
	getEditWrapperProps( attributes ) {
		const { align } = attributes;
		if ( [ 'wide', 'full' ].includes( align ) ) {
			return { 'data-align': align };
		}
	},
	edit,
	save: () => {
		return null;
	},
} );