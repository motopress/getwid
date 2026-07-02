import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { MaybeBlockIsDisabled } from 'getwid-components';

import CountdownIcon from './icon';
import metadata from './block.json';
import Edit from './edit';
import type { CountdownAttributes } from './types';

const blockName = 'getwid/countdown';

registerBlockType( metadata as BlockConfiguration< CountdownAttributes >, {
	title: __( 'Countdown', 'getwid' ),
	icon: <CountdownIcon />,
	keywords: [ __( 'timer', 'getwid' ) ],
	edit: MaybeBlockIsDisabled( blockName ) || Edit,
	save: () => null,
} );
