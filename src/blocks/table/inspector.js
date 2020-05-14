/**
 * External dependencies
 */
import { __ } from 'wp.i18n';

/**
* WordPress dependencies
*/
const { Component } = wp.element;
const { InspectorControls } = wp.blockEditor || wp.editor;

/**
* Create an Component
*/
class Inspector extends Component {
	constructor() {
		super(...arguments);
	}

	render() {
		return (
			<InspectorControls>
				<div></div>
			</InspectorControls>
		);
	}
}

export default Inspector;