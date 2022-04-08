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
const { registerBlockType, unregisterBlockType } = wp.blocks;
const { InnerBlocks } = wp.blockEditor || wp.editor;

/**
* Register the block
*/
registerBlockType( 'getwid/template-acf-background-image', {
	title: __( 'ACF Background Image', 'getwid' ),
	icon: 'images-alt2',
	category: ( Getwid.settings.post_type == Getwid.templates.name ? 'getwid-acf-blocks' : 'getwid-blocks' ),
	keywords: [ 'acf' ],
	supports: {
		inserter: ( Getwid.settings.post_type == Getwid.templates.name ? true : false ) //Show Only on Templates page
	},
	edit,
	save: () => {
		return <InnerBlocks.Content/>;
	},
} );

if ( Getwid.acf_exist == '' ) {
	unregisterBlockType( 'getwid/template-acf-background-image' );
}
