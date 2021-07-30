/**
* Internal dependencies
*/
import edit from './edit';
import './style.scss';


/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
const { registerBlockType } = wp.blocks;


/**
* Register the block
*/
registerBlockType( 'getwid/template-post-featured-image', {
	title: __( 'Featured Image', 'getwid' ),
	icon: 'format-image',
	category: ( Getwid.settings.post_type == Getwid.templates.name ? 'getwid-post-blocks' : 'getwid-blocks' ),
	keywords: [
	],
	supports: {
		inserter: ( Getwid.settings.post_type == Getwid.templates.name ? true : false ) //Show Only on Templates page
	},
	getEditWrapperProps( attributes ) {
		const { align } = attributes;
		if ( [ 'left', 'center', 'right' ].includes( align ) ) {
			return { 'data-align': align };
		}
	},
	edit,
	save: () => {
		return null;
	}
} );