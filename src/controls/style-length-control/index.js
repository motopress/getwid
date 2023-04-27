/**
 * External dependencies
 */
import {map} from 'lodash';
import './editor.scss';

/**
 * WordPress dependencies
 */
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
const {
	TextControl,
	SelectControl,
} = wp.components;

export default function StyleLengthControl({
		allowAuto,
		allowNegative,
		units = [
		   {label: 'px', value: 'px'},
		   {label: 'em', value: 'em'},
		   {label:  '%', value:  '%'},
		   {label: 'vh', value: 'vh'},
		   {label: 'vw', value: 'vw'},
		],
		value,
		label,
		onChange,
		isLocked = false
	}) {

	const controlClassPrefix = 'components-base-control components-getwid-style-length-control';
	var lengthValue = '', unitValue = '';

	function changeValue(value, type) {

		let fullValue = undefined;

		if (type === 'unit') {
			unitValue = value;
		} else {
			lengthValue = value;
		}

		unitValue = unitValue !== undefined ? unitValue : '';
		lengthValue = lengthValue !== undefined ? lengthValue : '';

		if (unitValue === 'auto') {
			fullValue = allowAuto ? value : '';
		} else if (lengthValue !== undefined && lengthValue !== '') {
			fullValue = lengthValue + unitValue;
		}

		return onChange(fullValue);
	}

	if (allowAuto) {
		units.push({value: 'auto', label: __('Auto', 'getwid')});
	}

	if (allowAuto && value === 'auto') {
		lengthValue = '';
		unitValue = 'auto';
	}

	if (value !== undefined) {
		let parsedValue;
		const unitList = map(units, 'value').join('|');
		const signPart = allowNegative ? '[-]?' : '';
		const regexp = new RegExp(`^(${signPart}[0-9]*\\.?[0-9]*)(${unitList}){0,1}$`);
		if (parsedValue = regexp.exec(value)) {
			lengthValue = parsedValue && parsedValue[1] ? parsedValue[1] : '';
			unitValue = parsedValue && parsedValue[2] ? parsedValue[2] : '';
		} else {
			lengthValue = '';
			unitValue = '';
		}
	}

	if (!unitValue) {
		unitValue = units[0].value;
	}

	return (
		<div className={controlClassPrefix}>
			<TextControl
				className={[`${controlClassPrefix}__value_input`]}
				name="length"
				type="number"
				label={label}
				value={lengthValue}
				onChange={lengthValue => changeValue(lengthValue, 'length')}
				min={allowNegative ? undefined : 0}
				disabled={ isLocked || unitValue === 'auto' }
			/>
			<SelectControl
				className={[`${controlClassPrefix}__unit_select`]}
				name="unit"
				options={units}
				value={unitValue}
				onChange={unitValue => changeValue(unitValue, 'unit')}
				disabled={ isLocked ? true : null }
			/>
		</div>
	);
}
