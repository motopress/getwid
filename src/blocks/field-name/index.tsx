import {
	getBlockType,
	registerBlockType,
	type BlockConfiguration,
} from '@wordpress/blocks';
import { Path, SVG } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import Field from '../contact-form/components/field';
import metadata from './block.json';
import type { FieldAttributes, FieldEditProps } from '../contact-form/types';

function getFieldLabel( props: FieldEditProps ) {
	return props.attributes.label === null
		? getBlockType( props.name )?.title || ''
		: props.attributes.label;
}

registerBlockType( metadata as BlockConfiguration< FieldAttributes >, {
	title: __( 'Name', 'getwid' ),
	icon: (
		<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<Path d="M12 6c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2m0 10c2.7 0 5.8 1.29 6 2H6c.23-.72 3.31-2 6-2m0-12C9.79 4 8 5.79 8 8s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 10c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
		</SVG>
	),
	edit: ( props ) => (
		<Field
			{ ...props.attributes }
			label={ getFieldLabel( props ) }
			setAttributes={ props.setAttributes }
			isSelected={ props.isSelected }
			className={ props.className }
			type="text"
		/>
	),
	save: () => null,
} );
