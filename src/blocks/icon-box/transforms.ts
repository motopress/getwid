import { createBlock } from '@wordpress/blocks';
import { select } from '@wordpress/data';

import type { IconBoxAttributes } from './types';

type InnerBlock = {
	name: string;
	attributes: {
		content?: string;
	};
};

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

function getInnerContent( blockName: string ) {
	return getSelectedInnerBlocks().find( ( item ) => item.name === blockName )
		?.attributes.content;
}

const transforms = {
	to: [
		{
			type: 'block' as const,
			blocks: [ 'getwid/icon' ],
			transform: ( attributes: IconBoxAttributes ) =>
				createBlock( 'getwid/icon', attributes ),
		},
		{
			type: 'block' as const,
			blocks: [ 'getwid/image-box' ],
			transform: ( attributes: IconBoxAttributes ) =>
				createBlock(
					'getwid/image-box',
					attributes,
					getSelectedInnerBlocks()
				),
		},
		{
			type: 'block' as const,
			blocks: [ 'core/heading' ],
			transform: () =>
				createBlock( 'core/heading', {
					content: getInnerContent( 'core/heading' ),
				} ),
		},
		{
			type: 'block' as const,
			blocks: [ 'core/paragraph' ],
			transform: () =>
				createBlock( 'core/paragraph', {
					content: getInnerContent( 'core/paragraph' ),
				} ),
		},
	],
};

export default transforms;
