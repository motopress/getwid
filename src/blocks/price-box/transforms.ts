import { createBlock } from '@wordpress/blocks';

import type { PriceBoxAttributes } from './types';

type ParagraphAttributes = {
	content?: string;
};

const transforms = {
	from: [
		{
			type: 'block' as const,
			blocks: [ 'core/paragraph' ],
			transform: ( content: ParagraphAttributes ) =>
				createBlock( 'getwid/price-box', {
					title: content.content,
				} ),
		},
	],
	to: [
		{
			type: 'block' as const,
			blocks: [ 'core/paragraph' ],
			transform: ( attributes: PriceBoxAttributes ) =>
				createBlock( 'core/paragraph', {
					content: attributes.title,
				} ),
		},
		{
			type: 'block' as const,
			blocks: [ 'getwid/testimonial' ],
			transform: ( attributes: PriceBoxAttributes ) =>
				createBlock( 'getwid/testimonial', {
					title: attributes.title,
				} ),
		},
		{
			type: 'block' as const,
			blocks: [ 'getwid/price-list' ],
			transform: ( attributes: PriceBoxAttributes ) =>
				createBlock( 'getwid/price-list', {
					title: attributes.title,
					currency: attributes.currency,
					amount: attributes.amount,
					description: attributes.features,
				} ),
		},
	],
};

export default transforms;
