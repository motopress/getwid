/**
* External dependencies
*/
import { __ } from 'wp.i18n';

const { Component } = wp.element;
const { InspectorControls, PanelColorSettings } = wp.editor;
const { CheckboxControl, TextControl, PanelBody, SelectControl } = wp.components;

class Inspector extends Component {
	constructor() {
		super(...arguments);
	}

	render() {

		return (
			<InspectorControls></InspectorControls>
		);
	}	
}

export default Inspector;