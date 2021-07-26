/**
* Internal dependencies
*/
import edit from './edit';
import './style.scss'


/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;

const { registerBlockType } = wp.blocks;
const { InnerBlocks } = wp.blockEditor || wp.editor;

/**
* Register the block
*/
registerBlockType( 'getwid/template-post-meta', {
	title: __( 'Meta', 'getwid' ),
	icon: 'tagcloud',
	category: 'getwid-post-blocks',
	keywords: [ ],
	edit,
	save: () => {
		return <InnerBlocks.Content/>;
	}
});
