/**
* External dependencies
*/
import './style.scss'
import attributes from './attributes';
import edit from './edit';
import save from './save';


/**
* WordPress dependencies
*/
const {
	registerBlockType,
} = wp.blocks;


/**
* Register the block
*/
registerBlockType('getwid/testimonial', {
	title: __('Testimonial', 'getwid'),
	icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22,2v15h-4h-0.7l-0.6,0.5L12,21.4l-4.7-3.9L6.7,17H6H2V2H22 M24,0H0v19h6l6,5l6-5h6V0L24,0z"/><g><polygon points="6,6 6,11 8,11 8,14 9.5,12.5 11,11 11,6 	"/></g><g><polygon points="13,6 13,11 15,11 15,14 16.5,12.5 18,11 18,6 	"/></g></svg>,
	category: 'getwid-blocks',
	keywords: [
		__('review', 'getwid'),
		__('feedback', 'getwid'),
	],
	attributes: attributes,
	edit,
	save
});