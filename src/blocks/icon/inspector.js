import IconPicker from 'GetwidControls/icon-picker';
import GetwidAnimationSelectControl from '../../controls/animation-select-control';

/**
 * Internal block libraries
 */
const {__} = wp.i18n;
const {Component} = wp.element;

const {
	InspectorControls,
	ColorPalette,
	FontSizePicker,
	PanelColorSettings
} = wp.editor;

const {
	PanelBody,
	RangeControl,
	TextControl,
	SelectControl,
} = wp.components;

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
				icon, style, primaryColor, secondaryColor, iconSize, padding, borderWidth, borderRadius,
				link, hoverAnimation
			},
			setAttributes
		} = this.props;

		const useSecondaryColor = style === 'stacked' || style === 'framed';

		return (
			<InspectorControls>

				<PanelBody
					title={__('Icon', 'getwid')}
				>
					<IconPicker
						value={icon}
						onChange={icon => setAttributes({icon})}
					/>
				</PanelBody>

				<PanelBody
					title={__('Style', 'getwid')}
				>
					<SelectControl
						label={__('Style', 'getwid')}
						value={style}
						options={[
							{value: 'default', label: __('Just Icon', 'getwid')},
							{value: 'stacked', label: __('With Background', 'getwid')},
							{value: 'framed', label: __('With Frame Border', 'getwid')},
						]}
						onChange={style => setAttributes({style})}
					/>
					<PanelColorSettings
						title={__('Color', 'getwid')}
						colorSettings={[
							{
								value: primaryColor,
								onChange: primaryColor => setAttributes({primaryColor}),
								label: __('Primary Color', 'getwid')
							},
							...( useSecondaryColor ? [{
								value: secondaryColor,
								onChange: secondaryColor => setAttributes({secondaryColor}),
								label: __('Secondary Color', 'getwid')
							}] : [])
						]}
					>
					</PanelColorSettings>
				</PanelBody>

				<PanelBody title={__('Icon Size', 'getwid')}>
					<FontSizePicker
						value={iconSize !== undefined ? iconSize : ''}
						onChange={iconSize => setAttributes({iconSize})}
					/>
				</PanelBody>

				<PanelBody title={__('Other', 'getwid')}>
					<TextControl
						type="number"
						label={__('Padding in pixels', 'getwid')}
						value={padding !== undefined ? padding : '' }
						onChange={padding => {
							padding = parseInt(padding);
							if (isNaN(padding)) {
								padding = undefined;
							}
							setAttributes({padding})
						}}
						min={0}
						step={1}
						placeholder="16"
					/>
				</PanelBody>


				{style === 'framed' &&
				<PanelBody title={__('Border', 'getwid')}>
					<TextControl
						type="number"
						label={__('Border width in pixels', 'getwid')}
						value={borderWidth !== undefined ? borderWidth : ''}
						onChange={borderWidth => {
							borderWidth = parseInt(borderWidth);
							if (isNaN(borderWidth)) {
								borderWidth = undefined;
							}
							setAttributes({borderWidth}) }
						}
						min={0}
						step={1}
						placeholder="1"
					/>
					<RangeControl
						label={__('Border radius in %', 'getwid')}
						value={borderRadius !== undefined ? borderRadius : ''}
						onChange={borderRadius => {
							setAttributes({borderRadius})
						}}
						min={0}
						step={1}
						max={100}
						placeholder="0"
					/>
				</PanelBody>
				}

				<PanelBody
					title={__('Link', 'getwid')}
				>
					<TextControl
						value={link || ''}
						onChange={(link) => setAttributes({link})}
						placeholder='https://'
					/>
				</PanelBody>

				<PanelBody
					title={__('Hover', 'getwid')}
				>
					<GetwidAnimationSelectControl
						label={__('Hover Animation', 'getwid')}
						value={hoverAnimation !== undefined ? hoverAnimation : ''}
						onChange={hoverAnimation => setAttributes({hoverAnimation})}
						allowExit={false}
					/>
					{/*<PanelColorSettings*/}
						{/*title={__('Hover Primary Color', 'getwid')}*/}
						{/*colorValue={hoverPrimaryColor}*/}
					{/*>*/}
						{/*<ColorPalette*/}
							{/*value={hoverPrimaryColor}*/}
							{/*onChange={hoverPrimaryColor => setAttributes({hoverPrimaryColor})}*/}
						{/*/>*/}
					{/*</PanelColorSettings>*/}
					{/*{useSecondaryColor &&*/}
					{/*<PanelColorSettings*/}
						{/*title={__('Hover Secondary Color', 'getwid')}*/}
						{/*colorValue={hoverSecondaryColor}*/}
					{/*>*/}
						{/*<ColorPalette*/}
							{/*value={hoverSecondaryColor}*/}
							{/*onChange={hoverSecondaryColor => setAttributes({hoverSecondaryColor})}*/}
						{/*/>*/}
					{/*</PanelColorSettings>*/}
					{/*}*/}
				</PanelBody>

			</InspectorControls>
		);
	}
}
