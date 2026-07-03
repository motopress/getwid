import {
	getBlockType,
	registerBlockType,
	type BlockConfiguration,
} from '@wordpress/blocks';
import { Path, SVG } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import metadata from './block.json';
import { type FieldAttributes } from 'getwid-components';
import { Edit } from './edit';

registerBlockType( metadata as BlockConfiguration< FieldAttributes >, {
	title: __( 'Email', 'getwid' ),
	icon: (
		<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<Path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z" />
		</SVG>
	),
	edit: Edit,
	save: () => null,
} );
