/**
* External dependencies
*/
import { __ } from 'wp.i18n';

/**
* WordPress dependencies
*/
const {
	PanelBody,
	TextControl,
	BaseControl,
	ToggleControl

} = wp.components;

const {
	InspectorControls,
	PanelColorSettings
} = wp.editor;

const {
	Component
} = wp.element;

/**
* Create an Component
*/
class Inspector extends Component {
	constructor() {
		super(...arguments);
	}

	render() {
		const {
			attributes: {
				to,
				subject
			},
			setAttributes,

			backgroundColor,
			setBackgroundColor,

			setTextColor,
			textColor

		} = this.props;

		return (
			<InspectorControls>
				<PanelBody title={__('Settings', 'getwid')} initialOpen={true}>
					<TextControl
						label={__('Email', 'getwid')}
						value={to}
						onChange={to => {
							setAttributes({ to })
						}}
					/>
					<TextControl
						label={__('Subject', 'getwid')}
						value={subject}
						onChange={subject => {
							setAttributes({ subject })
						}}
					/>
					<PanelColorSettings
						title={__('Color Settings', 'getwid')}
						colorSettings={[
							{
								value: textColor.color,
								onChange: setTextColor,
								label: __('Text Color', 'getwid')
							},
							{
								value: backgroundColor.color,
								onChange: setBackgroundColor,
								label: __('Background Color', 'getwid')
							}
						]}
					/>
				</PanelBody>
			</InspectorControls>
		);
	}
}

export default Inspector;