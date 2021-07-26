/**
* internal dependencies
*/
import edit from './edit';
import './style.scss'

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;

const { registerBlockType } = wp.blocks;

/**
* Register the block
*/
registerBlockType( 'getwid/template-post-tags', {
	title: __( 'Tags', 'getwid' ),
	icon: 'tag',
	category: 'getwid-post-blocks',
	keywords: [ ],
	edit,
	save: () => {
		return null;
	}
} );
