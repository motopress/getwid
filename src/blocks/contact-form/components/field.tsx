import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import FieldLabel from './field-label';
import type { FieldAttributes } from '../types';

type FieldProps = FieldAttributes & {
	type: 'text' | 'email';
	className?: string;
	setAttributes: ( attributes: Partial< FieldAttributes > ) => void;
	label: string;
	isSelected: boolean;
	requiredDefault?: boolean;
};

export default function Field( {
	type,
	className,
	setAttributes,
	label,
	isSelected,
	required,
	requiredDefault,
	placeholder,
	id,
}: FieldProps ) {
	return (
		<>
			<div className={ className }>
				<TextControl
					type={ type }
					label={
						<FieldLabel
							label={ label }
							required={ required }
							isSelected={ isSelected }
							setAttributes={ setAttributes }
							requiredDefault={ requiredDefault }
						/>
					}
					value={ placeholder }
					onChange={ ( nextPlaceholder ) =>
						setAttributes( { placeholder: nextPlaceholder } )
					}
					title={ __( 'Set the placeholder text', 'getwid' ) }
					__nextHasNoMarginBottom
				/>
			</div>
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'getwid' ) }>
					<TextControl
						label={ __( 'ID', 'getwid' ) }
						value={ id }
						onChange={ ( nextId ) =>
							setAttributes( { id: nextId } )
						}
						__nextHasNoMarginBottom
					/>
				</PanelBody>
			</InspectorControls>
		</>
	);
}
