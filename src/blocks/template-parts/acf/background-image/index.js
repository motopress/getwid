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
	category: 'getwid-acf-blocks',
	keywords: [ 'acf' ],
	edit,
	save: () => {
		return <InnerBlocks.Content/>;
	},
} );

if ( Getwid.acf_exist == '' ) {
	unregisterBlockType( 'getwid/template-acf-background-image' );
}
