import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { MaybeBlockIsDisabled } from 'getwid-components';

import metadata from './block.json';
import Edit from './edit';
import RecentPostsIcon from './icon';
import transforms from './transforms';
import type { RecentPostsAttributes } from './types';

const blockName = 'getwid/recent-posts';

registerBlockType( metadata as BlockConfiguration< RecentPostsAttributes >, {
	title: __( 'Recent Posts', 'getwid' ),
	icon: <RecentPostsIcon />,
	transforms,
	edit: MaybeBlockIsDisabled( blockName ) || Edit,
	save: () => null,
} );
