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
const blockName = 'getwid/table-of-contents';

/**
* Register the block
*/
export default registerBlockType(
	'getwid/table-of-contents',
	{
		title: __('Table of contents', 'getwid'),
		category: 'getwid-blocks',
		supports: {
			inserter: !Getwid.disabled_blocks.includes(blockName),
			multiple: false,
			align: [ 'left', 'right', 'wide', 'full' ],
		},
		icon: <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><g><path d="M13 4v2h3.59L6 16.59V13H4v7h7v-2H7.41L18 7.41V11h2V4h-7"></path></g></svg>,
        getEditWrapperProps( attributes ) {
            const { align } = attributes;
            if ( [ 'left', 'right', 'wide', 'full' ].includes( align ) ) {
                return { 'data-align': align };
            }
        },
		attributes,
		...checkDisableBlock(blockName, Edit),
		save,
	}
);
