import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';

import { itemBaseClass } from '../content-timeline/constants';
import Edit from './edit';
import metadata from './block.json';
import Save from './save';
import { deprecated } from './deprecated';
import type { ContentTimelineItemAttributes } from '../content-timeline/types';

registerBlockType(
	metadata as BlockConfiguration< ContentTimelineItemAttributes >,
	{
		title: __( 'Timeline Block', 'getwid' ),
		deprecated,
		edit: ( props ) => <Edit { ...props } baseClass={ itemBaseClass } />,
		save: Save,
	}
);
