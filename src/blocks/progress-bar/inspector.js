
const {__} = wp.i18n;
const {Component, Fragment} = wp.element;

const {
    InspectorControls,
    PanelColorSettings,
} = wp.editor;

const {
	RangeControl,
} = wp.components;

class Inspector extends Component {
	constructor() {
		super(...arguments);
	}

	render() {
		const {
			attributes: {
                fillAmount
			},
			setAttributes,
			
			backgroundColor,
			setBackgroundColor,

			setTextColor,
			textColor
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
					value={ fillAmount !== undefined ? fillAmount : '' }
					onChange={fillAmount => {
						setAttributes({ fillAmount: fillAmount });
                    }}
                    allowReset
					min={0}
					max={100}
					step={1}
				/>
			</InspectorControls>
		);
	}	
}

export default Inspector;