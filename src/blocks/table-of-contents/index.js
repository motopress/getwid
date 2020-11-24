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
		title: __('Table of Contents', 'getwid'),
		category: 'getwid-blocks',
		keywords: [
			__( 'summary', 'getwid' ),
		],
		supports: {
			inserter: !Getwid.disabled_blocks.includes(blockName),
			multiple: false,
			align: [ 'left', 'right', 'wide', 'full' ],
		},
		icon: <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24"><polygon points="0,3 0,21 0,23 2,23 4,23 4,21 2,21 2,3 4,3 4,1 0,1 "/><rect x="6" width="4" height="4"/><rect x="6" y="20" width="4" height="4"/><rect x="14" y="7" width="4" height="4"/><rect x="14" y="15" width="4" height="4"/><polygon points="8,6 6,6 6,18 8,18 12,18 12,16 8,16 8,10 12,10 12,8 8,8 "/></svg>,
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