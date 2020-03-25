/**
* Internal dependencies
*/
import Edit from './edit';
import Save from './save';
import Save_deprecated from './save_deprecated';
import attributes from './attributes';
import {checkDisableBlock} from 'GetwidUtils/help-functions';
import './style.scss'

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;

const { select } = wp.data;
const { registerBlockType, createBlock } = wp.blocks;

/**
* Module Constants
*/
const validAlignments = [ 'left', 'center', 'right', 'wide', 'full' ];
const blockName = 'getwid/banner';

/**
* Register the block
*/
export default registerBlockType(
	blockName,
	{
		title: __( 'Banner', 'getwid' ),
		description: __( 'Link an image or video with a text overlay.', 'getwid' ),
		category: 'getwid-blocks',
		icon: <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24"><rect x="14" y="5" width="6" height="2"/><rect x="14" y="9" width="6" height="2"/><polygon points="8,4 9.1,5.2 10.8,5.2 10.8,6.9 12,8 10.8,9.1 10.8,10.8 9.1,10.8 8,12 6.9,10.8 5.2,10.8 5.2,9.1 4,8 5.2,6.9 5.2,5.2 6.9,5.2 "/><polygon points="17.6,15 10.3,12.6 11.9,20.1 13.8,18.4 17,21.9 18.9,20.2 15.7,16.7"/><g><polygon points="0,0 0,16 9,16 8.6,14 2,14 2,2 22,2 22,14 19.3,14 19.7,16 24,16 24,0"/></g></svg>,
		supports: {
			inserter: !Getwid.disabled_blocks.includes(blockName)
		},
		keywords: [
			__( 'image', 'getwid' ),
			__( 'cover', 'getwid' )
		],
		deprecated: [
			{
				attributes: attributes,
				save: Save_deprecated
			}
		],
		transforms: {
			from: [
				{
					type: 'block',
					blocks: [ 'core/image' ],
					transform: ( attributes ) => createBlock( 'getwid/banner', {
						id: attributes.id,
						url: attributes.url,
						title: attributes.caption
					} )
				},
				{
					type: 'block',
					blocks: [ 'core/media-text' ],
					transform: ( attributes ) => {
						const clientId = select('core/editor').getSelectedBlockClientId();
						const innerBlocksArr = select('core/editor').getBlock(clientId).innerBlocks;
						let inner_attributes = {
							text: ''
						};

					 	if (innerBlocksArr.length){
							jQuery.each(innerBlocksArr, (index, item) => {
								if (item.name == 'core/paragraph'){
									inner_attributes.text = item.attributes.content;
								}
							});
						}

						return createBlock( 'getwid/banner', {
							id: attributes.mediaId,
							url: attributes.mediaUrl,
							text: inner_attributes.text
						} );
					}
				},
				{
					type: 'block',
					blocks: [ 'core/cover' ],
					transform: ( attributes ) => createBlock( 'getwid/banner', {
						id: attributes.id,
						url: attributes.url,
						title: attributes.caption
					} )
				}
			],
			to: [
				{
					type: 'block',
					blocks: [ 'core/cover' ],
					transform: ( attributes ) => createBlock( 'core/cover', {
						id: attributes.id,
						url: attributes.url,
						caption: attributes.title ? attributes.title : (attributes.text ? attributes.text : ''),
					} )
				},
				{
					type: 'block',
					blocks: [ 'core/image' ],
					transform: ( attributes ) => createBlock( 'core/image', {
						id: attributes.id,
						url: attributes.url,
						caption: attributes.title ? attributes.title : (attributes.text ? attributes.text : ''),
					} )
				},
				{
					type: 'block',
					blocks: [ 'getwid/image-box' ],
					transform: ( attributes ) =>  createBlock( 'getwid/image-box', {
							id: attributes.id,
							url: attributes.url,
					}, [
						createBlock ( 'core/heading', { content: attributes.title } ),
						createBlock ( 'core/paragraph', { content: attributes.text } ),
					] )
				},
				{
					type: 'block',
					blocks: [ 'core/media-text' ],
					transform: ( attributes ) =>  createBlock( 'core/media-text', {
						mediaId: attributes.id,
						mediaUrl: attributes.url,
						mediaType: 'image',
					}, [
						createBlock ( 'core/paragraph', { content: attributes.text } ),
					] )
				},
				{
					type: 'block',
					blocks: [ 'core/cover' ],
					transform: ( attributes ) => createBlock( 'core/cover', {
							id: attributes.id,
							url: attributes.url,
					} )
				},
				{
					type: 'block',
					blocks: [ 'core/heading' ],
					transform: ( attributes ) => createBlock( 'core/heading', {
						content: attributes.title,
					} )
				},
				{
					type: 'block',
					blocks: [ 'core/paragraph' ],
					transform: ( attributes ) => createBlock( 'core/paragraph', {
						content: attributes.text,
					} )
				},
			],
		},
		attributes,
		getEditWrapperProps( attributes ) {
			const { align } = attributes;
			if ( -1 !== validAlignments.indexOf( align ) ) {
				return { 'data-align': align };
			}
		},
		...checkDisableBlock(blockName, Edit),
		save: Save
	}
);
