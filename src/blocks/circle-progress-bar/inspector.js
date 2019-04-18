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
				diameter,
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
					label={__('Value', 'getwid')}
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
				<TextControl
					type={'number'}
					label={__('Diameter', 'getwid')}
					value={ isNaN(diameter) ? 0 : parseFloat(diameter) }
					onChange={ value => {
						setAttributes({ diameter: value.toString() })
					}}
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