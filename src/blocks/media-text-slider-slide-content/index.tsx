import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import metadata from './block.json';
import deprecated from './deprecated';
import Edit from './edit';
import Save from './save';
import type { MediaTextSliderSlideContentAttributes } from './types';

registerBlockType(
	metadata as BlockConfiguration< MediaTextSliderSlideContentAttributes >,
	{
		title: __( 'Image', 'getwid' ),
		icon: {
			src: 'format-image',
		},
		deprecated,
		edit: Edit,
		save: Save,
	}
);
