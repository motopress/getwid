import { __ } from 'wp.i18n';
const {jQuery: $} = window;

const { Component } = wp.element;
const { SelectControl, PanelBody } = wp.components;

const {
	InspectorControls,
	PanelColorSettings
} = wp.editor;

class Inspector extends Component {
	constructor() {
		super(...arguments);
	}

	render() {
		const {
			attributes: {
				headerTag
			},

			setAttributes,

			backgroundColor,
			textColor,

			setBackgroundColor,
			setTextColor

		} = this.props;

		return (
			<InspectorControls>
				<PanelBody title={__('Settings', 'getwid')} initialOpen={true}>
					<SelectControl
						label={__('Title Tag', 'getwid')}
						value={headerTag}
						options={[
							{ value: 'p', label: __('Paragraph', 'getwid') },
							{ value: 'h2', label: __('Heading 2', 'getwid') },
							{ value: 'h3', label: __('Heading 3', 'getwid') },
							{ value: 'h4', label: __('Heading 4', 'getwid') },
							{ value: 'h5', label: __('Heading 5', 'getwid') },
							{ value: 'h6', label: __('Heading 6', 'getwid') },
						]}
						onChange={headerTag =>
							setAttributes({ headerTag })
						}
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
						initialOpen={true}
					/>
				</PanelBody>
			</InspectorControls>
		);
	}
}

export default Inspector;