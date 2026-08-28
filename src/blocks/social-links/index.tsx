import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { MaybeBlockIsDisabled } from 'getwid-components';

import metadata from './block.json';
import Edit from './edit';
import SocialLinksIcon from './icon';
import Save from './save';
import type { SocialLinksAttributes } from './types';

const blockName = 'getwid/social-links';

registerBlockType( metadata as BlockConfiguration< SocialLinksAttributes >, {
	title: __( 'Social Links', 'getwid' ),
	icon: <SocialLinksIcon />,
	edit: MaybeBlockIsDisabled( blockName ) || Edit,
	save: Save,
} );
