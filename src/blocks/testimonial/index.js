import classnames from 'classnames';

import './style.scss'

import attributes from './attributes';
import edit from './edit';
import save from './save';

const {__} = wp.i18n;
const {
	registerBlockType,
} = wp.blocks;
const {
	RichText
} = wp.editor;


// Register the block
registerBlockType('getwid/testimonial', {
	title: __('Testimonial', 'getwid'),
	icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M24,9.3l-8.3-1.2L12,0.6L8.3,8.1L0,9.3l6,5.8l-1.4,8.2l7.4-3.9l7.4,3.9L18,15.1L24,9.3z M12,17.2l-4.7,2.5l0.9-5.3l-3.8-3.7 L9.6,10L12,5.1l2.4,4.9l5.3,0.8l-3.8,3.7l0.9,5.3L12,17.2z"/></svg>,
	category: 'getwid-blocks',
	keywords: [
	],
	styles: [
		// Mark style as default.
		{
			name: 'default',
			label: __( 'Default' ),
			isDefault: true
		},
		{
			name: 'style1',
			label: __( 'Style 1' ),
		},
		{
			name: 'style2',
			label: __( 'Style 2' ),
		},
		{
			name: 'style3',
			label: __( 'Style 3' ),
		}
	],
	attributes: attributes,
	edit,
	save
});