import { createBlock } from '@wordpress/blocks';

import type { IconAttributes } from './types';

const transforms = {
	to: [
		{
			type: 'block' as const,
			blocks: [ 'getwid/icon-box' ],
			transform: ( attributes: IconAttributes ) =>
				createBlock( 'getwid/icon-box', attributes ),
		},
	],
};

export default transforms;
