import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { createBlock } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { MaybeBlockIsDisabled } from 'getwid-components';

import CircleProgressBarIcon from './icon';
import metadata from './block.json';
import Edit from './edit';
import Save from './save';
import type { CircleProgressBarAttributes } from './types';

const blockName = 'getwid/circle-progress-bar';

const transforms = {
	to: [
		{
			type: 'block' as const,
			blocks: [ 'getwid/counter' ],
			transform: ( attributes: CircleProgressBarAttributes ) =>
				createBlock( 'getwid/counter', {
					end: attributes.fillAmount,
				} ),
		},
		{
			type: 'block' as const,
			blocks: [ 'getwid/progress-bar' ],
			transform: ( attributes: CircleProgressBarAttributes ) =>
				createBlock( 'getwid/progress-bar', {
					fillAmount: attributes.fillAmount,
					isAnimated: 'false',
				} ),
		},
	],
};

registerBlockType(
	metadata as BlockConfiguration< CircleProgressBarAttributes >,
	{
		title: __( 'Circular Progress Bar', 'getwid' ),
		icon: <CircleProgressBarIcon />,
		transforms,
		edit: MaybeBlockIsDisabled( blockName ) || Edit,
		save: Save,
	}
);
