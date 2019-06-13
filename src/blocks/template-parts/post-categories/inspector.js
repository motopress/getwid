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
			},
			backgroundColor,
			setBackgroundColor,
			
			textColor,
			setTextColor,

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
					<SelectControl
						label={__('Divider', 'getwid')}
						value={divider}
						onChange={divider => setAttributes({divider})}
						options={[
							{value: '', label: __('None', 'getwid'), },
							{value: '.', label: __('.', 'getwid'), },
							{value: ',', label: __(',', 'getwid'), },
							{value: ' -', label: __('-', 'getwid'), },
							{value: ' •', label: __('•', 'getwid'), },
							{value: ' |', label: __('|', 'getwid'), },
							{value: ' ·', label: __('·', 'getwid'), },
							{value: ' /', label: __('/', 'getwid'), },
							{value: ' &', label: __('&', 'getwid'), },
							{value: ' ֎', label: __('֎', 'getwid'), },
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
							{
								value: backgroundColor.color,
								onChange: setBackgroundColor,
								label: __('Background Color', 'getwid')
							},
						]}
					/>
				</PanelBody>
			</InspectorControls>
		);
	}
}