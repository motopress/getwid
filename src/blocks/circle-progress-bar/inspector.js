/**
* External dependencies
*/
import { __ } from 'wp.i18n';

/**
* Internal dependencies
*/
import GetwidCustomColorPalette from 'GetwidControls/custom-color-palette';

/**
* WordPress dependencies
*/
const { Component } = wp.element;
const { InspectorControls } = wp.blockEditor || wp.editor;
const { RangeControl, CheckboxControl, PanelBody } = wp.components;

/**
* Create an Inspector Controls
*/
class Inspector extends Component {
	constructor() {
		super(...arguments);
	}

	render() {
	
		const { setAttributes } = this.props;
		const { fillAmount, isAnimated, size, thickness, backgroundColor, textColor } = this.props.attributes;

		return (
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'getwid' ) } initialOpen={true}>
					<RangeControl
						label={__( 'Value', 'getwid' )}
						value={fillAmount}
						onChange={fillAmount => setAttributes({ fillAmount })}
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
					<GetwidCustomColorPalette
						colorSettings={[{
								title: __( 'Background Color', 'getwid' ),
								colors: {
									customColor: backgroundColor
								},
								changeColor: value => setAttributes({
									backgroundColor: value
								})
							}, {
								title: __( 'Bar Color', 'getwid' ),
								colors: {
									customColor: textColor
								},
								changeColor: value => setAttributes({
									textColor: value
								})
							}
						]}
					/>
				</PanelBody>
			</InspectorControls>
		);
	}
}

export default Inspector;