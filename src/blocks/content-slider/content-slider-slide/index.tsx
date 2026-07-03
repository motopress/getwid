import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import Edit from './edit';
import metadata from './block.json';
import Save from './save';
import type { ContentSliderSlideAttributes } from '../content-slider/types';

registerBlockType(
	metadata as BlockConfiguration< ContentSliderSlideAttributes >,
	{
		title: __( 'Slide', 'getwid' ),
		edit: Edit,
		save: Save,
	}
);
