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
const GetwidFieldLabel = ( { setAttributes, label, isSelected, required } ) => {
	return (
		<div className={ `${className}` }>
			<PlainText
				value={ label }
				className={ `${className}__input` }
				onChange={ label =>
					setAttributes( { label } )
				}
				placeholder={ __( 'Write label…', 'jetpack' ) }
			/>
			{ isSelected && (
				<ToggleControl
					label={ __( 'Required', 'getwid' ) }
					className={ `${className}__required` }
					checked={ required }
					onChange={ required =>
						setAttributes( { required } )
					}
				/>
			) }
			{ ! isSelected && required && (
				<span className='required'>{ __( '(required)', 'getwid' ) }</span>
			) }
		</div>
	);
};

export default GetwidFieldLabel;