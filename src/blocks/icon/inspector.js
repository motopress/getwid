import IconPicker from 'GetwidControls/icon-picker';

/**
 * Internal block libraries
 */
const {__} = wp.i18n;
const {Component} = wp.element;

const {
	InspectorControls,
	ColorPalette,
	FontSizePicker,
} = wp.editor;

const {
	PanelBody,
	PanelColor,
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
				link, alignment, hoverAnimation, hoverPrimaryColor, hoverSecondaryColor
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
						value={style}
						options={[
							{value: 'default', label: __('Just Icon', 'getwid')},
							{value: 'stacked', label: __('With Background', 'getwid')},
							{value: 'framed', label: __('With Frame Border', 'getwid')},
						]}
						onChange={style => setAttributes({style})}
					/>
				</PanelBody>

				<PanelColor
					title={__('Primary Color', 'getwid')}
					colorValue={primaryColor}
				>
					<ColorPalette
						value={primaryColor}
						onChange={primaryColor => setAttributes({primaryColor})}
					/>
				</PanelColor>

				{useSecondaryColor &&
				<PanelColor
					title={__('Secondary Color', 'getwid')}
					colorValue={secondaryColor}
				>
					<ColorPalette
						value={secondaryColor}
						onChange={secondaryColor => setAttributes({secondaryColor})}
					/>
				</PanelColor>
				}

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
						onChange={padding => setAttributes({padding})}
						min="0"
						step="1"
						placeholder="16"
					/>
				</PanelBody>


				{style === 'framed' &&
				<PanelBody title={__('Border', 'getwid')}>
					<TextControl
						type="number"
						label={__('Border width in pixels', 'getwid')}
						value={borderWidth !== undefined ? borderWidth : ''}
						onChange={borderWidth => setAttributes({borderWidth})}
						min="0"
						step="1"
						placeholder="1"
					/>
					<RangeControl
						label={__('Border radius in %', 'getwid')}
						value={borderRadius !== undefined ? borderRadius : ''}
						onChange={borderRadius => setAttributes({borderRadius})}
						min="0"
						step="1"
						max="100"
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
					title={__('Alignment', 'getwid')}
				>
					<SelectControl
						value={alignment}
						options={[
							{value: 'left', label: __('Left', 'getwid')},
							{value: 'center', label: __('Center', 'getwid')},
							{value: 'right', label: __('Right', 'getwid')},
						]}
						onChange={alignment => setAttributes({alignment})}
					/>
				</PanelBody>

				<PanelBody
					title={__('Hover', 'getwid')}
				>
					<SelectControl
						label={__('Hover Animation', 'getwid')}
						value={hoverAnimation}
						options={[
							{value: '', label: __('None', 'getwid')},
							{value: 'ease', label: __('Ease', 'getwid')},
							{value: 'ease-in', label: __('Ease In', 'getwid')},
							{value: 'ease-out', label: __('Ease Out', 'getwid')},
							{value: 'ease-in-out', label: __('Ease In Out', 'getwid')},
						]}
						onChange={hoverAnimation => setAttributes({hoverAnimation})}
					/>
					<PanelColor
						title={__('Hover Primary Color', 'getwid')}
						colorValue={hoverPrimaryColor}
					>
						<ColorPalette
							value={hoverPrimaryColor}
							onChange={hoverPrimaryColor => setAttributes({hoverPrimaryColor})}
						/>
					</PanelColor>
					{useSecondaryColor &&
					<PanelColor
						title={__('Hover Secondary Color', 'getwid')}
						colorValue={hoverSecondaryColor}
					>
						<ColorPalette
							value={hoverSecondaryColor}
							onChange={hoverSecondaryColor => setAttributes({hoverSecondaryColor})}
						/>
					</PanelColor>
					}
				</PanelBody>

			</InspectorControls>
		);
	}
}
