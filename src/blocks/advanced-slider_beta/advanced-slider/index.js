import classnames from 'classnames';
import attributes from './attributes';
import edit from './edit';
import save from './save';

const {__} = wp.i18n;
const {
	registerBlockType,
} = wp.blocks;

// Register the block
registerBlockType( 'getwid/content-slider', {
	title: __('Getwid Content slider', 'getwid'),
	description: __('@todo description', 'getwid'),
	icon: {
		foreground: '#ff0000',
		src: 'images-alt2',
	},	
	category: 'layout',
	keywords: [
		__('content-slider', 'getwid'),
		__('getwid', 'getwid'),
	],
	supports: {
		anchor: true,
	},
	attributes,
	getEditWrapperProps( { blockAlignment } ) {
		if ( 'full' === blockAlignment || 'wide' === blockAlignment || 'center' === blockAlignment ) {
			return { 'data-align': blockAlignment };
		}
	},
	edit,
	save,
} );
