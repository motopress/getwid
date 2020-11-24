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
* Create an Component
*/
class Inspector extends Component {

	constructor() {
		super(...arguments);
	}

	render() {
		const { setTextColor, textColor } = this.props;
		const { fillAmount, isAnimated } = this.props.attributes;
		const { setAttributes, backgroundColor, setBackgroundColor, customBackgroundColor, customTextColor } = this.props;

		return (
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'getwid' ) } initialOpen={ true }>
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
					<CheckboxControl
						label="Animate"
						checked={(isAnimated === 'true' ? true : false)}
						onChange={value => {
							setAttributes({ isAnimated: value ? 'true' : 'false' })
						}}
					/>
					<GetwidCustomColorPalette
						colorSettings={[{
								title: __( 'Progress Color', 'getwid' ),
								colors: {
									customColor : customTextColor,
									defaultColor: textColor
								},
								changeColor: setTextColor
							}, {
								title: __( 'Background Color', 'getwid' ),
								colors: {
									customColor: customBackgroundColor,
									defaultColor: backgroundColor
								},
								changeColor: setBackgroundColor
							}
						]}
					/>
				</PanelBody>
			</InspectorControls>
		);
	}
}

export default Inspector;