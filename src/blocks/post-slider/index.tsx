import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { MaybeBlockIsDisabled } from 'getwid-components';

import metadata from './block.json';
import deprecated from './deprecated';
import Edit from './edit';
import PostSliderIcon from './icon';
import save from './save';
import transforms from './transforms';
import type { PostSliderAttributes } from './types';

import './style.scss';

const blockName = 'getwid/post-slider';

registerBlockType( metadata as BlockConfiguration< PostSliderAttributes >, {
	title: __( 'Post Slider', 'getwid' ),
	icon: <PostSliderIcon />,
	transforms,
	deprecated,
	edit: MaybeBlockIsDisabled( blockName ) || Edit,
	save,
} );
