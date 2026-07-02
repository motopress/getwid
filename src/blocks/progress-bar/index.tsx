import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { MaybeBlockIsDisabled } from 'getwid-components';

import metadata from './block.json';
import Edit from './edit';
import ProgressBarIcon from './icon';
import Save from './save';
import transforms from './transforms';
import type { ProgressBarAttributes } from './types';

const blockName = 'getwid/progress-bar';

registerBlockType( metadata as BlockConfiguration< ProgressBarAttributes >, {
	title: __( 'Progress Bar', 'getwid' ),
	icon: <ProgressBarIcon />,
	transforms,
	getEditWrapperProps( attributes ) {
		const { align } = attributes;

		if ( align && [ 'wide', 'full' ].includes( align ) ) {
			return { 'data-align': align };
		}

		return undefined;
	},
	edit: MaybeBlockIsDisabled( blockName ) || Edit,
	save: Save,
} );
