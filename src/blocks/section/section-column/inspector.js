/**
* External dependencies
*/
import { __ } from 'wp.i18n';

const { Component } = wp.element;
const { PanelBody } = wp.components;
const { InspectorControls } = wp.editor;

class Inspector extends Component {
	constructor() {
		super(...arguments);
	}

	render() {
		return (
			<InspectorControls>
				<PanelBody title={__( 'Settings', 'getwid' )} initialOpen={true}>
					<div>Test</div>
				</PanelBody>
			</InspectorControls>
		);
	}	
}

export default Inspector;