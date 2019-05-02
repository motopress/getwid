import { __ } from 'wp.i18n';

const { Component } = wp.element;

const {
	InspectorControls,
	PanelColorSettings

} = wp.editor;

const {
	PanelBody,
	TextControl

} = wp.components;

class Inspector extends Component {
	constructor() {
		super(...arguments);
	}

	render() {
		const {
			attributes: {
				email,
				subject
			},
			setAttributes,

			backgroundColor,
			setBackgroundColor,
			
			textColor,
			setTextColor,

		} = this.props;

		return (
			<InspectorControls>
				<PanelBody title={__('Settings', 'getwid')} initialOpen={true}>
					<TextControl
						label={__('Email', 'getwid')}
						value={ email }
						onChange={email => {
							setAttributes({ email })
						}}
					/>
					<TextControl
						label={__('Subject', 'getwid')}
						value={ subject }
						onChange={subject => {
							setAttributes({ subject })
						}}
					/>

					<PanelColorSettings
						title={__('Colors', 'getwid')}
						colorSettings={[
							{
								value: backgroundColor.color,
								onChange: setBackgroundColor,
								label: __('Background Color', 'getwid')
							},
							{
								value: textColor.color,
								onChange: setTextColor,
								label: __('Text Color', 'getwid')
							}
						]}
					/>
				</PanelBody>
			</InspectorControls>
		);
	}
}

export default Inspector;