/**
* External dependencies
*/
import GetwidIconPicker from 'GetwidControls/icon-picker';

import GetwidAnimationSelectControl from 'GetwidControls/animation-select-control';
import GetwidCustomTabsControl      from 'GetwidControls/custom-tabs-control';
import GetwidCustomColorPalette     from 'GetwidControls/custom-color-palette';

import { renderMediaControl as GetwidMediaControl } from 'GetwidUtils/render-inspector';
import { renderPointSettingsPanel } from 'GetwidUtils/render-inspector';

import { escape, unescape} from 'lodash';

/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';

const { Component, Fragment } = wp.element;
const { InspectorControls } = wp.blockEditor || wp.editor;
const { PanelBody, BaseControl, RangeControl, SelectControl, TextareaControl, ToggleControl, TextControl, Button, Modal, ButtonGroup, RadioControl, Dashicon, TabPanel } = wp.components;
const { withSelect } = wp.data;
const { compose } = wp.compose;

/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-image-hotspot';

/**
* Create an Inspector Controls
*/
class Inspector extends Component {

	constructor() {
		super(...arguments);

	}

	render() {
 		return null;
	}
}

export default compose( [
	withSelect( ( select, props ) => {
		const { getEditorSettings } = select( 'core/editor' );
		return {
			getEditorSettings
		};
	} )
] )( Inspector );
