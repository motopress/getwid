import { __ } from 'wp.i18n';
const {jQuery: $} = window;

const { Component } = wp.element;

const {
	InspectorControls,
	PanelColorSettings,
} = wp.blockEditor || wp.editor;

const {
	RangeControl,
	CheckboxControl,
	PanelBody
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
				
				backgroundColor,
				textColor,
			},
			setAttributes,
		} = this.props;

		return (
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'getwid' ) } initialOpen={true}>
					<RangeControl
						label={__('Value', 'getwid')}
						value={fillAmount}
						onChange={fillAmount => {
							setAttributes({ fillAmount })
						}}
						initialPosition={fillAmount}
						min={0}
						max={100}
						step={1}
					/>
					<RangeControl
						label={__('Size', 'getwid')}
						value={size}
						onChange={value => {
							(thickness > (size / 2)) ? setAttributes({ size: value, thickness: Math.floor(value / 2) }) : setAttributes({ size: value })
						}}
						initialPosition={size}
						min={50}
						max={600}
						step={1}
					/>
					<RangeControl
						label={__('Thickness', 'getwid')}
						value={isNaN(thickness) ? (size / 14).toFixed() : parseFloat(thickness)}
						onChange={value => {
							setAttributes({ thickness: value.toString() })
						}}
						initialPosition={thickness}
						min={1}
						max={Math.floor(size/2)}
						step={1}
					/>
					<CheckboxControl
						label={__('Animate', 'getwid')}
						checked={isAnimated === 'true' ? true : false}
						onChange={value => {
							setAttributes({ isAnimated: value ? 'true' : 'false' })
						}}
					/>

					<PanelColorSettings
						title={__('Colors', 'getwid')}
						colorSettings={[
							{
								value: backgroundColor,
								onChange: value => {
									setAttributes({ backgroundColor: value })
								},
								label: __('Background Color', 'getwid')
							},
							{
								value: textColor,
								onChange: value => {
									setAttributes({ textColor: value })
								},
								label: __('Bar Color', 'getwid')
							}
						]}
					/>
				</PanelBody>				
			</InspectorControls>
		);
	}
}

export default Inspector;