import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { MaybeBlockIsDisabled } from 'getwid-components';

import ContentSliderIcon from './icon';
import metadata from './block.json';
import Edit from './edit';
import Save from './save';
import type { ContentSliderAttributes } from './types';

const blockName = 'getwid/content-slider';

registerBlockType( metadata as BlockConfiguration< ContentSliderAttributes >, {
	title: __( 'Content Slider', 'getwid' ),
	icon: <ContentSliderIcon />,
	edit: MaybeBlockIsDisabled( blockName ) || Edit,
	save: Save,
} );
