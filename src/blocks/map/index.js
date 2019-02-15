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
	icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 20"><path d="M12,2A7,7,0,0,0,5,9c0,3.87,7,13,7,13s7-9.13,7-13A7,7,0,0,0,12,2ZM6.89,9.11a5.11,5.11,0,0,1,10.22,0c0,2.82-5.11,9.49-5.11,9.49S6.89,11.93,6.89,9.11Z" transform="translate(-5 -2)"/><circle cx="7" cy="7" r="3"/></svg>,	
	category: 'getwid-blocks',
	keywords: [
		__('Getwid', 'getwid'),
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
