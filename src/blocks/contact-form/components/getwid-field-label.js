/**
* External dependencies
*/
import { __ } from 'wp.i18n';

/**
* WordPress dependencies
*/
const { PlainText } = wp.editor;
const { ToggleControl } = wp.components;

const className = 'getwid-field-label';

const GetwidFieldLabel = ( { setAttributes, label, isSelected, required } ) => {
	return (
		<div className={`${className}`}>
			<PlainText
				value={ label }
				className={`${className}__input`}
				onChange={ value => {
					setAttributes( { label: value } );
				} }
				placeholder={ __( 'Write label…', 'jetpack' ) }
			/>
			{ isSelected && (
				<ToggleControl
					label={__('Required', 'getwid')}
					className={`${className}__required`}
					checked={ required }
					onChange={ value => {
						setAttributes( { required: value } );
					} }
				/>
			) }
			{ ! isSelected && required && (
				<span className='required'>{ __( '(required)', 'getwid' ) }</span>
			) }
		</div>
	);
};

export default GetwidFieldLabel;