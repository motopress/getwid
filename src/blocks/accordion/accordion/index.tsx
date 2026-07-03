import { registerBlockType, type BlockConfiguration } from '@wordpress/blocks';
import { Path, SVG } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import metadata from './block.json';
import Edit from './edit';
import Save from './save';
import { deprecated } from './deprecated';
import { transforms } from './transforms';

import './editor.scss';
import './style.scss';
import type { AccordionAttributes } from './types';
import { MaybeBlockIsDisabled } from 'getwid-components';

registerBlockType( metadata as BlockConfiguration< AccordionAttributes >, {
	icon: (
		<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<Path d="M0,0v6h24V0H0z M22,4H2V2h20V4z" />
			<Path d="M0,18v6h24v-6H0z M22,22H2v-2h20V22z" />
			<Path d="M0,8v8h24V8H0z M22,14H2v-4h20V14z" />
		</SVG>
	),
	title: __( 'Accordion', 'getwid' ),
	// deprecated,
	// transforms,
	edit: MaybeBlockIsDisabled( 'getwid/accordion' ) || Edit,
	save: Save,
} );
