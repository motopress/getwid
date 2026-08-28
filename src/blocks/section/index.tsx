import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { MaybeBlockIsDisabled } from 'getwid-components';

import attributes from './attributes';
import metadata from './block.json';
import Edit from './edit';
import SectionIcon from './icon';
import Save from './save';
import deprecated from './deprecated';
import type { SectionAttributes } from './types';

const blockName = 'getwid/section';

registerBlockType( metadata as BlockConfiguration< SectionAttributes >, {
	attributes:
		attributes as BlockConfiguration< SectionAttributes >[ 'attributes' ],
	title: __( 'Section', 'getwid' ),
	icon: <SectionIcon />,
	keywords: [
		__( 'container', 'getwid' ),
		__( 'wrapper', 'getwid' ),
		__( 'row', 'getwid' ),
	],
	edit: MaybeBlockIsDisabled( blockName ) || Edit,
	save: Save,
	deprecated,
} );
