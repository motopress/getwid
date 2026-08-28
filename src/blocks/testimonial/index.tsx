import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { MaybeBlockIsDisabled } from 'getwid-components';

import metadata from './block.json';
import { deprecated } from './deprecated';
import Edit from './edit';
import TestimonialIcon from './icon';
import Save from './save';
import transforms from './transforms';
import type { TestimonialAttributes } from './types';

const blockName = 'getwid/testimonial';

registerBlockType( metadata as BlockConfiguration< TestimonialAttributes >, {
	title: __( 'Testimonial', 'getwid' ),
	keywords: [ __( 'review', 'getwid' ), __( 'feedback', 'getwid' ) ],
	icon: <TestimonialIcon />,
	deprecated,
	transforms,
	edit: MaybeBlockIsDisabled( blockName ) || Edit,
	save: Save,
} );
