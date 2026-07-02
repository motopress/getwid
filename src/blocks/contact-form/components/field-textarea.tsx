import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextareaControl, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import FieldLabel from './field-label';
import type { FieldAttributes } from '../types';

type FieldTextareaProps = FieldAttributes & {
	className?: string;
	setAttributes: ( attributes: Partial< FieldAttributes > ) => void;
	label: string;
	isSelected: boolean;
};

export default function FieldTextarea( {
	className,
	required,
	label,
	setAttributes,
	isSelected,
	placeholder,
	id,
}: FieldTextareaProps ) {
	return (
		<>
			<div className={ className }>
				<TextareaControl
					label={
						<FieldLabel
							required={ required }
							label={ label }
							setAttributes={ setAttributes }
							isSelected={ isSelected }
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
				<PanelBody title={ __( 'Field Settings', 'getwid' ) }>
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
