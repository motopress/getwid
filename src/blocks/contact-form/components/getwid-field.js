/**
 * Internal dependencies
 */
import GetwidFieldLabel from './getwid-field-label';

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;

const { Fragment } = wp.element;
const { InspectorControls } = wp.blockEditor || wp.editor;
const { TextControl, PanelBody } = wp.components;

/**
* Create an Component
*/
const GetwidField = ( { type, className, setAttributes, label, isSelected, required, requiredDefault, placeholder, id } ) => {
	return (
		<Fragment>
			<div className={ `${className}` }>
				<TextControl
					type={ type }
					label={
						<GetwidFieldLabel
							label={ label }
							required={ required }
							isSelected={ isSelected }
							setAttributes={ setAttributes }
							requiredDefault={ requiredDefault }
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
				<PanelBody title={ __( 'Settings', 'getwid' ) }>
					<TextControl
						label={ __( 'ID', 'getwid' ) }
						value={ id }
						onChange={ id => 
							setAttributes( { id } )
						}
					/>
				</PanelBody>
			</InspectorControls>
		</Fragment>
	);
}

export default GetwidField;