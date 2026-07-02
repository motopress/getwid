import {
	createBlock,
	type Block,
	type BlockConfiguration,
} from '@wordpress/blocks';

import type { AccordionAttributes } from './types';

export const transforms: BlockConfiguration< AccordionAttributes >[ 'transforms' ] =
	{
		to: [
			{
				type: 'block',
				blocks: [ 'getwid/toggle' ],
				isMatch: ( _attributes, block ) => block.innerBlocks.length,
				transform: (
					attributes: AccordionAttributes,
					innerBlocks: Block[] = []
				) => {
					if ( ! innerBlocks.length ) {
						return undefined as unknown as Block;
					}

					return createBlock(
						'getwid/toggle',
						{
							align: attributes.align,
							iconPosition: attributes.iconPosition,
							iconOpen: attributes.iconOpen,
							iconClose: attributes.iconClose,
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
											attributes.active ?? 'none',
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
				blocks: [ 'getwid/tabs' ],
				transform: (
					attributes: AccordionAttributes,
					innerBlocks: Block[] = []
				) => {
					if ( ! innerBlocks.length ) {
						return undefined as unknown as Block;
					}

					return createBlock(
						'getwid/tabs',
						{
							align: attributes.align,
							active: attributes.active,
							headerTag: attributes.headerTag,
						},
						innerBlocks.map( ( innerItem ) =>
							createBlock(
								'getwid/tabs-item',
								{
									title: innerItem.attributes.title,
								},
								innerItem.innerBlocks
							)
						)
					);
				},
			},
		],
	};
