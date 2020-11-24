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
const blockName = 'getwid/testimonial';

/**
* Register the block
*/
registerBlockType( 'getwid/testimonial', {
	title: __( 'Testimonial', 'getwid' ),
	icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M22,2v15h-4h-0.7l-0.6,0.5L12,21.4l-4.7-3.9L6.7,17H6H2V2H22 M24,0H0v19h6l6,5l6-5h6V0L24,0z"/><g><polygon points="6,6 6,11 8,11 8,14 9.5,12.5 11,11 11,6 	"/></g><g><polygon points="13,6 13,11 15,11 15,14 16.5,12.5 18,11 18,6 	"/></g></svg>,
	category: 'getwid-blocks',
	keywords: [
		__( 'review', 'getwid' ),
		__( 'feedback', 'getwid' ),
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
				blocks: ['core/paragraph'],
				transform: content => createBlock( 'getwid/testimonial',
					{
						title: content.content
					}
				)
			}
		],
		to: [
			{
				type: 'block',
				blocks: [ 'core/paragraph' ],
				transform: attributes => createBlock(
					'core/paragraph',
					{
						content: attributes.title
					}
				)
			},
			{
				type: 'block',
				blocks: [ 'getwid/price-list' ],
				transform: attributes => createBlock(
					'getwid/price-list',
					{
						title      : attributes.title,
						description: attributes.subtitle,
						title	   : attributes.content,

						id : attributes.imgId,
						url: attributes.imgUrl
					}
				)
			},
			{
				type: 'block',
				blocks: [ 'getwid/price-box' ],
				transform: attributes => createBlock(
					'getwid/price-box',
					{
						title: attributes.title
					}
				)
			}
		]
	},
	...checkDisableBlock(blockName, Edit),
	save: Save
});
