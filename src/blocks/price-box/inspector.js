import { __ } from 'wp.i18n';

const {Component, Fragment} = wp.element;

const {
	InspectorControls,
	PanelColorSettings
} = wp.editor;

class Inspector extends Component {
	constructor() {
		super(...arguments);
	}

	render() {
		const {
			backgroundColor,
			textColor,

			setBackgroundColor,
			setTextColor,

		} = this.props;

		return (
			<InspectorControls>
				<PanelColorSettings
					title={__('Color Settings', 'getwid')}
					colorSettings={[
						{							
							value: backgroundColor.color,
							onChange: setBackgroundColor,
							label: __('Background Color', 'getwid')
						},
						{							
							value: textColor.color,
							onChange: setTextColor,
							label: __('Content Color', 'getwid')
						}
					]}
					initialOpen={ true }
				/>
			</InspectorControls>
		);
	}	
}

export default Inspector;