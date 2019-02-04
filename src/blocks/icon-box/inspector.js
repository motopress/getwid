import GetwidIconPicker from 'GetwidControls/icon-picker';
import GetwidAnimationSelectControl from 'GetwidControls/animation-select-control';

/**
 * Internal block libraries
 */
const {__} = wp.i18n;
const {Component} = wp.element;

const {
	InspectorControls,
	ColorPalette,
	FontSizePicker,
	PanelColorSettings,
	URLInput,
	withColors
} = wp.editor;

const {
	PanelBody,
	BaseControl,
	RangeControl,
	TextControl,
	SelectControl,
	RadioControl,
	ToggleControl
} = wp.components;

const {compose} = wp.compose;

/**
 * Create an Inspector Controls wrapper Component
 */
class Inspector extends Component {

	constructor() {
		super(...arguments);
	}

	render() {
		const {
			attributes: {
				icon,
				textAlignment,
				layout,
				iconPosition,
				iconStyle,
				iconSize,
				padding,
				borderWidth,
				borderRadius,
				link,
				newWindow,
				hoverAnimation
			},
			setAttributes,
			setBackgroundColor,
			setTextColor,

			backgroundColor,
			textColor,
		} = this.props;

		const useSecondaryColor = iconStyle === 'stacked' || iconStyle === 'framed';

		return (
			<InspectorControls>

				<PanelBody
					title={__('Icon Settings', 'getwid')}
				>
					<BaseControl
						label={__('Icon', 'getwid')}
					>
						<GetwidIconPicker
							value={icon}
							onChange={icon => setAttributes({icon})}
						/>
					</BaseControl>

					<RadioControl
					    label={__('Layout', 'getwid')}
					    selected={ iconStyle !== undefined ? iconStyle : 'default' }
					    options={ [
							{value: 'default', label: __('Icon', 'getwid')},
							{value: 'stacked', label: __('Background', 'getwid')},
							{value: 'framed', label: __('Outline', 'getwid')},
					    ] }
					    onChange={iconStyle => setAttributes({iconStyle}) }
					/>

					{(layout == 'left' || layout == 'right') &&
						<SelectControl
							label={__('Icon Vertical Align', 'getwid')}
							value={iconPosition}
							options={[
								{value: 'top', label: __('Top', 'getwid')},
								{value: 'middle', label: __('Middle', 'getwid')},
								{value: 'bottom', label: __('Bottom', 'getwid')},
							]}
							onChange={iconPosition => setAttributes({iconPosition})}
						/>
					}

					<PanelColorSettings
						title={__('Colors', 'getwid')}
						colorSettings={[
							{
								value: textColor.color,
								onChange: setTextColor,
								label: __('Icon Color', 'getwid')
							},
							...( useSecondaryColor && iconStyle == 'stacked' ? [{
								value: backgroundColor.color,
								onChange: setBackgroundColor,
								label: __('Background Color', 'getwid')
							}] : [])
						]}
					>
					</PanelColorSettings>

					<FontSizePicker
						value={iconSize !== undefined ? iconSize : ''}
						onChange={iconSize => setAttributes({iconSize})}
					/>

					<TextControl
						type="number"
						label={__('Padding', 'getwid')}
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

					{(iconStyle === 'framed') &&
						<TextControl
							type="number"
							label={__('Border Width', 'getwid')}
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
					}

					{(iconStyle === 'framed' || iconStyle === 'stacked') &&
						<RangeControl
							label={__('Border Radius', 'getwid')}
							value={borderRadius !== undefined ? borderRadius : ''}
							onChange={borderRadius => {
								setAttributes({borderRadius})
							}}
							min={0}
							step={1}
							max={100}
							placeholder="0"
						/>
					}

					<BaseControl
						label={__('Link', 'getwid')}
					>
						<URLInput
							label={__('Link', 'getwid')}
							value={ link }
							onChange={(link) => setAttributes({link})}
						/>
					</BaseControl>
					<BaseControl>
						<ToggleControl
							label={ __( 'Open in New Tab', 'getwid' ) }
							checked={ newWindow }
							onChange={ () => {
								setAttributes( { newWindow: !newWindow } );
							}}
						/>
					</BaseControl>

					<GetwidAnimationSelectControl
						label={__('Icon Hover Animation', 'getwid')}
						value={hoverAnimation !== undefined ? hoverAnimation : ''}
						onChange={hoverAnimation => setAttributes({hoverAnimation})}
						allowAnimation={['Seeker']}
					/>
				</PanelBody>

			</InspectorControls>
		);
	}
}

export default compose( [
	withColors( 'backgroundColor', { textColor: 'color' } ),
	// applyFallbackStyles,
] )( Inspector );