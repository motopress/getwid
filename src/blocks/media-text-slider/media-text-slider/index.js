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
	title: __('Getwid Media & text slider', 'getwid'),
	description: __('@todo description', 'getwid'),
	icon: {
		src: 'images-alt2',
	},	
	category: 'getwid-blocks',
	keywords: [
		__('media-text-slider', 'getwid'),
		__('getwid', 'getwid'),
	],
	supports: {
		alignWide: true,
		align: [ 'wide', 'full' ],		
	},
	attributes,
	getEditWrapperProps( { blockAlignment } ) {
		if ( 'full' === blockAlignment || 'wide' === blockAlignment ) {
			return { 'data-align': blockAlignment };
		}
	},
	edit,
	save,
} );
