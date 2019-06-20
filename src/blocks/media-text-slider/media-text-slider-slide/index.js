/**
* External dependencies
*/
import edit from './edit';
import save from './save';


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
registerBlockType( 'getwid/media-text-slider-slide', {
	title: __('Slide', 'getwid'),
	icon: {	
		src: 'format-gallery',
	},
	keywords: [
	],	
	category: 'getwid-blocks',
	parent: [ 'getwid/media-text-slider' ],
	attributes: {
		id: {
			type: 'number',
			default: 1,
		},				
		outerParent: {
			type: 'object',
		},
		mediaId: {
			type: 'number'
		},
		caption: {
			type: 'string',
			default: ''
		},
		url: {
			type: 'string'
		}
	},
	getEditWrapperProps( attributes ) {
		return { 'data-slide': attributes.id };
	},
	edit,
	save
} );