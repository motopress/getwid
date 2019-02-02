import classnames from 'classnames';
import attributes from './attributes';
import edit from './edit';
import save from './save';

const {__} = wp.i18n;
const {
	registerBlockType,
} = wp.blocks;

// Register the block
registerBlockType( 'getwid/map', {
	title: __('Google Maps', 'getwid'),
	description: __('@todo description', 'getwid'),
	icon: {
		src: 'location-alt',
	},	
	category: 'getwid-blocks',
	keywords: [
		__('map', 'getwid'),
		__('getwid', 'getwid'),
	],
	supports: {
		anchor: true,
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
