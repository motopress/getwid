import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import metadata from './block.json';
import deprecated from './deprecated';
import Edit from './edit';
import Save from './save';
import type { MediaTextSliderSlideAttributes } from './types';

registerBlockType(
	metadata as BlockConfiguration< MediaTextSliderSlideAttributes >,
	{
		title: __( 'Slide', 'getwid' ),
		icon: {
			src: 'format-gallery',
		},
		getEditWrapperProps( attributes ) {
			const currentId =
				attributes.slideId !== undefined
					? attributes.slideId
					: attributes.id;

			return { 'data-slide': currentId };
		},
		deprecated,
		edit: Edit,
		save: Save,
	}
);
