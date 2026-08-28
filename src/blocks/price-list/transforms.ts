import { createBlock } from '@wordpress/blocks';

import type { PriceListAttributes } from './types';

const transforms = {
	from: [
		{
			type: 'block',
			blocks: [ 'core/paragraph' ],
			transform: ( content: { content?: string } ) =>
				createBlock( 'getwid/price-list', {
					title: content.content,
				} ),
		},
	],
	to: [
		{
			type: 'block',
			blocks: [ 'core/paragraph' ],
			transform: ( attributes: PriceListAttributes ) =>
				createBlock( 'core/paragraph', {
					content: attributes.title,
				} ),
		},
		{
			type: 'block',
			blocks: [ 'getwid/testimonial' ],
			transform: ( attributes: PriceListAttributes ) =>
				createBlock( 'getwid/testimonial', {
					imgId: attributes.id,
					imgUrl: attributes.url,
					title: attributes.title,
					subtitle: attributes.description,
				} ),
		},
		{
			type: 'block',
			blocks: [ 'getwid/price-box' ],
			transform: ( attributes: PriceListAttributes ) =>
				createBlock( 'getwid/price-box', {
					title: attributes.title,
					currency: attributes.currency,
					amount: attributes.amount,
				} ),
		},
	],
};

export default transforms;
