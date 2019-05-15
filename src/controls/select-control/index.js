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
const { Component, Fragment } = wp.element;


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

	// debugger;

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

	const renderSelectOptions = () => {
		// debugger;
		if (groups){
			// debugger;

		/* 	Object.keys(options).forEach((key)=>{

				debugger;

			});

			map() */


			return (
				<Fragment>
					{ map(options, ( option, index ) => {
						// debugger;

						// debugger;
				/* 		return (
							<Fragment>
							{ */
								// map(option, ( group, index ) => {
									// debugger;
									return (
										<Fragment>
											<optgroup label={`${option.group_name}`}>
												{map(option.group_value, (group_item, inner_index) => {

														// debugger;

													return (
														<option
															key={ `${ group_item.label }-${ group_item.value }-${ index }` }
															value={ group_item.value }
														>
															{ group_item.label }
														</option>	
													);



												})}
											</optgroup>	
										</Fragment>						
									);
								// })
				/* 			}

							</Fragment>	
						);
						 */




						// for (var group in option) {
							// debugger;
							
						
						// } //for in

					}
					) }
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
		<BaseControl label={ label } id={ id } help={ help } className={ className }>
			<select
				id={ id }
				className="components-select-control__input"
				onChange={ onChangeValue }
				aria-describedby={ !! help ? `${ id }__help` : undefined }
				multiple={ multiple }
				size={size}
				{ ...props }
			>
				{renderSelectOptions()}		
			</select>
		</BaseControl>
	);
}

export default withInstanceId( GetwidSelectControl );