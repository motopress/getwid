const { Component } = wp.element;

const {
	InspectorControls,
	PanelColorSettings,
} = wp.editor;

const {
	RangeControl,
	CheckboxControl,
} = wp.components;

class Inspector extends Component {
	constructor() {
		super(...arguments);
	}

	render() {
		const {
			attributes: {
				fillAmount,
				isAnimated
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
					label={__('Range', 'getwid')}
					value={fillAmount !== undefined ? fillAmount : ''}
					onChange={fillAmount => {
						setAttributes({ fillAmount: fillAmount });
					}}
					initialPosition={fillAmount}
					min={0}
					max={100}
					step={1}
				/>
				<CheckboxControl
					label="Animation"
					checked={(isAnimated === 'true' ? true : false)}
					onChange={(__isAnimated) => {
						setAttributes({ isAnimated: __isAnimated ? 'true' : 'false' })
					}}
				/>
			</InspectorControls>
		);
	}
}

export default Inspector;