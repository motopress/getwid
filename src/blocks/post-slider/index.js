/**
* External dependencies
*/
import attributes from './attributes';
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
	ServerSideRender,
} = wp.components;


/**
* Register the block
*/
registerBlockType( 'getwid/post-slider', {
	title: __('Post Slider', 'getwid'),
	icon: <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24"><polygon points="16,4 8,4 8,6 16,6 "/><polygon points="14,12 8,12 8,14 14,14 "/><polygon points="16,8 8,8 8,10 16,10 "/><path d="M18,2v14H6V2H18 M20,0H4v18h16V0L20,0z"/><circle cx="6" cy="22" r="2"/><circle cx="12" cy="22" r="2"/><circle cx="18" cy="22" r="2"/></svg>,
	category: 'getwid-blocks',
	keywords: [
	],
	supports: {
		anchor: true,
	},
	attributes,
	getEditWrapperProps( attributes ) {
		const { align } = attributes;
		if ( [ 'wide', 'full' ].includes( align ) ) {
			return { 'data-align': align };
		}
	},
	edit,
	save: props => {
		return (
			<ServerSideRender
				block="getwid/post-slider"
				attributes={props.attributes}
			/>
		);
	},	
} );