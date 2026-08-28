import { SelectControl, TextControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import './editor.scss';

type Unit = {
	label: string;
	value: string;
};

type StyleLengthControlProps = {
	allowAuto?: boolean;
	allowNegative?: boolean;
	units?: Unit[];
	value?: string;
	label?: string;
	onChange: ( value?: string ) => void;
	isLocked?: boolean;
};

const defaultUnits: Unit[] = [
	{ label: 'px', value: 'px' },
	{ label: 'em', value: 'em' },
	{ label: '%', value: '%' },
	{ label: 'vh', value: 'vh' },
	{ label: 'vw', value: 'vw' },
];

function parseLength(
	value: string | undefined,
	units: Unit[],
	allowNegative: boolean
) {
	if ( value === undefined ) {
		return {
			lengthValue: '',
			unitValue: units[ 0 ]?.value ?? 'px',
		};
	}

	const unitList = units.map( ( unit ) => unit.value ).join( '|' );
	const signPart = allowNegative ? '[-]?' : '';
	const regexp = new RegExp(
		`^(${ signPart }[0-9]*\\.?[0-9]*)(${ unitList }){0,1}$`
	);
	const parsedValue = regexp.exec( value );

	return {
		lengthValue: parsedValue?.[ 1 ] ?? '',
		unitValue: parsedValue?.[ 2 ] ?? units[ 0 ]?.value ?? 'px',
	};
}

export default function StyleLengthControl( {
	allowAuto = false,
	allowNegative = false,
	units = defaultUnits,
	value,
	label,
	onChange,
	isLocked = false,
}: StyleLengthControlProps ) {
	const controlUnits = allowAuto
		? [ ...units, { value: 'auto', label: __( 'Auto', 'getwid' ) } ]
		: units;
	const parsed =
		allowAuto && value === 'auto'
			? { lengthValue: '', unitValue: 'auto' }
			: parseLength( value, controlUnits, allowNegative );
	const controlClassPrefix =
		'components-base-control components-getwid-style-length-control';

	function changeValue( nextValue: string, type: 'unit' | 'length' ) {
		const unitValue = type === 'unit' ? nextValue : parsed.unitValue;
		const lengthValue = type === 'length' ? nextValue : parsed.lengthValue;

		if ( unitValue === 'auto' ) {
			onChange( allowAuto ? 'auto' : '' );
			return;
		}

		onChange(
			lengthValue !== '' ? `${ lengthValue }${ unitValue }` : undefined
		);
	}

	return (
		<div className={ controlClassPrefix }>
			<TextControl
				className={ `${ controlClassPrefix }__value_input` }
				name="length"
				type="number"
				label={ label }
				value={ parsed.lengthValue }
				onChange={ ( nextLengthValue ) =>
					changeValue( nextLengthValue, 'length' )
				}
				min={ allowNegative ? undefined : 0 }
				disabled={ isLocked || parsed.unitValue === 'auto' }
			/>
			<SelectControl
				className={ `${ controlClassPrefix }__unit_select` }
				name="unit"
				options={ controlUnits }
				value={ parsed.unitValue }
				onChange={ ( nextUnitValue ) =>
					changeValue( nextUnitValue, 'unit' )
				}
				disabled={ isLocked }
			/>
		</div>
	);
}
