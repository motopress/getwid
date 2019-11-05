/**
* External dependencies
*/
import GetwidIconPicker             from 'GetwidControls/icon-picker';
import GetwidAnimationSelectControl from 'GetwidControls/animation-select-control';
import GetwidStyleLengthControl     from 'GetwidControls/style-length-control';

import { renderMarginsPanel } from 'GetwidUtils/render-inspector';

/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
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
	SelectControl,
	RadioControl,
	ToggleControl,
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
				layout,
				iconPosition,
				iconStyle,
				iconSize,
				padding,			
				borderWidth,
				borderRadius,
				link,
				hoverAnimation,
				linkTarget,
				rel
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
					    label={__('Icon Style', 'getwid')}
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
							label={__('Icon Vertical Alignment', 'getwid')}
							value={iconPosition}
							options={[
								{value: 'top', label: __('Top', 'getwid')},
								{value: 'middle', label: __('Middle', 'getwid')},
								{value: 'bottom', label: __('Bottom', 'getwid')},
							]}
							onChange={iconPosition => setAttributes({iconPosition})}
						/>
					}
					<GetwidStyleLengthControl
						label={__('Icon Size', 'getwid')}
						value={iconSize}
						onChange={iconSize => {
							setAttributes({iconSize});
						}}
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

					<TextControl
						type="number"
						label={__('Space Around Icon', 'getwid')}
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
					/>

					{(iconStyle === 'framed') &&
						<TextControl
							type="number"
							label={__('Border Size', 'getwid')}
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
					<GetwidAnimationSelectControl
						label={__('Icon Hover Animation', 'getwid')}
						value={hoverAnimation !== undefined ? hoverAnimation : ''}
						onChange={hoverAnimation => setAttributes({hoverAnimation})}
						allowAnimation={['Seeker', 'Icon']}
					/>
				</PanelBody>
				<PanelBody
						title={__('Icon Link', 'getwid')}
						initialOpen={false}
				>
					<BaseControl
						label={__('Icon Link', 'getwid')}
						className={'getwid-editor-url-input'}
					>
						<URLInput
							autoFocus={ false }
							label={__('Icon Link', 'getwid')}
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
				</PanelBody>
				<PanelBody title={__('Margin', 'getwid')} initialOpen={false} >
					{ renderMarginsPanel( this ) }
				</PanelBody>

			</InspectorControls>
		);
	}
}

export default compose( [
	withColors( 'backgroundColor', { textColor: 'color' } ),
] )( Inspector );