import { createBlock } from '@wordpress/blocks';

import type { AdvancedSpacerAttributes } from './types';

export const transforms = {
	to: [
		{
			type: 'block',
			blocks: [ 'core/spacer' ],
			transform: ( attributes: AdvancedSpacerAttributes ) =>
				createBlock( 'core/spacer', {
					height: parseInt( attributes.height, 10 ),
				} ),
		},
	],
};
