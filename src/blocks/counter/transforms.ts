import { createBlock } from '@wordpress/blocks';

import type { CounterAttributes } from './types';

const transforms = {
	to: [
		{
			type: 'block' as const,
			blocks: [ 'getwid/progress-bar' ],
			transform: ( attributes: CounterAttributes ) =>
				createBlock( 'getwid/progress-bar', {
					fillAmount: attributes.end,
					isAnimated: 'false',
				} ),
		},
		{
			type: 'block' as const,
			blocks: [ 'getwid/circle-progress-bar' ],
			transform: ( attributes: CounterAttributes ) =>
				createBlock( 'getwid/circle-progress-bar', {
					fillAmount: attributes.end,
				} ),
		},
	],
};

export default transforms;
