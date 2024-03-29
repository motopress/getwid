/**
* Internal dependencies
*/
import Edit from './edit';
import Save from './save';
import Save_deprecated from './save_deprecated';
import attributes from './attributes';
import {checkDisableBlock} from 'GetwidUtils/help-functions';
import './style.scss';

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;

const { registerBlockType, createBlock } = wp.blocks;

/**
* Module Constants
*/
const blockName = 'getwid/person';

/**
* Register the block
*/
registerBlockType('getwid/person', {
	title: __( 'Person', 'getwid' ),
	icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.7,12.7C17.1,11.6,18,9.9,18,8c0-3.3-2.6-6-6-6S6,4.6,6,8c0,1.9,0.9,3.7,2.3,4.7C4.6,14.2,2,17.8,2,22h20
	C22,17.8,19.4,14.2,15.7,12.7z M12,4c2.2,0,4,1.7,4,4c0,2.2-1.7,4-4,4s-4-1.7-4-4C8,5.7,9.8,4,12,4z M12,14c3.7,0,6.9,2.6,7.7,6H4.3	C5.1,16.6,8.3,14,12,14z"/></svg>,
	category: 'getwid-blocks',
	keywords: [
		__( 'team'  , 'getwid' ),
		__( 'member', 'getwid' )
	],
	deprecated: [
		{
			attributes: attributes,
			save: Save_deprecated
		}
	],
	supports: {
		inserter: !Getwid.disabled_blocks.includes(blockName)
	},
	attributes,
	transforms: {
		from: [
			{
				type: 'block',
				blocks: [ 'core/image' ],
				transform: content => ( createBlock( 'getwid/person', {
					id: content.imgId,
					url: content.imgUrl,
					content: content.caption
				} ) )
			}
		],
		to: [
			{
				type: 'block',
				blocks: [ 'core/image' ],
				transform: attributes => ( createBlock( 'core/image', {
					id: attributes.imgId,
					url: attributes.imgUrl,
					caption: attributes.content
				} ) )
			}
		]
	},
	...checkDisableBlock(blockName, Edit),
	save: Save
});
