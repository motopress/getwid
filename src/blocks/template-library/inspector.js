/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {Component, Fragment} = wp.element;
const {
	InspectorControls,
} = wp.blockEditor || wp.editor;
const {
	PanelBody,
} = wp.components;


/**
* Create an Inspector Controls
*/
class Inspector extends Component {

	constructor() {
		super(...arguments);
	}

	render() {
		const {
		} = this.props;

		return (
			<InspectorControls>
				<PanelBody
					title={__('Settings', 'getwid')}
				>					

				</PanelBody>
			</InspectorControls>
		);
	}
}

export default ( Inspector );