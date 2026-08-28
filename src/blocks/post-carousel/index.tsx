import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { MaybeBlockIsDisabled } from 'getwid-components';

import metadata from './block.json';
import deprecated from './deprecated';
import Edit from './edit';
import PostCarouselIcon from './icon';
import save from './save';
import transforms from './transforms';
import type { PostCarouselAttributes } from './types';

import './style.scss';

const blockName = 'getwid/post-carousel';

registerBlockType( metadata as BlockConfiguration< PostCarouselAttributes >, {
	title: __( 'Post Carousel', 'getwid' ),
	icon: <PostCarouselIcon />,
	transforms,
	deprecated,
	edit: MaybeBlockIsDisabled( blockName ) || Edit,
	save,
} );
