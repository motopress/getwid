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
	category: 'getwid-post-blocks',
	keywords: [ ],
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
