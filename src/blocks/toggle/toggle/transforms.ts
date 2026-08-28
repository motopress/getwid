import {
	createBlock,
	type Block,
	type BlockConfiguration,
} from '@wordpress/blocks';

import type { ToggleAttributes } from './types';

export const transforms: BlockConfiguration< ToggleAttributes >[ 'transforms' ] =
	{
		to: [
			{
				type: 'block',
				blocks: [ 'getwid/accordion' ],
				transform: (
					attributes: ToggleAttributes,
					innerBlocks: Block[] = []
				) => {
					if ( ! innerBlocks.length ) {
						return undefined as unknown as Block;
					}

					let active = 'none';

					innerBlocks.some( ( item, index ) => {
						if ( item.attributes.active ) {
							active = String( index );
							return true;
						}

						return false;
					} );

					return createBlock(
						'getwid/accordion',
						{
							align: attributes.align,
							active,
							iconPosition: attributes.iconPosition,
							iconOpen: attributes.iconOpen,
							iconClose: attributes.iconClose,
							headerTag: attributes.headerTag,
						},
						innerBlocks.map( ( innerItem ) =>
							createBlock(
								'getwid/accordion-item',
								{
									title: innerItem.attributes.title,
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
					attributes: ToggleAttributes,
					innerBlocks: Block[] = []
				) => {
					if ( ! innerBlocks.length ) {
						return undefined as unknown as Block;
					}

					let active = '0';

					innerBlocks.some( ( item, index ) => {
						if ( item.attributes.active ) {
							active = String( index );
							return true;
						}

						return false;
					} );

					return createBlock(
						'getwid/tabs',
						{
							align: attributes.align,
							active,
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
