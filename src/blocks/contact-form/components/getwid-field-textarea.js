/**
 * Internal dependencies
 */
import GetwidFieldLabel from './getwid-field-label';

/**
* External dependencies
*/
import { __ } from 'wp.i18n';

const { Fragment } = wp.element;
const { InspectorControls } = wp.editor;
const { TextControl, TextareaControl, PanelBody } = wp.components;

/**
* Create an Component
*/
const GetwidFieldTextarea = ( { className, required, label, setAttributes, isSelected, placeholder, id } ) => {
	return (
		<Fragment>
			<div className={ `${className}` }>
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
					onChange={ placeholder =>
						setAttributes( { placeholder } )
					}
					title={ __( 'Set the placeholder text', 'getwid' ) }
				/>
			</div>
			<InspectorControls>
				<PanelBody title={ __( 'Field Settings', 'getwid' ) }>
					<TextControl
						label={ __( 'ID', 'getwid' ) }
						value={ id }
						onChange={ id => setAttributes( { id } ) }
					/>
				</PanelBody>
			</InspectorControls>
		</Fragment>
	);
}

export default GetwidFieldTextarea;