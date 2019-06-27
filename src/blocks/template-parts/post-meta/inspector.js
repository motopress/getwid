/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {Component} = wp.element;
const {
	InspectorControls,
	PanelColorSettings,
} = wp.editor;
const {
	PanelBody,
	SelectControl,
} = wp.components;


/**
* Create an Inspector Controls
*/
export default class Inspector extends Component {

	render() {

		const {
			attributes: {
				direction,
				blockDivider
			},
			textColor,
			setTextColor,

			setAttributes
		} = this.props;

		return (
			<InspectorControls>
				<PanelBody
					title={__('Settings', 'getwid')}
				>
					<SelectControl
						label={__('Divider', 'getwid')}
						value={blockDivider}
						onChange={blockDivider => setAttributes({blockDivider})}
						options={[
							{value: '', label: __('None', 'getwid'), },
							{value: '/', label: __('/', 'getwid'), },
							{value: '|', label: __('|', 'getwid'), },
							{value: '•', label: __('•', 'getwid'), },
							{value: '·', label: __('·', 'getwid'), },
						]}
					/>					
					<SelectControl
						label={__('Direction', 'getwid')}
						value={ direction }
						onChange={direction => setAttributes({direction})}
						options={[
							{value: 'row', label: __('Horizontal', 'getwid')},
							{value: 'column', label: __('Vertical', 'getwid')},
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