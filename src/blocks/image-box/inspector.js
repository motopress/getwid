import GetwidAnimationSelectControl from 'GetwidControls/animation-select-control';
import GetwidStyleLengthControl from 'GetwidControls/style-length-control';
import {pick} from "lodash";

/**
 * Internal block libraries
 */
const {__} = wp.i18n;
const {Component, Fragment} = wp.element;

const {
	InspectorControls,
	ColorPalette,
	FontSizePicker,
	PanelColorSettings,
	URLInput,
	withColors,
	MediaUpload
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

const ALLOWED_IMAGE_MEDIA_TYPES = ['image'];

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
				image,
				icon,
				textAlignment,
				layout,
				imagePosition,
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
				hoverAnimation
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
					title={__('Image-box Settings', 'getwid')}
				>

					<MediaUpload
						onSelect={image => {
							setAttributes({
								image: image !== undefined ? pick(image, ['alt', 'id', 'url']) : {}
							});
						}}
						value={image !== undefined ? image.id : ''}
						allowedTypes={ALLOWED_IMAGE_MEDIA_TYPES}
						render={({ open }) => (
							<BaseControl>
								{!!image &&
									<div className="background-img">
										<img src={image.url} />
									</div>
								}
								<Button
									isDefault
									onClick={open}
								>
									{!image && __('Select Image', 'getwid')}
									{!!image && __('Replace Image', 'getwid')}
								</Button>
								{!!image &&
									<Fragment>
										<br />
										<Button onClick={() => { setAttributes({ image: undefined }) }} isLink isDestructive>
											{__('Remove', 'getwid')}
										</Button>
									</Fragment>
								}
							</BaseControl>
						)}
					/>

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
							label={__('Image Vertical Align', 'getwid')}
							value={imagePosition}
							options={[
								{value: 'top', label: __('Top', 'getwid')},
								{value: 'middle', label: __('Middle', 'getwid')},
								{value: 'bottom', label: __('Bottom', 'getwid')},
							]}
							onChange={imagePosition => setAttributes({imagePosition})}
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
						value={padding}
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
						allowAnimation={['Seeker', 'Icon']}
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