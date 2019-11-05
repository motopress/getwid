/**
* Internal dependencies
*/
import edit from './edit';
import Save from './save';

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;

const { registerBlockType } = wp.blocks;

/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-media-text-slider-slide';

/**
* Register the block
*/
registerBlockType( 'getwid/media-text-slider-slide', {
	title: __( 'Slide', 'getwid' ),
	icon: {	
		src: 'format-gallery',
	},
	keywords: [ ],	
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
		url: {
			type: 'string'
		}
	},
	getEditWrapperProps( attributes ) {
		return { 'data-slide': attributes.id };
	},
	edit,
	save: props => (
		<Save {...{
			...props,
			baseClass
		}}/>
	)
} );