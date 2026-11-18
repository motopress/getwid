import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { MaybeBlockIsDisabled } from 'getwid-components';

import Edit from './edit';
import { AI as Icon } from './icons';
import metadata from './block.json';
import type { AiTextAttributes } from './types';

registerBlockType( metadata as BlockConfiguration< AiTextAttributes >, {
	title: __( 'AI Assistant', 'getwid' ),
	icon: <Icon />,
	description: __(
		'Generate draft text with AI assistance. Review before publishing.',
		'getwid'
	),
	edit: MaybeBlockIsDisabled( 'getwid/ai-text' ) || Edit,
	save: () => null,
} );
