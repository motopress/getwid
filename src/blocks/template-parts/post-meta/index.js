/**
* External dependencies
*/
import edit from './edit';
import './style.scss'


/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {
	registerBlockType,
} = wp.blocks;
const {
	InnerBlocks,
} = wp.editor;


/**
* Register the block
*/
registerBlockType('getwid/template-post-meta', {
	title: __('Post - Meta', 'getwid'),
	// icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22,3v6H2V3H22 M24,1H0v10h24V1L24,1z"/><g><rect x="4" y="5" width="16" height="2"/></g><path d="M22,15v6H2v-6H22 M24,13H0v10h24V13L24,13z"/><g><rect x="4" y="17" width="16" height="2"/></g></svg>,
	category: (Getwid.settings.post_type == Getwid.templates.name ? 'getwid-post-blocks' : 'getwid-blocks'),
	keywords: [
	],
	supports: {
		anchor: true,
		inserter: (Getwid.settings.post_type == Getwid.templates.name ? true : false), //Show Only on Templates page
	},
	getEditWrapperProps( attributes ) {
		const { align } = attributes;
		if ( [ 'wide', 'full', 'left', 'center', 'right' ].includes( align ) ) {
			return { 'data-align': align };
		}
	},
	edit,
	save: () => {
		return <InnerBlocks.Content/>;
	},
});