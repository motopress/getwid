import { createBlock } from '@wordpress/blocks';
import { select } from '@wordpress/data';

import type { ImageBoxAttributes, InnerBlock } from './types';
import { getInnerTextContent, getInnerContent } from './utils';

type BlockEditorSelect = {
	getSelectedBlockClientId: () => string | null;
	getBlock: ( clientId: string | null ) =>
		| {
				innerBlocks: InnerBlock[];
		  }
		| undefined;
};

function getSelectedInnerBlocks() {
	const blockEditor = select( 'core/block-editor' ) as BlockEditorSelect;
	const clientId = blockEditor.getSelectedBlockClientId();

	return blockEditor.getBlock( clientId )?.innerBlocks || [];
}

const transforms = {
	to: [
		{
			type: 'block' as const,
			blocks: [ 'core/image' ],
			transform: ( attributes: ImageBoxAttributes ) => {
				const innerAttributes = getInnerTextContent(
					getSelectedInnerBlocks()
				);

				return createBlock( 'core/image', {
					id: attributes.id,
					url: attributes.url,
					caption: innerAttributes.heading || innerAttributes.text,
				} );
			},
		},
		{
			type: 'block' as const,
			blocks: [ 'getwid/banner' ],
			transform: ( attributes: ImageBoxAttributes ) => {
				const innerAttributes = getInnerTextContent(
					getSelectedInnerBlocks()
				);

				return createBlock( 'getwid/banner', {
					id: attributes.id,
					url: attributes.url,
					title: innerAttributes.heading,
					text: innerAttributes.text,
				} );
			},
		},
		{
			type: 'block' as const,
			blocks: [ 'getwid/video-popup' ],
			transform: ( attributes: ImageBoxAttributes ) => {
				const innerAttributes = getInnerTextContent(
					getSelectedInnerBlocks()
				);

				return createBlock( 'getwid/video-popup', {
					id: attributes.id,
					url: attributes.url,
					title: innerAttributes.heading,
					text: innerAttributes.text,
				} );
			},
		},
		{
			type: 'block' as const,
			blocks: [ 'getwid/icon-box' ],
			transform: ( attributes: ImageBoxAttributes ) =>
				createBlock(
					'getwid/icon-box',
					attributes,
					getSelectedInnerBlocks()
				),
		},
		{
			type: 'block' as const,
			blocks: [ 'core/heading' ],
			transform: () =>
				createBlock( 'core/heading', {
					content: getInnerContent(
						getSelectedInnerBlocks(),
						'core/heading'
					),
				} ),
		},
		{
			type: 'block' as const,
			blocks: [ 'core/paragraph' ],
			transform: () =>
				createBlock( 'core/paragraph', {
					content: getInnerContent(
						getSelectedInnerBlocks(),
						'core/paragraph'
					),
				} ),
		},
	],
};

export default transforms;
