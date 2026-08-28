import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { MaybeBlockIsDisabled } from 'getwid-components';

import CounterIcon from './icon';
import metadata from './block.json';
import deprecated from './deprecated';
import Edit from './edit';
import Save from './save';
import transforms from './transforms';
import type { CounterAttributes } from './types';

const blockName = 'getwid/counter';

registerBlockType( metadata as BlockConfiguration< CounterAttributes >, {
	title: __( 'Counter', 'getwid' ),
	icon: <CounterIcon />,
	transforms,
	deprecated,
	edit: MaybeBlockIsDisabled( blockName ) || Edit,
	save: Save,
} );
