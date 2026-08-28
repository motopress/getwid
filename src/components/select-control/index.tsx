import { SelectControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

type SelectOption = {
	value: string;
	label: string;
};

type SelectGroup = {
	group_name: string;
	group_value: SelectOption[];
};

type GetwidSelectControlProps = {
	help?: string;
	label?: string;
	multiple?: boolean;
	groups?: boolean;
	size?: number;
	value?: string | string[];
	onChange: ( value: string | string[] ) => void;
	options?: SelectOption[] | Record< string, SelectGroup >;
	className?: string | string[];
	disabled?: boolean;
};

export default function GetwidSelectControl( {
	help,
	label,
	multiple = false,
	groups = false,
	size = 4,
	onChange,
	options = [],
	className,
	...props
}: GetwidSelectControlProps ) {
	const optionList = Array.isArray( options )
		? options
		: Object.values( options );

	if ( optionList.length < 1 ) {
		return null;
	}

	return (
		<SelectControl
			label={ label }
			help={ help }
			className={ className }
			onChange={ onChange }
			multiple={ multiple }
			size={ size }
			{ ...props }
		>
			{ groups ? (
				<Fragment>
					{ ( optionList as SelectGroup[] ).map(
						( option, index ) => (
							<optgroup key={ index } label={ option.group_name }>
								{ option.group_value.map(
									( groupItem, innerIndex ) => (
										<option
											key={ `${ groupItem.label }-${ groupItem.value }-${ innerIndex }` }
											value={ groupItem.value }
										>
											{ groupItem.label }
										</option>
									)
								) }
							</optgroup>
						)
					) }
				</Fragment>
			) : (
				<Fragment>
					{ ( optionList as SelectOption[] ).map(
						( option, index ) => (
							<option
								key={ `${ option.label }-${ option.value }-${ index }` }
								value={ option.value }
							>
								{ option.label }
							</option>
						)
					) }
				</Fragment>
			) }
		</SelectControl>
	);
}
