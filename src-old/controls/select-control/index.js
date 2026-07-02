/**
 * External dependencies
 */
import {map, isEmpty} from 'lodash';
import './editor.scss';

/**
 * WordPress dependencies
 */
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
const { withInstanceId } = wp.compose;
const {
	SelectControl
} = wp.components;
const { Fragment } = wp.element;

function GetwidSelectControl( {
	help,
	instanceId,
	label,
	multiple = false,
	groups = false,
	size = 4,
	onChange,
	options = [],
	className,
	...props
} ) {

	const renderSelectOptions = () => {
		if (groups){

			return (
				<Fragment>
					{ map( options, ( option, index ) => {
						return (
							<optgroup
								key={ index }
								label={ `${option.group_name}` }
							>
								{ map( option.group_value, ( group_item, inner_index ) => {
									return (
										<option
											key={ `${ group_item.label }-${ group_item.value }-${ inner_index }` }
											value={ group_item.value }
										>
											{ group_item.label }
										</option>
									);
								} ) }
							</optgroup>
						);
					} ) }
				</Fragment>
			);

		} else {
			return (
				<Fragment>
					{ options.map( ( option, index ) =>
						<option
							key={ `${ option.label }-${ option.value }-${ index }` }
							value={ option.value }
						>
							{ option.label }
						</option>
					) }
				</Fragment>
			);
		}
	};

	return ! isEmpty( options ) && (
		<SelectControl
			label={ label }
			help={ help }
			className={ className }
			onChange={ onChange }
			multiple={ multiple }
			size={ size }
			{ ...props }
		>
			{ renderSelectOptions() }
		</SelectControl>
	);
}

export default withInstanceId( GetwidSelectControl );