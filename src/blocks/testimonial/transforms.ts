import { createBlock } from '@wordpress/blocks';

import type { TestimonialAttributes } from './types';

const transforms = {
	from: [
		{
			type: 'block' as const,
			blocks: [ 'core/paragraph' ],
			transform: ( content: { content?: string } ) =>
				createBlock( 'getwid/testimonial', {
					title: content.content,
				} ),
		},
	],
	to: [
		{
			type: 'block' as const,
			blocks: [ 'core/paragraph' ],
			transform: ( attributes: TestimonialAttributes ) =>
				createBlock( 'core/paragraph', {
					content: attributes.title,
				} ),
		},
		{
			type: 'block' as const,
			blocks: [ 'getwid/price-list' ],
			transform: ( attributes: TestimonialAttributes ) =>
				createBlock( 'getwid/price-list', {
					// The legacy transform overwrites title with testimonial content.
					title: attributes.content,
					description: attributes.subtitle,
					id: attributes.imgId,
					url: attributes.imgUrl,
				} ),
		},
		{
			type: 'block' as const,
			blocks: [ 'getwid/price-box' ],
			transform: ( attributes: TestimonialAttributes ) =>
				createBlock( 'getwid/price-box', {
					title: attributes.title,
				} ),
		},
	],
};

export default transforms;
