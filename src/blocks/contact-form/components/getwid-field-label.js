/**
* External dependencies
*/
import { __ } from 'wp.i18n';

const { PlainText } = wp.editor;
const { ToggleControl } = wp.components;

/**
* Module Constants
*/
const className = 'getwid-field-label';

/**
* Create an Component
*/
const GetwidFieldLabel = ( { setAttributes, label, isSelected, required, requiredDefault } ) => {
	return (
		<div className={ `${className}` }>
			<PlainText
				value={ label }
				className={ `${className}__input` }
				onChange={ label =>
					setAttributes( { label } )
				}
				placeholder={ __( 'Write label…', 'getwid' ) }
			/>
			{ isSelected && ! requiredDefault && (
				<ToggleControl
					label={ __( 'Required', 'getwid' ) }
					className={ `${className}__required` }
					checked={ required }
					onChange={ required =>
						setAttributes( { required } )
					}
				/>
			) }
			{ ! isSelected && required && ! requiredDefault && (
				<span className='required'>{ __( 'Required', 'getwid' ) }</span>
			) }
			{ requiredDefault && (
				<span className='required'>{ __( 'Required', 'getwid' ) }</span>
			) }
		</div>
	);
};

export default GetwidFieldLabel;