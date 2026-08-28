import {
	createBlock,
	type Block,
	type BlockConfiguration,
} from '@wordpress/blocks';
import { select } from '@wordpress/data';

import type { VideoPopupAttributes } from './types';

type BlockEditorSelect = {
	getSelectedBlockClientId: () => string | null;
	getBlock: ( clientId: string ) => Block | null;
};

function getSelectedInnerBlocks() {
	const blockEditor = select( 'core/block-editor' ) as BlockEditorSelect;
	const clientId = blockEditor.getSelectedBlockClientId();

	return clientId ? blockEditor.getBlock( clientId )?.innerBlocks ?? [] : [];
}

function getParagraphContent( innerBlocks: Block[] ) {
	return (
		innerBlocks.find( ( item ) => item.name === 'core/paragraph' )
			?.attributes.content ?? ''
	);
}

export const transforms: BlockConfiguration< VideoPopupAttributes >[ 'transforms' ] =
	{
		from: [
			{
				type: 'block',
				blocks: [ 'core/cover' ],
				transform: ( attributes ) =>
					createBlock( 'getwid/video-popup', {
						id: attributes.id,
						url: attributes.url,
						title: attributes.caption,
					} ),
			},
			{
				type: 'block',
				blocks: [ 'core/media-text' ],
				transform: ( attributes ) =>
					createBlock( 'getwid/video-popup', {
						id: attributes.mediaId,
						url: attributes.mediaUrl,
						text: getParagraphContent( getSelectedInnerBlocks() ),
					} ),
			},
			{
				type: 'block',
				blocks: [ 'core/image' ],
				transform: ( attributes ) =>
					createBlock( 'getwid/video-popup', {
						id: attributes.id,
						url: attributes.url,
						title: attributes.caption,
					} ),
			},
			{
				type: 'block',
				blocks: [ 'getwid/banner' ],
				transform: ( attributes ) =>
					createBlock( 'getwid/video-popup', {
						id: attributes.id,
						url: attributes.url,
						link: attributes.link,
						title: attributes.title,
						text: attributes.text,
					} ),
			},
			{
				type: 'block',
				blocks: [ 'getwid/image-hotspot' ],
				transform: ( attributes ) =>
					createBlock( 'getwid/video-popup', {
						id: attributes.id,
						url: attributes.url,
					} ),
			},
		],
		to: [
			{
				type: 'block',
				blocks: [ 'getwid/banner' ],
				transform: ( attributes ) =>
					createBlock( 'getwid/banner', {
						id: attributes.id,
						url: attributes.url,
						link: attributes.link,
						title: attributes.title,
						text: attributes.text,
					} ),
			},
			{
				type: 'block',
				blocks: [ 'getwid/image-box' ],
				transform: ( attributes ) =>
					createBlock(
						'getwid/image-box',
						{
							id: attributes.id,
							url: attributes.url,
						},
						[
							createBlock( 'core/heading', {
								content: attributes.title,
							} ),
							createBlock( 'core/paragraph', {
								content: attributes.text,
							} ),
						]
					),
			},
			{
				type: 'block',
				blocks: [ 'core/media-text' ],
				transform: ( attributes ) =>
					createBlock(
						'core/media-text',
						{
							mediaId: attributes.id,
							mediaUrl: attributes.url,
							mediaType: 'image',
						},
						[
							createBlock( 'core/paragraph', {
								content: attributes.text,
							} ),
						]
					),
			},
			{
				type: 'block',
				blocks: [ 'core/cover' ],
				transform: ( attributes ) =>
					createBlock( 'core/cover', {
						id: attributes.id,
						url: attributes.url,
						caption: attributes.title
							? attributes.title
							: attributes.text || '',
					} ),
			},
			{
				type: 'block',
				blocks: [ 'core/image' ],
				transform: ( attributes ) =>
					createBlock( 'core/image', {
						id: attributes.id,
						url: attributes.url,
						caption: attributes.title
							? attributes.title
							: attributes.text || '',
					} ),
			},
			{
				type: 'block',
				blocks: [ 'core/heading' ],
				transform: ( attributes ) =>
					createBlock( 'core/heading', {
						content: attributes.title,
					} ),
			},
			{
				type: 'block',
				blocks: [ 'core/paragraph' ],
				transform: ( attributes ) =>
					createBlock( 'core/paragraph', {
						content: attributes.text,
					} ),
			},
		],
	};
