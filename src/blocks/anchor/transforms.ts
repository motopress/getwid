import { createBlock } from '@wordpress/blocks';

export const transforms = {
	to: [
		{
			type: 'block',
			blocks: [ 'core/spacer' ],
			transform: () => createBlock( 'core/spacer' ),
		},
	],
};
