import { PlainText } from '@wordpress/block-editor';
import { ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import type { FieldAttributes } from '../types';

const baseClass = 'getwid-field-label';

type FieldLabelProps = {
	setAttributes: ( attributes: Partial< FieldAttributes > ) => void;
	label: string;
	isSelected: boolean;
	required: boolean;
	requiredDefault?: boolean;
};

export default function FieldLabel( {
	setAttributes,
	label,
	isSelected,
	required,
	requiredDefault,
}: FieldLabelProps ) {
	return (
		<div className={ baseClass }>
			<PlainText
				value={ label }
				className={ `${ baseClass }__input` }
				onChange={ ( nextLabel ) =>
					setAttributes( { label: nextLabel } )
				}
				placeholder={ __( 'Write label…', 'getwid' ) }
			/>
			{ isSelected && ! requiredDefault && (
				<ToggleControl
					label={ __( 'Required', 'getwid' ) }
					className={ `${ baseClass }__required` }
					checked={ required }
					onChange={ ( nextRequired ) =>
						setAttributes( { required: nextRequired } )
					}
				/>
			) }
			{ ! isSelected && required && ! requiredDefault && (
				<span className="required">{ __( 'Required', 'getwid' ) }</span>
			) }
			{ requiredDefault && (
				<span className="required">{ __( 'Required', 'getwid' ) }</span>
			) }
		</div>
	);
}
