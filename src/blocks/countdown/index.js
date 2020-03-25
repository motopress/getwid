/**
* Internal dependencies
*/
import attributes from './attributes';
import Edit from './edit';
import {checkDisableBlock} from 'GetwidUtils/help-functions';
// import save from './save';

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
const { registerBlockType, createBlock } = wp.blocks;

/**
* Module Constants
*/
const blockName = 'getwid/countdown';

/**
* Register the block
*/
registerBlockType( blockName, {
	title: __( 'Countdown', 'getwid' ),
	icon: <svg x="0px" y="0px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polygon points="12,14 12,10 10,10 10,14 10,16 12,16 16,16 16,14 "/><path d="M15,4.46V1l-5,4l5,4V6.59c2.93,1.19,5,4.06,5,7.41c0,4.41-3.59,8-8,8s-8-3.59-8-8H2c0,5.52,4.48,10,10,10s10-4.48,10-10  C22,9.53,19.06,5.74,15,4.46z"/></svg>,
	category: 'getwid-blocks',
	keywords: [
		__( 'timer', 'getwid' ),
	],
	supports: {
		alignWide: true,
		align: [ 'wide', 'full' ],
		inserter: !Getwid.disabled_blocks.includes(blockName)
	},
	getEditWrapperProps( attributes ) {
		const { align } = attributes;
		if ( [ 'wide', 'full' ].includes( align ) ) {
			return { 'data-align': align };
		}
	},
	attributes,
	...checkDisableBlock(blockName, Edit),
	save: () => {
		return null;
	},
} );
