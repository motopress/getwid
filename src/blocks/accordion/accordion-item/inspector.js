/**
* External dependencies
*/
import { __ } from 'wp.i18n';
// import { renderMediaControl as GetwidMediaControl } from 'GetwidUtils/render-inspector';

/**
* WordPress dependencies
*/
const { Component } = wp.element;
const { InspectorControls } = wp.blockEditor || wp.editor;
const { PanelBody, SelectControl, BaseControl, Button } = wp.components;

/**
* Create an Component
*/
class Inspector extends Component {
	constructor() {
		super(...arguments);
	}

	render() {
		// const { id, url, cardPosition, imageSize } = this.props.attributes;
		const { setAttributes, /* imgObj, onSelectImage, */ clientId, getBlock } = this.props;

		if ( ! getBlock( clientId ) ) {
			return (
				<InspectorControls></InspectorControls>
			);
		}

		return (
			<InspectorControls>
				<PanelBody title={__( 'Settings', 'getwid' )} initialOpen={true}>

				</PanelBody>
			</InspectorControls>
		);
	}
}

export default Inspector;