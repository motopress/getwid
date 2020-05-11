/**
* Internal dependencies
*/
import Edit from './edit';
import save from './save.js';
import {checkDisableBlock} from 'GetwidUtils/help-functions';

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
const { registerBlockType, createBlock } = wp.blocks;

/**
* Module Constants
*/
const blockName = 'getwid/anchor';

/**
* Register the block
*/
export default registerBlockType(
	'getwid/anchor',
	{
		title: __('Anchor', 'getwid'),
		category: 'getwid-blocks',
		supports: {
			anchor: true,
			inserter: !Getwid.disabled_blocks.includes(blockName)
		},
		icon: <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="28" height="28" viewBox="0 0 28 28" ><path d="M26,1c0.551,0,1,0.449,1,1v1c0,0.551-0.449,1-1,1H2C1.449,4,1,3.551,1,3V2c0-0.551,0.449-1,1-1H26	 M26,0H2C0.895,0,0,0.895,0,2v1c0,1.105,0.895,2,2,2h24c1.105,0,2-0.895,2-2V2C28,0.895,27.105,0,26,0L26,0z"/><rect y="24"  width="28" height="1"/><rect y="27"  width="28" height="1"/><path d="M21.008,18.47c-0.329-0.641-0.602-1.345-0.578-2.072c-0.531,0.505-1.217,0.813-1.918,0.974	c0.23,0.093,0.534,0.163,0.832,0.181c-0.275,0.471-0.659,0.91-1.156,1.307c-1.163,0.932-2.646,1.411-3.688,1.651v-6.76h2.125	c0.276,0,0.5-0.224,0.5-0.5s-0.224-0.5-0.5-0.5H14.5v-2.446c0.86-0.224,1.5-1,1.5-1.929c0-1.103-0.897-2-2-2c-1.103,0-2,0.897-2,2	c0,0.929,0.64,1.705,1.5,1.929v2.446h-2.125c-0.276,0-0.5,0.224-0.5,0.5s0.224,0.5,0.5,0.5H13.5v6.76	c-1.041-0.24-2.524-0.719-3.688-1.651c-0.497-0.398-0.881-0.837-1.156-1.307c0.297-0.018,0.602-0.087,0.832-0.181	C8.786,17.21,8.1,16.902,7.57,16.397c0.025,0.727-0.249,1.431-0.578,2.072c0.252-0.136,0.52-0.319,0.736-0.538	c0.341,0.624,0.824,1.2,1.459,1.709c1.499,1.199,3.396,1.736,4.724,1.977L14,21.633l0.089-0.016c1.328-0.24,3.226-0.777,4.724-1.977	c0.635-0.509,1.119-1.084,1.46-1.709C20.488,18.151,20.756,18.334,21.008,18.47z M13,8.375c0-0.551,0.449-1,1-1s1,0.449,1,1	s-0.449,1-1,1S13,8.926,13,8.375z"/></svg>,
		transforms: {
			to: [
				{
					type: 'block',
					blocks: [ 'core/spacer' ],
					transform: ( attributes ) => createBlock( 'core/spacer' )
				},
			],
		},
		...checkDisableBlock(blockName, Edit),
		save,
	}
);
