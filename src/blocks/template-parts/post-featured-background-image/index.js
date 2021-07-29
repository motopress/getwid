/**
* Internal dependencies
*/
import edit from './edit';
import './style.scss'


/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const { jQuery: $ } = window;
const { registerBlockType } = wp.blocks;
const { InnerBlocks } = wp.blockEditor || wp.editor;

/**
* Register the block
*/
registerBlockType( 'getwid/template-post-featured-background-image', {
	title: __( 'Background Featured Image', 'getwid' ),
	icon: 'images-alt2',
	category: 'getwid-post-blocks',
	keywords: [ ],
	edit,
	save: () => {
		return <InnerBlocks.Content/>;
	},
} );
