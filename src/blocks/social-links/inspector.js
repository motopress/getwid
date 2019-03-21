import GetwidIconPicker from 'GetwidControls/icon-picker';
// Setup the block
const {__} = wp.i18n;
const {
	Component,
	Fragment,
} = wp.element;

const {
	InspectorControls,
	PanelColorSettings
} = wp.editor;

const {
	PanelBody,
	SelectControl,
	RadioControl,
	BaseControl,
	TextControl,
	ToggleControl,
} = wp.components;

const NEW_TAB_REL = 'noreferrer noopener';

/**
 * Create an Inspector Controls wrapper Component
 */
export default class Inspector extends Component {

	constructor() {
		super(...arguments);
	}

	render() {

		const {
			attributes: {
				align,
				textAlignment,
				icons,
				iconsStyle,
				iconsSize,
				iconsSpacing,
			},
			setAttributes,
			changeState,
			getState,
			updateArrValues,

			setBackgroundColor,
			setTextColor,
			backgroundColor,
			textColor,			
		} = this.props;

		const useSecondaryColor = iconsStyle === 'stacked' || iconsStyle === 'framed';

		return (
			<InspectorControls>						

				<PanelBody
					title={__('General Settings', 'getwid')}
				>			
					<PanelColorSettings
						title={__('Icons Color', 'getwid')}
						colorSettings={[
							{
								value: textColor.color,
								onChange: setTextColor,
								label: __('Icon Color', 'getwid')
							},
							...( useSecondaryColor && iconsStyle == 'stacked' ? [{
								value: backgroundColor.color,
								onChange: setBackgroundColor,
								label: __('Background Color', 'getwid')
							}] : [])
						]}
					>
					</PanelColorSettings>

					<RadioControl
					    label={__('Layout', 'getwid')}
					    selected={ iconsStyle !== undefined ? iconsStyle : 'default' }
					    options={ [
							{value: 'default', label: __('Icon', 'getwid')},
							{value: 'stacked', label: __('Background', 'getwid')},
							{value: 'framed', label: __('Outline', 'getwid')},
					    ] }
					    onChange={iconsStyle => setAttributes({iconsStyle}) }
					/>

					<TextControl
						type="number"
						label={__('Icons Size', 'getwid')}
						value={ iconsSize }
						onChange={iconsSize => {
							iconsSize = parseInt(iconsSize);
							if (isNaN(iconsSize)) {
								iconsSize = undefined;
							}
							setAttributes({iconsSize})
						}}
						min={0}
						step={1}
					/>

					<SelectControl
						label={__('Icons Spacing', 'getwid')}
						value={iconsSpacing}
						options={[
							{value: 'small', label: __('Small', 'getwid')},
							{value: 'medium', label: __('Medium', 'getwid')},
							{value: 'large', label: __('Large', 'getwid')},
							{value: 'big', label: __('Big', 'getwid')},
						]}
						onChange={iconsSpacing => setAttributes({iconsSpacing})}
					/>

				</PanelBody>
			</InspectorControls>
		);
	}

}