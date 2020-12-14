/**
* Internal dependencies
*/
import Edit from './edit';
import Save from './save';
import Save_deprecated from './save_deprecated';
import attributes from './attributes';
import './style.scss'
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
const blockName = 'getwid/image-hotspot';

/**
* Register the block
*/
export default registerBlockType(
	'getwid/image-hotspot',
	{
		title: __( 'Image Hotspot', 'getwid' ),
		category: 'getwid-blocks',
		icon: <svg x="0px" y="0px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="20" r="2"/><path d="M20,4v7h-4h-0.67l-0.53,0.4L12,13.5l-2.8-2.1L8.67,11H8H4V4H20 M22,2H2v11h6l4,3l4-3h6V2L22,2z"/></svg>,
		keywords: [
			__( 'tooltip', 'getwid' ),
		],
		supports: {
			alignWide: true,
			align: [ 'wide', 'full' ],
			inserter: !Getwid.disabled_blocks.includes(blockName)
		},
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
					transform: ( attributes ) => createBlock( 'getwid/image-hotspot', {
						id: attributes.id,
						url: attributes.url,
					} )
				},
				{
					type: 'block',
					blocks: [ 'core/media-text' ],
					transform: ( attributes ) => createBlock( 'getwid/image-hotspot', {
						id: attributes.mediaId,
						url: attributes.mediaUrl,
					} )
				},
				{
					type: 'block',
					blocks: [ 'getwid/image-box' ],
					transform: ( attributes ) => createBlock( 'getwid/image-hotspot', {
						id: attributes.id,
						url: attributes.url,
					} )
				},
				{
					type: 'block',
					blocks: [ 'core/cover' ],
					transform: ( attributes ) => createBlock( 'getwid/image-hotspot', {
						id: attributes.id,
						url: attributes.url,
					} )
				},
				{
					type: 'block',
					blocks: [ 'getwid/banner' ],
					transform: ( attributes ) => createBlock( 'getwid/image-hotspot', {
						id: attributes.id,
						url: attributes.url,
					} )
				},
				{
					type: 'block',
					blocks: [ 'getwid/video-popup' ],
					transform: ( attributes ) => createBlock( 'getwid/image-hotspot', {
						id: attributes.id,
						url: attributes.url,
					} )
				},
			],
			to: [
				{
					type: 'block',
					blocks: [ 'core/media-text' ],
					transform: ( attributes ) => {
						return createBlock( 'core/media-text', {
							mediaId: attributes.id,
							mediaUrl: attributes.url,
							mediaType: 'image',
						} );
					}
				},
				{
					type: 'block',
					blocks: [ 'core/cover' ],
					transform: ( attributes ) => {
						return createBlock( 'core/cover', {
							id: attributes.id,
							url: attributes.url,
						} );
					}
				},
				{
					type: 'block',
					blocks: [ 'getwid/image-box' ],
					transform: ( attributes ) => {
						return createBlock( 'getwid/image-box', {
							id: attributes.id,
							url: attributes.url,
						} );
					}
				},
				{
					type: 'block',
					blocks: [ 'core/image' ],
					transform: ( attributes ) => {
						return createBlock( 'core/image', {
							id: attributes.id,
							url: attributes.url,
						} );
					}
				},
				{
					type: 'block',
					blocks: [ 'getwid/banner' ],
					transform: ( attributes ) => {
						return createBlock( 'getwid/banner', {
							id: attributes.id,
							url: attributes.url,
						} );
					}
				},
			],
		},
		attributes,
		...checkDisableBlock(blockName, Edit),
		save: Save
	}
);
