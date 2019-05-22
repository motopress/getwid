/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {
	registerBlockType,
} = wp.blocks;


/**
* Register the block
*/
registerBlockType( 'getwid/post-title', {
	title: __('Post Title', 'getwid'),
	category: 'getwid-blocks',
	keywords: [
	],
	supports: {
		anchor: true,
	},
	edit: () => {
		<ServerSideRender
			block="getwid/post-title"
		/>
	},
	save: () => {
		return null;
	},
} );
