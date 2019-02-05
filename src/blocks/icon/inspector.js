import GetwidIconPicker from 'GetwidControls/icon-picker';
import GetwidAnimationSelectControl from 'GetwidControls/animation-select-control';
import GetwidStyleLengthControl from 'GetwidControls/style-length-control';

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
	ToggleControl,
	Button
} = wp.components;

const {compose} = wp.compose;

/**
 * Create an Inspector Controls wrapper Component
 */
class Inspector extends Component {

	constructor() {
		super(...arguments);
	}

	hasMargin() {
		const {attributes: {marginTop, marginBottom, marginLeft, marginRight}} = this.props;
		return marginTop !== undefined ||
			marginBottom !== undefined ||
			marginRight !== undefined ||
			marginLeft !== undefined;
	}

	render() {
		const {
			attributes: {
				icon,
				iconStyle,
				iconSize,
				padding,
				marginTop,
				marginBottom,
				marginLeft,
				marginRight,				
				borderWidth,
				borderRadius,
				link,
				newWindow,
				hoverAnimation,
			},
			setAttributes,
			setBackgroundColor,
			setTextColor,

			backgroundColor,
			textColor,
		} = this.props;

		const resetMargin = () => {
			setAttributes({
				marginTop: undefined,
				marginBottom: undefined,
				marginLeft: undefined,
				marginRight: undefined
			})
		};	

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

					<GetwidStyleLengthControl
						label={__('Icon size', 'getwid')}
						value={iconSize}
						onChange={iconSize => {
							setAttributes({iconSize});
						}}
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

					{
						this.hasMargin() &&
						<Button isLink isDestructive onClick={resetMargin} >
							{__('Reset Margin', 'getwid')}
						</Button>
					}
					<GetwidStyleLengthControl
						label={__('Margin Top', 'getwid')}
						value={marginTop}
						onChange={marginTop => {
							setAttributes({marginTop});
						}}
						allowNegative
						allowAuto
					/>
					<GetwidStyleLengthControl
						label={__('Margin Bottom', 'getwid')}
						value={marginBottom}
						onChange={marginBottom => {
							setAttributes({marginBottom});
						}}
						allowNegative
						allowAuto
					/>
					<GetwidStyleLengthControl
						label={__('Margin Left', 'getwid')}
						value={marginLeft}
						onChange={marginLeft => {
							setAttributes({marginLeft});
						}}
						allowNegative
						allowAuto
					/>
					<GetwidStyleLengthControl
						label={__('Margin Right', 'getwid')}
						value={marginRight}
						onChange={marginRight => {
							setAttributes({marginRight});
						}}
						allowNegative
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
							autoFocus={ false }
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

export default compose( [
	withColors( 'backgroundColor', { textColor: 'color' } ),
	// applyFallbackStyles,
] )( Inspector );