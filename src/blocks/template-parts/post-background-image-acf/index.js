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
registerBlockType( 'getwid/template-post-background-image-acf', {
	title: __( 'Background Image ACF', 'getwid' ),
	icon: 'images-alt2',
	category: ( Getwid.settings.post_type == Getwid.templates.name ? 'getwid-post-blocks' : 'getwid-blocks' ),
	keywords: [ ],
	supports: {
		inserter: ( Getwid.settings.post_type == Getwid.templates.name ? true : false ) //Show Only on Templates page
	},
	edit,
	save: () => {
		return <InnerBlocks.Content/>;
	},
} );

if ( Getwid.acf_exist == '' ) {
	unregisterBlockType( 'getwid/template-post-background-image-acf' );
}
