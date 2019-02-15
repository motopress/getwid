import classnames from 'classnames';
import attributes from './attributes';
import edit from './edit';
import save from './save';

const {__} = wp.i18n;
const {
	registerBlockType,
} = wp.blocks;

const {
	SVG,
	Path
} = wp.components;

// Register the block
registerBlockType( 'getwid/media-text-slider', {
	title: __('Media & Text Slider', 'getwid'),
	icon: <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24"><path d="M0,0v1v0.2V2v1.9v10.3V16v0.9V18h3h18h3v-2v-1.9V3.9V2V1.2V1V0H0z M22,7l-8,7l-4.9-2.1L4,15c0,0-1.8,0-2,0V4.8V2h20V7z"/><rect x="4" y="4" width="11" height="2"/><rect x="4" y="7" width="7" height="2"/><circle cx="6" cy="22" r="2"/><circle cx="12" cy="22" r="2"/><circle cx="18" cy="22" r="2"/></svg>,
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
