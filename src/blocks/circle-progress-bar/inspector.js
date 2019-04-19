const { Component } = wp.element;

const {
	InspectorControls,
	PanelColorSettings,
} = wp.editor;

const {
	RangeControl,
	TextControl,
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

				/* #region new attributes */
				size,
				thickness,
				/* #endregion */
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
					value={fillAmount ? fillAmount : ''}
					onChange={ fillAmount => {
						setAttributes({ fillAmount })
					}}
					initialPosition={fillAmount}
					min={0}
					max={100}
					step={1}
				/>

				{/* #region new controlls */}
				<RangeControl
					label={__('Size', 'getwid')}
					value={size ? size : ''}
					onChange={ size => {
						setAttributes({ size })
					}}
					initialPosition={size}
					min={50}
					max={200}
					step={1}
				/>
				<TextControl
					type={'number'}
					label={__('Thickness', 'getwid')}
					value={isNaN(thickness) ? 0 : parseFloat(thickness)}
					onChange={ value => {
						setAttributes({ thickness: value.toString() })
					}}
				/>
				{/* #endregion */}

				<CheckboxControl
					label='Animation'
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