import { createBlock } from '@wordpress/blocks';

import type { AdvancedHeadingAttributes } from './types';

type CoreTextAttributes = {
	content?: string;
};

export const transforms = {
	from: [
		{
			type: 'block',
			blocks: [ 'core/heading' ],
			transform: ( attributes: CoreTextAttributes ) =>
				createBlock( 'getwid/advanced-heading', attributes ),
		},
		{
			type: 'block',
			blocks: [ 'core/paragraph' ],
			transform: ( attributes: CoreTextAttributes ) =>
				createBlock( 'getwid/advanced-heading', attributes ),
		},
	],
	to: [
		{
			type: 'block',
			blocks: [ 'core/heading' ],
			transform: ( attributes: AdvancedHeadingAttributes ) =>
				createBlock( 'core/heading', {
					content: attributes.content,
				} ),
		},
		{
			type: 'block',
			blocks: [ 'core/paragraph' ],
			transform: ( attributes: AdvancedHeadingAttributes ) =>
				createBlock( 'core/paragraph', {
					content: attributes.content,
				} ),
		},
	],
};
