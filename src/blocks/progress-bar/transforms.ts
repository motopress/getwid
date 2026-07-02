import { createBlock } from '@wordpress/blocks';

import type { ProgressBarAttributes } from './types';

const transforms = {
	to: [
		{
			type: 'block',
			blocks: [ 'getwid/counter' ],
			transform: ( attributes: ProgressBarAttributes ) =>
				createBlock( 'getwid/counter', {
					end: attributes.fillAmount,
				} ),
		},
		{
			type: 'block',
			blocks: [ 'getwid/circle-progress-bar' ],
			transform: ( attributes: ProgressBarAttributes ) =>
				createBlock( 'getwid/circle-progress-bar', {
					fillAmount: attributes.fillAmount,
				} ),
		},
	],
};

export default transforms;
