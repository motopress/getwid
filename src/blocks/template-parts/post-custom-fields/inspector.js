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
	TextControl
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
			},		
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
					<TextControl
						label={__('Custom field', 'getwid')}
						help={ __( 'Enter name of field from metabox', 'getwid' ) }
						value={ customField }
						onChange={customField => setAttributes({customField})}
					/>
					<FontSizePicker
						fallbackFontSize={ fallbackFontSize }
						value={ fontSize.size }
						onChange={ setFontSize }
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