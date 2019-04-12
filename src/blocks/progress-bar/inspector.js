
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;

const {
	InspectorControls,
	PanelColorSettings,
} = wp.editor;

const {
	RangeControl,
	CheckboxControl,
	SelectControl
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
				typeBar
			},
			setAttributes,

			backgroundColor,
			setBackgroundColor,

			setTextColor,
			textColor,
			
		} = this.props;

		return (
			<InspectorControls>
				<SelectControl
					label={__('Type bar', 'getwid')}
					value={typeBar === undefined ? 'default' : typeBar}
					onChange={typeBar => setAttributes({ typeBar })}
					options={[
						{ value: 'default', label: __('Default', 'getwid') },
						{ value: 'circle', label: __('Circle', 'getwid') },
					]}
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