import { __ } from 'wp.i18n';

const { Component } = wp.element;

const {
	InspectorControls,
	PanelColorSettings,
} = wp.editor;

const {
	RangeControl,
	CheckboxControl
} = wp.components;

class Inspector extends Component {
	constructor() {
		super(...arguments);
	}

	render() {
		const {
			attributes: {
				fillAmount,
				isAnimated,
				size,
				thickness,
			},
			setAttributes,

			backgroundColor,
			setBackgroundColor,

			setTextColor,
			textColor,

		} = this.props;

		return (
			<InspectorControls>
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
							label: __('Content Color', 'getwid')
						}
					]}
					initialOpen={true}
				/>
				<RangeControl
					label={__('Fill Amount', 'getwid')}
					value={ fillAmount }
					onChange={ fillAmount => {
						setAttributes({ fillAmount })
					}}
					initialPosition={ fillAmount }
					min={0}
					max={100}
					step={1}
				/>
				<RangeControl
					label={__('Size', 'getwid')}
					value={ size }
					onChange={ size => {
						setAttributes({ size })
					}}
					initialPosition={ size }
					min={50}
					max={600}
					step={1}
				/>
				<RangeControl
					label={__('Thickness', 'getwid')}
					value={isNaN(thickness) ? (size/14).toFixed() : parseFloat(thickness)}
					onChange={ value => {
						setAttributes({ thickness: value.toString() })
					}}
					initialPosition={thickness}
					min={1}
					max={100}
					step={1}
				/>
				<CheckboxControl
					label={__('Animation', 'getwid')}
					checked={ isAnimated === 'true' ? true : false }
					onChange={ value => {
						setAttributes({ isAnimated: value ? 'true' : 'false' })
					}}
				/>
			</InspectorControls>
		);
	}
}

export default Inspector;