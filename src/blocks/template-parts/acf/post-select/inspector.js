/**
 * WordPress dependencies
 */
import { __ } from 'wp.i18n';
const { jQuery: $ } = window;
const {
	Component,
} = wp.element;
const {
	InspectorControls,
} = wp.blockEditor || wp.editor;
const {
	PanelBody,
	TextControl,
} = wp.components;

/**
 * Create an Inspector Controls
 */
export default class Inspector extends Component {

	constructor() {
		super(...arguments);
	}

	render() {
		const {
			attributes: {
				customField,
				separator,
			},

			setAttributes,
		} = this.props;

		return (
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'getwid' ) }>
					<TextControl
						label={ __( 'Field Name', 'getwid' ) }
						value={ customField }
						onChange={ customField => setAttributes({customField}) }
					/>
					<TextControl
						label={ __( 'Separator', 'getwid' ) }
						value={ separator }
						value={ separator !== undefined ? separator : ',' }
						onChange={ separator => setAttributes({separator}) }
					/>
				</PanelBody>
			</InspectorControls>
		);
	}
}
