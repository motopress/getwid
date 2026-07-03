import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { Path, SVG } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import metadata from './block.json';
import { type FieldAttributes } from 'getwid-components';
import { Edit } from './edit';

registerBlockType( metadata as BlockConfiguration< FieldAttributes >, {
	title: __( 'Message', 'getwid' ),
	icon: (
		<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<Path d="M21 11.01L3 11v2h18zM3 16h12v2H3zM21 6H3v2.01L21 8z" />
		</SVG>
	),
	edit: Edit,
	save: () => null,
} );
