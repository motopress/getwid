/**
 * Internal dependencies
 */
import Edit from './edit';
import Save from './save';
import Save_deprecated from './save_deprecated';
import attributes from './attributes';
import './style.scss'


/**
 * External dependencies
 */
import { __ } from 'wp.i18n';
const {jQuery: $} = window;

const {select} = wp.data;
const {registerBlockType, createBlock} = wp.blocks;


/**
 * Module Constants
 */
const validAlignments = ['left', 'center', 'right', 'wide', 'full'];


/**
 * Register the block
 */
export default registerBlockType(
	'getwid/video-popup',
	{
		title: __('Video Popup', 'getwid'),
		category: 'getwid-blocks',
		icon: <svg x="0px" y="0px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><polygon points="18,10 11,13 11,7 "/><path d="M6,2v4H2v16h16v-4h4V2H6z M16,20H4V8h2v10h10V20z M20,16H8V4h12V16z"/></svg>,
		keywords: [
			__( 'video' , 'getwid' ),
			__( 'popup' , 'getwid' ),
			__( 'button', 'getwid' )
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
					blocks: ['core/cover'],
					transform: (attributes) => createBlock('getwid/video-popup', {
						id: attributes.id,
						url: attributes.url,
						title: attributes.caption
					})
				},
				{
					type: 'block',
					blocks: ['core/media-text'],
					transform: (attributes) => {
						const clientId = select('core/editor').getSelectedBlockClientId();
						const innerBlocksArr = select('core/editor').getBlock(clientId).innerBlocks;
						let inner_attributes = {
							text: ''
						};

						if (innerBlocksArr.length) {
							jQuery.each(innerBlocksArr, (index, item) => {
								if (item.name == 'core/paragraph') {
									inner_attributes.text = item.attributes.content;
								}
							});
						}

						return createBlock('getwid/video-popup', {
							id: attributes.mediaId,
							url: attributes.mediaUrl,
							text: inner_attributes.text
						});
					}
				},
				{
					type: 'block',
					blocks: ['core/image'],
					transform: (attributes) => createBlock('getwid/video-popup', {
						id: attributes.id,
						url: attributes.url,
						title: attributes.caption
					})
				},
				{
					type: 'block',
					blocks: ['getwid/banner'],
					transform: (attributes) => createBlock('getwid/video-popup', {
						id: attributes.id,
						url: attributes.url,
						link: attributes.link,
						title: attributes.title,
						text: attributes.text
					})
				},
				{
					type: 'block',
					blocks: ['getwid/image-hotspot'],
					transform: (attributes) => createBlock('getwid/video-popup', {
						id: attributes.id,
						url: attributes.url,
					})
				},
			],
			to: [
				{
					type: 'block',
					blocks: ['getwid/banner'],
					transform: (attributes) => createBlock('getwid/banner', {
						id: attributes.id,
						url: attributes.url,
						link: attributes.link,
						title: attributes.title,
						text: attributes.text
					})
				},
				{
					type: 'block',
					blocks: ['getwid/image-box'],
					transform: (attributes) => createBlock('getwid/image-box', {
						id: attributes.id,
						url: attributes.url,
					}, [
						createBlock('core/heading', {content: attributes.title}),
						createBlock('core/paragraph', {content: attributes.text}),
					])
				},
				{
					type: 'block',
					blocks: ['core/media-text'],
					transform: (attributes) => createBlock('core/media-text', {
						mediaId: attributes.id,
						mediaUrl: attributes.url,
						mediaType: 'image',
					}, [
						createBlock('core/paragraph', {content: attributes.text}),
					])
				},
				{
					type: 'block',
					blocks: ['core/cover'],
					transform: (attributes) => createBlock('core/cover', {
						id: attributes.id,
						url: attributes.url,
						caption: attributes.title ? attributes.title : (attributes.text ? attributes.text : ''),
					})
				},
				{
					type: 'block',
					blocks: ['core/image'],
					transform: (attributes) => createBlock('core/image', {
						id: attributes.id,
						url: attributes.url,
						caption: attributes.title ? attributes.title : (attributes.text ? attributes.text : ''),
					})
				},
				{
					type: 'block',
					blocks: ['core/heading'],
					transform: (attributes) => createBlock('core/heading', {
						content: attributes.title,
					})
				},
				{
					type: 'block',
					blocks: ['core/paragraph'],
					transform: (attributes) => createBlock('core/paragraph', {
						content: attributes.text,
					})
				},
			],
		},
		attributes,
		getEditWrapperProps(attributes) {
			const {align} = attributes;
			if (-1 !== validAlignments.indexOf(align)) {
				return {'data-align': align};
			}
		},
		edit: Edit,
		save: Save
	}
);
