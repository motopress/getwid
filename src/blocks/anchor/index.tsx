import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { MaybeBlockIsDisabled } from 'getwid-components';

import Edit from './edit';
import AnchorIcon from './icon';
import metadata from './block.json';
import Save from './save';
import { transforms } from './transforms';
import type { AnchorAttributes } from './types';

registerBlockType( metadata as BlockConfiguration< AnchorAttributes >, {
	title: __( 'Anchor', 'getwid' ),
	icon: <AnchorIcon />,
	transforms,
	edit: MaybeBlockIsDisabled( 'getwid/anchor' ) || Edit,
	save: Save,
} );
