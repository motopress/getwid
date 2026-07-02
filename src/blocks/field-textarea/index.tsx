import {
	getBlockType,
	registerBlockType,
	type BlockConfiguration,
} from '@wordpress/blocks';
import { Path, SVG } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import FieldTextarea from '../contact-form/components/field-textarea';
import metadata from './block.json';
import type { FieldAttributes, FieldEditProps } from '../contact-form/types';

function getFieldLabel( props: FieldEditProps ) {
	return props.attributes.label === null
		? getBlockType( props.name )?.title || ''
		: props.attributes.label;
}

registerBlockType( metadata as BlockConfiguration< FieldAttributes >, {
	title: __( 'Message', 'getwid' ),
	icon: (
		<SVG xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
			<Path d="M21 11.01L3 11v2h18zM3 16h12v2H3zM21 6H3v2.01L21 8z" />
		</SVG>
	),
	edit: ( props ) => (
		<FieldTextarea
			{ ...props.attributes }
			label={ getFieldLabel( props ) }
			setAttributes={ props.setAttributes }
			isSelected={ props.isSelected }
			className={ props.className }
		/>
	),
	save: () => null,
} );
