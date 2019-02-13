import edit from './edit';
import save from './save';

const {__} = wp.i18n;

const {
	registerBlockType,
} = wp.blocks;

// Register the block
registerBlockType( 'getwid/media-text-slider-slide', {
	title: __('Slider - Slide', 'getwid'),
	icon: {	
		src: 'format-gallery',
	},
	keywords: [
		__('Getwid', 'getwid')
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
	},
	getEditWrapperProps( attributes ) {
		return { 'data-slide': attributes.id };
	},
	edit,
	save
} );