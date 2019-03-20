import {times} from 'lodash';
// Setup the block
const {__} = wp.i18n;
const {Component} = wp.element;

const {
	InspectorControls,
} = wp.editor;

const {
	PanelBody,
	SelectControl,
	RadioControl
} = wp.components;

/**
 * Create an Inspector Controls wrapper Component
 */
export default class Inspector extends Component {

	render() {

		const {
			attributes: {
			},
			setAttributes
		} = this.props;

		// options={times(items.length, (n) => ({value: n, label: n + 1}) )}
		return (
			<InspectorControls>
				<PanelBody
					title={__('Settings', 'getwid')}
				>
					<span>Test</span>
				</PanelBody>
			</InspectorControls>
		);
	}

}