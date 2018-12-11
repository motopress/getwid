/**
 * Getwid Icon Picker
  https://fonticonpicker.github.io/react-fonticonpicker/props/
 */

import FontIconPicker from '@fonticonpicker/react-fonticonpicker';
import './editor.scss';

const { iconList } = Getwid.settings;

console.log(Getwid);

export default class GetwidIconPicker extends FontIconPicker {
}

GetwidIconPicker.defaultProps = {
	...GetwidIconPicker.defaultProps,
	icons: iconList
};