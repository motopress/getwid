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
const { SelectControl, PanelBody } = wp.components;
const { InspectorControls } = wp.blockEditor || wp.editor;

/**
* Create an Inspector
*/
class Inspector extends Component {
	constructor() {
		super(...arguments);
	}

	render() {

		const { headerTag } = this.props.attributes;
		const { setAttributes, backgroundColor, textColor, customBackgroundColor, customTextColor, setBackgroundColor, setTextColor } = this.props;

		return (
			<InspectorControls>
				<PanelBody title={__('Settings', 'getwid')} initialOpen={true}>
					<SelectControl
						label={__('Title Tag', 'getwid')}
						value={headerTag}
						options={[
							{ value: 'p' , label: __( 'Paragraph', 'getwid' ) },
							{ value: 'h2', label: __( 'Heading 2', 'getwid' ) },
							{ value: 'h3', label: __( 'Heading 3', 'getwid' ) },
							{ value: 'h4', label: __( 'Heading 4', 'getwid' ) },
							{ value: 'h5', label: __( 'Heading 5', 'getwid' ) },
							{ value: 'h6', label: __( 'Heading 6', 'getwid' ) }
						]}
						onChange={headerTag =>
							setAttributes({ headerTag })
						}
					/>
					<GetwidCustomColorPalette
						colorSettings={[{
								title: __( 'Text Color', 'getwid' ),
								colors: {
									customColor: customTextColor,
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