/**
* External dependencies
*/
import { __ } from 'wp.i18n';

/**
 * Internal dependencies
 */
import GetwidFieldLabel from './getwid-field-label';

/**
* WordPress dependencies
*/
const { Fragment } = wp.element;
const { InspectorControls } = wp.editor;
const { TextControl, PanelBody } = wp.components;

const GetwidField = ( { type, className, setAttributes, label, isSelected, required, placeholder, id } ) => {
	return (
		<Fragment>
			<div className={`${className}`}>
				<TextControl
					type={ type }
					label={
						<GetwidFieldLabel
							label={ label }
							required={ required }
							isSelected={ isSelected }
							setAttributes={ setAttributes }
						/>
					}
					value={ placeholder }
					onChange={ value => {
						setAttributes( { placeholder: value } );
					} }
					title={ __( 'Set the placeholder text', 'getwid' ) }
				/>
			</div>
			<InspectorControls>
				<PanelBody title={ __( 'Field Settings', 'getwid' ) }>
					<TextControl
						label={ __( 'ID', 'getwid' ) }
						value={ id }
						onChange={ value => {
							setAttributes( { id: value } );
						} }
					/>
				</PanelBody>
			</InspectorControls>
		</Fragment>
	);
}

export default GetwidField;