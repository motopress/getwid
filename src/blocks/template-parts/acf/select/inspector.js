/**
 * External dependencies
 */
import GetwidFontSizePicker from 'GetwidControls/font-size-picker';


/**
 * WordPress dependencies
 */
import { __ } from 'wp.i18n';
const {
	Component,
} = wp.element;
const {
	PanelColorSettings,
	InspectorControls,
} = wp.blockEditor || wp.editor;
const {
	PanelBody,
	TextControl,
} = wp.components;

/**
 * Create an Inspector Controls
 */
export default class Inspector extends Component {

	constructor() {
		super(...arguments);
	}

	render() {
		const {
			attributes: {
				customField,
				labelName,
				separator,
				fontSize,
				customFontSize
			},
			textColor,
			setTextColor,
			setAttributes,
		} = this.props;

		return (
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'getwid' ) }>
					<TextControl
						label={ __( 'Field Name', 'getwid' ) }
						value={ customField }
						onChange={ customField => setAttributes({customField}) }
					/>
					<TextControl
						label={ __( 'Label', 'getwid' ) }
						value={ labelName !== undefined ? labelName : '' }
						onChange={ labelName => setAttributes({labelName}) }
					/>
					<TextControl
						label={ __( 'Separator', 'getwid' ) }
						help={ __( 'For multiple values.', 'getwid' ) }
						value={ separator !== undefined ? separator : ',' }
						onChange={ separator => setAttributes({separator}) }
					/>
					<GetwidFontSizePicker
						fontSizeAttributeName={ 'fontSize' }
						fontSize={ { fontSize: fontSize, customFontSize: customFontSize } }
						setAttributes={ setAttributes }
					/>
					<PanelColorSettings
						title={ __( 'Text Color', 'getwid' ) }
						colorSettings={ [
							{
								value: textColor.color,
								onChange: setTextColor,
								label: __( 'Text Color', 'getwid' )
							},
						] }
					/>
				</PanelBody>
			</InspectorControls>
		);
	}
}
