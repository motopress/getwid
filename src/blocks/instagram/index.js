/**
* Internal dependencies
*/
import attributes from './attributes';
import Edit from './edit';
import {checkDisableBlock} from 'GetwidUtils/help-functions';

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;

const { registerBlockType } = wp.blocks;

/**
* Module Constants
*/
const blockName = 'getwid/instagram';

/**
* Register the block
*/
registerBlockType( blockName, {
	title: __( 'Instagram', 'getwid' ),
	icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" x="0px" y="0px"><path d="M17.11,2C19.81,2,22,4.19,22,6.89v10.22c0,2.7-2.19,4.89-4.89,4.89H6.89C4.19,22,2,19.81,2,17.11V6.89C2,4.19,4.19,2,6.89,2 H17.11 M17.11,0H6.89C3.09,0,0,3.09,0,6.89v10.22C0,20.91,3.09,24,6.89,24h10.22c3.81,0,6.89-3.09,6.89-6.89V6.89 C24,3.09,20.91,0,17.11,0L17.11,0z"/><path d="M18.5,4L18.5,4C19.33,4,20,4.67,20,5.5v0C20,6.33,19.33,7,18.5,7h0C17.67,7,17,6.33,17,5.5v0C17,4.67,17.67,4,18.5,4z"/><path d="M12,8c2.21,0,4,1.79,4,4s-1.79,4-4,4s-4-1.79-4-4S9.79,8,12,8 M12,6c-3.31,0-6,2.69-6,6s2.69,6,6,6s6-2.69,6-6S15.31,6,12,6 L12,6z"/></svg>,
	category: 'getwid-blocks',
	keywords: [ ],
	attributes,
	supports: {
		inserter: !Getwid.disabled_blocks.includes(blockName)
	},
	getEditWrapperProps( attributes ) {
		const { align } = attributes;
		if ( [ 'wide', 'full' ].includes( align ) ) {
			return { 'data-align': align };
		}
	},
	...checkDisableBlock(blockName, Edit),
	save: () => {
		return null;
	}
} );
