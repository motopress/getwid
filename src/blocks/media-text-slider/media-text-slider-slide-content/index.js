/**
 * Block dependencies
 */
import edit from './edit';
import save from './save';
import attributes from './attributes';

const { __ } = wp.i18n;
const {
	registerBlockType,
} = wp.blocks;

/**
 * Register static block example block
 */
export default registerBlockType(
	'getwid/media-text-slider-slide-content',
	{
		title: __('Slide - Content', 'getwid'),
		category: 'getwid-blocks',
		parent: [ 'getwid/media-text-slider-slide' ],
		icon: {	
			src: 'format-image',
		},
		keywords: [
			__('Getwid', 'getwid')
		],
		supports: {
			html: false,
		},
		attributes,
		edit,
		save
	},
);