import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { MaybeBlockIsDisabled } from 'getwid-components';

import metadata from './block.json';
import deprecated from './deprecated';
import Edit from './edit';
import PriceListIcon from './icon';
import Save from './save';
import transforms from './transforms';
import type { PriceListAttributes } from './types';

const blockName = 'getwid/price-list';

registerBlockType( metadata as BlockConfiguration< PriceListAttributes >, {
	title: __( 'Price List', 'getwid' ),
	icon: <PriceListIcon />,
	keywords: [ __( 'price', 'getwid' ), __( 'list', 'getwid' ) ],
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
