/**
 * Getwid Icon Picker
 * https://fonticonpicker.github.io/react-fonticonpicker/props/
 */

import FontIconPicker from 'GetwidVendor/fonticonpicker/react-fonticonpicker';
import './index.scss';

const { iconList } = GetwidComponentsData.settings;

export interface IconPickerProps {
	value?: string;
	onChange?: ( value: string ) => void;
}

export default function IconPicker( props: IconPickerProps ) {
	return (
		<FontIconPicker
			icons={ iconList ? iconList : [] }
			theme="getwid"
			iconsPerPage={ 12 }
			{ ...props }
		/>
	);
}
