import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { MaybeBlockIsDisabled } from 'getwid-components';

import metadata from './block.json';
import deprecated from './deprecated';
import Edit from './edit';
import PriceBoxIcon from './icon';
import Save from './save';
import transforms from './transforms';
import type { PriceBoxAttributes } from './types';

const blockName = 'getwid/price-box';

registerBlockType( metadata as BlockConfiguration< PriceBoxAttributes >, {
	title: __( 'Price Box', 'getwid' ),
	icon: <PriceBoxIcon />,
	transforms,
	deprecated,
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
