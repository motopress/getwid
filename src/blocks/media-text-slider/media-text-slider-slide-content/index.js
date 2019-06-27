/**
* Internal dependencies
*/
import Edit from './edit';
import Save from './save';
import attributes from './attributes';

/**
* External dependencies
*/
import { __ } from 'wp.i18n';

const { registerBlockType } = wp.blocks;

/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-media-text-slider-slide-content';

/**
* Register the block
*/
export default registerBlockType(
	'getwid/media-text-slider-slide-content',
	{
		title: __( 'Image', 'getwid' ),
		category: 'getwid-blocks',
		parent: [ 'getwid/media-text-slider-slide' ],
		icon: {	
			src: 'format-image',
		},
		keywords: [ ],
		supports: {
			html: false
		},
		attributes,
		edit: props => (
			<Edit {...{
				...props,
				baseClass
			}}/>
		),
		save: props => (
			<Save {...{
				...props,
				baseClass
			}}/>
		)
	}
);