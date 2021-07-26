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
registerBlockType( 'getwid/template-acf-select', {
	title: __( 'ACF Select', 'getwid' ),
	category: 'getwid-acf-blocks',
	keywords: [ 'acf' ],
	edit,
	save: () => {
		return null;
	}
} );

if ( Getwid.acf_exist == '' ) {
	unregisterBlockType( 'getwid/template-acf-select' );
}
