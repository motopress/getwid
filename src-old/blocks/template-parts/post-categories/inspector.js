/**
* External dependencies
*/
import GetwidIconPicker from 'GetwidControls/icon-picker';
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
	SelectControl,
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
				divider,
				icon,
				fontSize,
				customFontSize
			},
			textColor,
			setTextColor,
			iconColor,
			setIconColor,
			setAttributes,
		} = this.props;

		return (
			<InspectorControls>
				<PanelBody title={ __('Settings', 'getwid') }>
					<SelectControl
						label={__('Divider', 'getwid')}
						value={divider}
						onChange={divider => setAttributes({divider})}
						options={[
							{value: '', label: __('None', 'getwid'), },
							{value: ',', label: ',' },
						]}
					/>
					<GetwidFontSizePicker
						fontSizeAttributeName={ 'fontSize' }
						fontSize={ { fontSize: fontSize, customFontSize: customFontSize } }
						setAttributes={ setAttributes }
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
						title={__('Text Color', 'getwid')}
						colorSettings={[
							{
								value: textColor.color,
								onChange: setTextColor,
								label: __('Text Color', 'getwid')
							},
						]}
					/>
					<PanelColorSettings initialOpen={false}
						title={__('Icon Color', 'getwid')}
						colorSettings={[
							{
								value: iconColor.color,
								onChange: setIconColor,
								label: __('Icon Color', 'getwid')
							},
						]}
					/>
				</PanelBody>
			</InspectorControls>
		);
	}
}
