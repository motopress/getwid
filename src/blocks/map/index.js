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
	icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12,2C8.1,2,5,5.1,5,9c0,3.9,7,13,7,13s7-9.1,7-13C19,5.1,15.9,2,12,2z M6.9,9.1C6.9,6.3,9.2,4,12,4s5.1,2.3,5.1,5.1 c0,2.8-5.1,9.5-5.1,9.5S6.9,11.9,6.9,9.1z"/><circle cx="12" cy="9" r="3"/></svg>,
	category: 'getwid-blocks',
	keywords: [
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
