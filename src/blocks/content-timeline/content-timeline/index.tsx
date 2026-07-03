import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { MaybeBlockIsDisabled } from 'getwid-components';

import { baseClass } from './constants';
import ContentTimelineIcon from './icon';
import metadata from './block.json';
import Edit from './edit';
import Save from './save';
import { transforms } from './transforms';
import type { ContentTimelineAttributes } from './types';

const blockName = 'getwid/content-timeline';

registerBlockType(
	metadata as BlockConfiguration< ContentTimelineAttributes >,
	{
		title: __( 'Content Timeline', 'getwid' ),
		icon: <ContentTimelineIcon />,
		keywords: [ __( 'vertical', 'getwid' ), __( 'workflow', 'getwid' ) ],
		transforms,
		edit:
			MaybeBlockIsDisabled( blockName ) ||
			( ( props ) => <Edit { ...props } baseClass={ baseClass } /> ),
		save: Save,
	}
);
