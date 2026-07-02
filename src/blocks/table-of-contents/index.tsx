import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { MaybeBlockIsDisabled } from 'getwid-components';

import metadata from './block.json';
import Edit from './edit';
import TableOfContentsIcon from './icon';
import Save from './save';
import type { TableOfContentsAttributes } from './types';

const blockName = 'getwid/table-of-contents';

registerBlockType(
	metadata as BlockConfiguration< TableOfContentsAttributes >,
	{
		title: __( 'Table of Contents', 'getwid' ),
		keywords: [ __( 'summary', 'getwid' ) ],
		icon: <TableOfContentsIcon />,
		edit: MaybeBlockIsDisabled( blockName ) || Edit,
		save: Save,
	}
);
