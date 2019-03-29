/**
* External dependencies
*/
import GetwidIconPicker from 'GetwidControls/icon-picker';
import GetwidAnimationSelectControl from 'GetwidControls/animation-select-control';
import GetwidStyleLengthControl from 'GetwidControls/style-length-control';


/**
* WordPress dependencies
*/
const {__} = wp.i18n;
const {Component} = wp.element;
const {
	InspectorControls,
	PanelColorSettings,
	URLInput,
	withColors
} = wp.editor;
const {
	PanelBody,
	BaseControl,
	RangeControl,
	TextControl,
	RadioControl,
	ToggleControl,
	Button
} = wp.components;
const {compose} = wp.compose;


/**
* Module Constants
*/
const NEW_TAB_REL = 'noreferrer noopener';


/**
* Create an Inspector Controls
*/
class Inspector extends Component {

	constructor() {
		super(...arguments);

        this.onSetNewTab = this.onSetNewTab.bind( this );
        this.onSetLinkRel = this.onSetLinkRel.bind( this );
	}

	hasMargin() {
		const {attributes: {marginTop, marginBottom, marginLeft, marginRight}} = this.props;
		return marginTop !== undefined ||
			marginBottom !== undefined ||
			marginRight !== undefined ||
			marginLeft !== undefined;
	}

    onSetNewTab( value ) {
        const { rel } = this.props.attributes;
        const linkTarget = value ? '_blank' : undefined;

        let updatedRel = rel;
        if ( linkTarget && ! rel ) {
            updatedRel = NEW_TAB_REL;
        } else if ( ! linkTarget && rel === NEW_TAB_REL ) {
            updatedRel = undefined;
        }

        this.props.setAttributes( {
            linkTarget,
            rel: updatedRel,
        } );
    }

    onSetLinkRel( value ) {
        this.props.setAttributes( { rel: value } );
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
				hoverAnimation,
				rel,
                linkTarget
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
					title={__('Settings', 'getwid')}
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
						label={__('Icon Size', 'getwid')}
						value={iconSize}
						onChange={iconSize => {
							setAttributes({iconSize});
						}}
					/>

					<TextControl
						type="number"
						label={__('Spacing', 'getwid')}
						value={ padding }
						onChange={padding => {
							padding = parseInt(padding);
							if (isNaN(padding)) {
								padding = undefined;
							}
							setAttributes({padding})
						}}
						min={0}
						step={1}
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
						className="getwid-editor-url-input"
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
                            checked={ linkTarget === '_blank' }
                            onChange={ this.onSetNewTab }
                        />
                    </BaseControl>
                    <TextControl
                        label={ __( 'Link Rel', 'getwid' ) }
                        value={ rel || '' }
                        onChange={ this.onSetLinkRel }
                    />

					<GetwidAnimationSelectControl
						label={__('Icon Hover Animation', 'getwid')}
						value={hoverAnimation !== undefined ? hoverAnimation : ''}
						onChange={hoverAnimation => setAttributes({hoverAnimation})}
						allowAnimation={['Seeker', 'Icon']}
					/>

				</PanelBody>
				<PanelBody
					title={__('Margin', 'getwid')}
					initialOpen={false}
				>
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
					<BaseControl>
						<Button isLink
							onClick={resetMargin}
							disabled={ !this.hasMargin() }>
							{__('Reset', 'getwid')}
						</Button>
					</BaseControl>
				</PanelBody>

			</InspectorControls>
		);
	}
}

export default compose( [
	withColors( 'backgroundColor', { textColor: 'color' } ),
	// applyFallbackStyles,
] )( Inspector );