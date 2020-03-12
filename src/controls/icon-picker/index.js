/**
 * Getwid Icon Picker
  https://fonticonpicker.github.io/react-fonticonpicker/props/
 */

import FontIconPicker from 'GetwidVendor/fonticonpicker/react-fonticonpicker';
import './editor.scss';

const { iconList } = Getwid.settings;

export default class GetwidIconPicker extends FontIconPicker {
}

GetwidIconPicker.defaultProps = {
	...GetwidIconPicker.defaultProps,
	icons: (iconList ? iconList : []),
	theme: "getwid",
	iconsPerPage: 15
};
