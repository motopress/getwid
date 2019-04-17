/**
* External dependencies
*/
import edit from './edit';
import save from './save';
import attributes from './attributes';


/**
* WordPress dependencies
*/
const {
	registerBlockType,
} = wp.blocks;


/**
* Register the block
*/
export default registerBlockType(
	'getwid/media-text-slider-slide-content',
	{
		title: __('Image', 'getwid'),
		category: 'getwid-blocks',
		parent: [ 'getwid/media-text-slider-slide' ],
		icon: {	
			src: 'format-image',
		},
		keywords: [
		],
		supports: {
			html: false,
		},
		attributes,
		edit,
		save
	},
);