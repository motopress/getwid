/**
 * External dependencies
 */
import {map, isEmpty} from 'lodash';
import './editor.scss';

/**
 * WordPress dependencies
 */
import { __ } from 'wp.i18n';
const { withInstanceId } = wp.compose;
const {
	BaseControl
} = wp.components;


function GetwidSelectControl( {
	help,
	instanceId,
	label,
	multiple = false,
	groups = false,
	onChange,
	options = [],
	className,
	...props
} ) {
	const id = `inspector-select-control-${ instanceId }`;
	const onChangeValue = ( event ) => {
		if ( multiple ) {
			const selectedOptions = [ ...event.target.options ].filter( ( { selected } ) => selected );
			const newValues = selectedOptions.map( ( { value } ) => value );
			onChange( newValues );
			return;
		}
		onChange( event.target.value );
	};
	return ! isEmpty( options ) && (
		<BaseControl label={ label } id={ id } help={ help } className={ className }>
			<select
				id={ id }
				className="components-select-control__input"
				onChange={ onChangeValue }
				aria-describedby={ !! help ? `${ id }__help` : undefined }
				multiple={ multiple }
				{ ...props }
			>
				{ options.map( ( option, index ) =>
					<option
						key={ `${ option.label }-${ option.value }-${ index }` }
						value={ option.value }
					>
						{ option.label }
					</option>
				) }
			</select>
		</BaseControl>
	);
}

export default withInstanceId( GetwidSelectControl );