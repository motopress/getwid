/**
* External dependencies
*/
import GetwidIconPicker from 'GetwidControls/icon-picker';


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
	FontSizePicker,
} = wp.editor;
const {
	PanelBody,
	BaseControl,
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
				icon,
			},
			backgroundColor,
			setBackgroundColor,
			
			textColor,
			setTextColor,

			iconColor,
			setIconColor,

			fontSize,
			setFontSize,
			fallbackFontSize,

			setAttributes,
		} = this.props;
		
		return (
			<InspectorControls>
				<PanelBody title={ __('Settings', 'getwid') }>
					<FontSizePicker
						fallbackFontSize={ fallbackFontSize }
						value={ fontSize.size }
						onChange={ setFontSize }
					/>							
					<BaseControl
						label={__('Icon', 'getwid')}
					>
						<GetwidIconPicker
							value={icon}
							onChange={icon => setAttributes({icon})}
						/>
					</BaseControl>
					<PanelColorSettings
						title={__('Icon', 'getwid')}
						colorSettings={[
							{
								value: iconColor.color,
								onChange: setIconColor,
								label: __('Color', 'getwid')
							},
						]}
					/>										
					<PanelColorSettings
						title={__('Colors', 'getwid')}
						colorSettings={[
							{
								value: textColor.color,
								onChange: setTextColor,
								label: __('Text Color', 'getwid')
							},
						]}
					/>
				</PanelBody>
			</InspectorControls>
		);
	}
}