/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
const {
	Component,
	Fragment,
} = wp.element;
const {
	InspectorControls,
	PanelColorSettings,
	AlignmentToolbar
} = wp.blockEditor || wp.editor;
const {
	PanelBody,
	SelectControl,
	RadioControl,
	BaseControl,
	TextControl,
	TabPanel,
	ButtonGroup,
	Modal,
	Button
} = wp.components;

/**
* Create an Inspector Controls
*/
export default class Inspector extends Component {

	constructor() {
		super(...arguments);
	}

	renderResponsiveAlignmentTabs( tab ){

		const{
			attributes:{
				textAlignmentDesktop,
				textAlignmentTablet,
				textAlignmentMobile,
			},
			setAttributes
		} = this.props;

		switch (tab.name){
			case 'desktop': {
				return(
					<Fragment>
						<RadioControl
							label={__('Horizontal Alignment', 'getwid')}
							selected={ textAlignmentDesktop !== undefined ? textAlignmentDesktop : 'left' }
							options={ [
								{value: 'left', label: __('Left', 'getwid')},
								{value: 'center', label: __('Center', 'getwid')},
								{value: 'right', label: __('Right', 'getwid')},
							] }
							onChange={textAlignmentDesktop => setAttributes({textAlignmentDesktop}) }
						/>			
					</Fragment>
				)
			}
			case 'tablet': {
				return(
					<Fragment>
						<RadioControl
							label={__('Horizontal Alignment', 'getwid')}
							selected={ textAlignmentTablet !== undefined ? textAlignmentTablet : 'left' }
							options={ [
								{value: 'left', label: __('Left', 'getwid')},
								{value: 'center', label: __('Center', 'getwid')},
								{value: 'right', label: __('Right', 'getwid')},
							] }
							onChange={textAlignmentTablet => setAttributes({textAlignmentTablet}) }
						/>	
					</Fragment>
				)
			}
			case 'mobile': {
				return(
					<Fragment>
						<RadioControl
							label={__('Horizontal Alignment', 'getwid')}
							selected={ textAlignmentMobile !== undefined ? textAlignmentMobile : 'left' }
							options={ [
								{value: 'left', label: __('Left', 'getwid')},
								{value: 'center', label: __('Center', 'getwid')},
								{value: 'right', label: __('Right', 'getwid')},
							] }
							onChange={textAlignmentMobile => setAttributes({textAlignmentMobile}) }
						/>		
					</Fragment>
				)
			}

		}
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
			className,
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
					title={__('Settings', 'getwid')}
				>

					<TabPanel className="getwid-editor-tabs"
						activeClass="is-active"
						tabs={ [
							{
								name: 'desktop',
								title: __('Desktop', 'getwid'),
								className: 'components-button is-link is-small',
							},
							{
								name: 'tablet',
								title: __('Tablet', 'getwid'),
								className: 'components-button is-link is-small',
							},
							{
								name: 'mobile',
								title: __('Mobile', 'getwid'),
								className: 'components-button is-link is-small',
							},
						] }>
						{
							(tab) => this.renderResponsiveAlignmentTabs(tab)
						}
					</TabPanel>

					<PanelColorSettings
						title={__('Colors', 'getwid')}
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
						label={__('Icon Size', 'getwid')}
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
						label={__('Space between icons', 'getwid')}
						value={iconsSpacing}
						options={[
							{value: 'none', label: __('None', 'getwid')},
							{value: 'default', label: __('Default', 'getwid')},
							{value: 'small', label: __('Small', 'getwid')},
							{value: 'medium', label: __('Medium', 'getwid')},
							{value: 'large', label: __('Large', 'getwid')},
						]}
						onChange={iconsSpacing => setAttributes({iconsSpacing})}
					/>

				</PanelBody>
			</InspectorControls>
		);
	}

}