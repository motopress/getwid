import classnames from 'classnames';
import attributes from './attributes';
import edit from './edit';
import save from './save';

const {__} = wp.i18n;
const {
	registerBlockType,
} = wp.blocks;

// Register the block
registerBlockType( 'getwid/media-text-slider', {
	title: __('Media & Text Slider', 'getwid'),
	icon: {
		src: 'images-alt2',
	},	
	category: 'getwid-blocks',
	keywords: [
		__('Getwid', 'getwid'),
	],
	supports: {
		alignWide: true,
		align: [ 'wide', 'full' ],
	},
	attributes,
	edit,
	save,
} );
