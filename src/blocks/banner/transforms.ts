import { createBlock, type BlockInstance } from '@wordpress/blocks';
import { select } from '@wordpress/data';

import type { BannerAttributes } from './types';

type CoreImageAttributes = {
	id?: number;
	url?: string;
	caption?: string;
};

type CoreMediaTextAttributes = {
	mediaId?: number;
	mediaUrl?: string;
};

type BlockEditorSelect = {
	getSelectedBlockClientId: () => string;
	getBlock: ( clientId: string ) => BlockInstance;
};

function getSelectedParagraphText() {
	const blockEditorSelect = select(
		'core/block-editor'
	) as BlockEditorSelect;
	const clientId = blockEditorSelect.getSelectedBlockClientId();
	const innerBlocks = clientId
		? blockEditorSelect.getBlock( clientId )?.innerBlocks || []
		: [];
	const paragraph = innerBlocks.find(
		( block ) => block.name === 'core/paragraph'
	);

	return typeof paragraph?.attributes.content === 'string'
		? paragraph.attributes.content
		: '';
}

export const transforms = {
	from: [
		{
			type: 'block',
			blocks: [ 'core/image' ],
			transform: ( attributes: CoreImageAttributes ) =>
				createBlock( 'getwid/banner', {
					id: attributes.id,
					url: attributes.url,
					title: attributes.caption,
				} ),
		},
		{
			type: 'block',
			blocks: [ 'core/media-text' ],
			transform: ( attributes: CoreMediaTextAttributes ) =>
				createBlock( 'getwid/banner', {
					id: attributes.mediaId,
					url: attributes.mediaUrl,
					text: getSelectedParagraphText(),
				} ),
		},
		{
			type: 'block',
			blocks: [ 'core/cover' ],
			transform: ( attributes: CoreImageAttributes ) =>
				createBlock( 'getwid/banner', {
					id: attributes.id,
					url: attributes.url,
					title: attributes.caption,
				} ),
		},
	],
	to: [
		{
			type: 'block',
			blocks: [ 'core/cover' ],
			transform: ( attributes: BannerAttributes ) =>
				createBlock( 'core/cover', {
					id: attributes.id,
					url: attributes.url,
					caption:
						attributes.title ||
						( attributes.text ? attributes.text : '' ),
				} ),
		},
		{
			type: 'block',
			blocks: [ 'core/image' ],
			transform: ( attributes: BannerAttributes ) =>
				createBlock( 'core/image', {
					id: attributes.id,
					url: attributes.url,
					caption:
						attributes.title ||
						( attributes.text ? attributes.text : '' ),
				} ),
		},
		{
			type: 'block',
			blocks: [ 'getwid/image-box' ],
			transform: ( attributes: BannerAttributes ) =>
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
			transform: ( attributes: BannerAttributes ) =>
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
			transform: ( attributes: BannerAttributes ) =>
				createBlock( 'core/cover', {
					id: attributes.id,
					url: attributes.url,
				} ),
		},
		{
			type: 'block',
			blocks: [ 'core/heading' ],
			transform: ( attributes: BannerAttributes ) =>
				createBlock( 'core/heading', {
					content: attributes.title,
				} ),
		},
		{
			type: 'block',
			blocks: [ 'core/paragraph' ],
			transform: ( attributes: BannerAttributes ) =>
				createBlock( 'core/paragraph', {
					content: attributes.text,
				} ),
		},
	],
};
