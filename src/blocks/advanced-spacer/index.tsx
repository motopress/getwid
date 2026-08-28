import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { Path, SVG } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { MaybeBlockIsDisabled } from 'getwid-components';

import metadata from './block.json';
import Edit from './edit';
import Save from './save';
import { transforms } from './transforms';
import type { AdvancedSpacerAttributes } from './types';

registerBlockType( metadata as BlockConfiguration< AdvancedSpacerAttributes >, {
	title: __( 'Advanced Spacer', 'getwid' ),
	icon: (
		<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<Path d="M13 4v2h3.59L6 16.59V13H4v7h7v-2H7.41L18 7.41V11h2V4h-7" />
		</SVG>
	),
	transforms,
	edit: MaybeBlockIsDisabled( 'getwid/advanced-spacer' ) || Edit,
	save: Save,
} );
