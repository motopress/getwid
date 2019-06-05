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
const { TextControl, TextareaControl, PanelBody } = wp.components;

const GetwidFieldTextarea = ( { className, required, label, setAttributes, isSelected, placeholder, id } ) => {
	return (
		<Fragment>
			<div className={`${className}`}>
				<TextareaControl
					label={
						<GetwidFieldLabel
							required={ required }
							label={ label }
							setAttributes={ setAttributes }
							isSelected={ isSelected }
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
						onChange={ value => setAttributes( { id: value } ) }
					/>
				</PanelBody>
			</InspectorControls>
		</Fragment>
	);
}

export default GetwidFieldTextarea;