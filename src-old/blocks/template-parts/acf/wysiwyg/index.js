/**
 * Internal dependencies
 */
import edit from './edit';
import './style.scss';

/**
 * External dependencies
 */
import { __ } from 'wp.i18n';
const { jQuery: $ } = window;
const { registerBlockType, unregisterBlockType } = wp.blocks;

/**
 * Register the block
 */
registerBlockType( 'getwid/template-acf-wysiwyg', {
	title: __( 'ACF Wysiwyg', 'getwid' ),
	icon: 'text',
	category: ( Getwid.settings.post_type == Getwid.templates.name ? 'getwid-acf-blocks' : 'getwid-blocks' ),
	keywords: [ 'acf' ],
	supports: {
		inserter: ( Getwid.settings.post_type == Getwid.templates.name ? true : false ) // Show Only on Templates page
	},
	edit,
	save: () => {
		return null;
	}
} );

if ( Getwid.acf_exist == '' ) {
	unregisterBlockType( 'getwid/template-acf-wysiwyg' );
}
