import {
	createBlock,
	type Block,
	type BlockConfiguration,
} from '@wordpress/blocks';

import type { TabsAttributes } from './types';

export const transforms: BlockConfiguration< TabsAttributes >[ 'transforms' ] =
	{
		to: [
			{
				type: 'block',
				blocks: [ 'getwid/toggle' ],
				transform: (
					attributes: TabsAttributes,
					innerBlocks: Block[] = []
				) => {
					if ( ! innerBlocks.length ) {
						return undefined as unknown as Block;
					}

					return createBlock(
						'getwid/toggle',
						{
							align: attributes.align,
							headerTag: attributes.headerTag,
						},
						innerBlocks.map( ( innerItem, index ) =>
							createBlock(
								'getwid/toggle-item',
								{
									title: innerItem.attributes.title,
									active:
										index ===
										Number.parseInt(
											attributes.active ?? '0',
											10
										),
								},
								innerItem.innerBlocks
							)
						)
					);
				},
			},
			{
				type: 'block',
				blocks: [ 'getwid/accordion' ],
				transform: (
					attributes: TabsAttributes,
					innerBlocks: Block[] = []
				) => {
					if ( ! innerBlocks.length ) {
						return undefined as unknown as Block;
					}

					return createBlock(
						'getwid/accordion',
						{
							align: attributes.align,
							active: attributes.active,
							headerTag: attributes.headerTag,
						},
						innerBlocks.map( ( innerItem ) =>
							createBlock(
								'getwid/accordion-item',
								{ title: innerItem.attributes.title },
								innerItem.innerBlocks
							)
						)
					);
				},
			},
		],
	};
