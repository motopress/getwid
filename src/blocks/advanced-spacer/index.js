/**
* Internal dependencies
*/
import Edit from './edit';
import save from './save.js';
import attributes from './attributes';
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
const blockName = 'getwid/advanced-spacer';

/**
* Register the block
*/
export default registerBlockType(
	'getwid/advanced-spacer',
	{
		title: __('Advanced Spacer', 'getwid'),
		category: 'getwid-blocks',
		supports: {
			inserter: !Getwid.disabled_blocks.includes(blockName)
		},
		icon: <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path d="M13 4v2h3.59L6 16.59V13H4v7h7v-2H7.41L18 7.41V11h2V4h-7"></path></g></svg>,
		transforms: {
			to: [
				{
					type: 'block',
					blocks: [ 'core/spacer' ],
					transform: ( attributes ) => createBlock( 'core/spacer', {
						height: parseInt(attributes.height, 10),
					} )
				},
			],
		},
		attributes,
		...checkDisableBlock(blockName, Edit),
		save,
	}
);
