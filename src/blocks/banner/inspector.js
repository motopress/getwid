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
	PanelColorSettings
} = wp.editor;

const {
	IconButton,
	PanelBody,
	RangeControl,
	ToggleControl,
	Toolbar,
    TextControl,
	SelectControl,
	CheckboxControl
} = wp.components;

/**
 * Create an Inspector Controls wrapper Component
 */
export default class Inspector extends Component {

	constructor() {
		super(...arguments);

        this.onSetLinkRel = this.onSetLinkRel.bind( this );
	}

    onSetLinkRel( value ) {
        this.props.setAttributes( { rel: value } );
    }

    render() {

		const {
			attributes: {
				videoAutoplay,
				imageSize,
				id,
				url,
				type,
				title,
				text,
				link,
				align,
				minHeight,
				contentMaxWidth,
				verticalAlign,
				horizontalAlign,
				backgroundOpacity,
				blockAnimation,
				textAnimation,
				rel,
				linkTarget
			},
			changeImageSize,
			setAttributes,
			setBackgroundColor,
			setTextColor,

			backgroundColor,
			textColor,
			imgObj
		} = this.props;

		const onChangeImageSize = (imageSize) => {

			if (typeof imgObj != 'undefined'){
				setAttributes( {
					imageSize
				} );
				changeImageSize(imgObj, imageSize);
			} else {
				alert(__('For self-hosted images only', 'getwid'));
			}

		};

		return (
			<InspectorControls>
				<PanelBody title={__('Settings', 'getwid')} initialOpen={true}>

					{(type == 'video' && !!url ) && (
						<CheckboxControl
							label={__('Video autoplay', 'getwid')}
							checked={ videoAutoplay !== undefined ? videoAutoplay : false }
							onChange={ videoAutoplay => setAttributes({videoAutoplay}) }
						/>						
					)}

					<SelectControl
						label={__('Image Size', 'getwid')}
						help={__('For self-hosted images only', 'getwid')}
						value={imageSize}
						onChange={onChangeImageSize}
						options={Getwid.settings.image_sizes}
					/>						

					<SelectControl
						label={__('Text Horizontal Alignment', 'getwid')}
						value={horizontalAlign !== undefined ? horizontalAlign : 'center'}
						onChange={horizontalAlign => setAttributes({horizontalAlign})}
						options={[
							{value: 'left', label: __('Left', 'getwid')},
							{value: 'center', label: __('Center', 'getwid')},
							{value: 'right', label: __('Right', 'getwid')},
						]}
					/>
					<SelectControl
						label={__('Text Vertical Alignment', 'getwid')}
						value={verticalAlign !== undefined ? verticalAlign : 'center'}
						onChange={verticalAlign => setAttributes({verticalAlign})}
						options={[
							{value: 'top', label: __('Top', 'getwid')},
							{value: 'center', label: __('Middle', 'getwid')},
							{value: 'bottom', label: __('Bottom', 'getwid')},
						]}
					/>
					<GetwidStyleLengthControl
						label={__('Block Min Height', 'getwid')}
						value={minHeight}
						units={[
							{label: 'px', value: 'px'},
							{label: 'vh', value: 'vh'},
							{label: 'vw', value: 'vw'},
							{label: '%', value: '%'}
						]}
						onChange={minHeight => setAttributes({minHeight})}
					/>
					<GetwidStyleLengthControl
						label={__('Content Max Width', 'getwid')}
						value={contentMaxWidth}
						units={[
							{label: 'px', value: 'px'},
							{label: 'vh', value: 'vh'},
							{label: 'vw', value: 'vw'},
							{label: '%', value: '%'}
						]}
						onChange={contentMaxWidth => setAttributes({contentMaxWidth})}
					/>
					<SelectControl
						label={__('Block Animation', 'getwid')}
						help={__('Hover to preview', 'getwid')}
						value={blockAnimation}
						onChange={blockAnimation => setAttributes({blockAnimation})}
						options={[
							{value: 'style1', label: __('Aries', 'getwid')},
							{value: 'style2', label: __('Taurus', 'getwid')},
							{value: 'style3', label: __('Gemini', 'getwid')},
							{value: 'style4', label: __('Cancer', 'getwid')},
							{value: 'style5', label: __('Leo', 'getwid')},
							{value: 'style6', label: __('Virgo', 'getwid')},
						]}
					/>

					<SelectControl
						label={__('Text Animation', 'getwid')}
						value={textAnimation}
						onChange={textAnimation => setAttributes({textAnimation})}
						options={[
							{value: 'none', label: __('None', 'getwid')},
							{value: 'text-opacity', label: __('Fade In', 'getwid')},
							{value: 'text-opacity-top', label: __('Fade In Up', 'getwid')},
							{value: 'text-opacity-bottom', label: __('Fade In Down', 'getwid')},
							{value: 'text-opacity-left', label: __('Fade In Left', 'getwid')},
							{value: 'text-opacity-right', label: __('Fade In Right', 'getwid')},
							{value: 'text-opacity-zoom-in', label: __('Zoom In', 'getwid')},
							{value: 'text-opacity-zoom-out', label: __('Zoom Out', 'getwid')},
						]}
					/>
                    <TextControl
                        label={ __( 'Link Rel', 'getwid' ) }
                        value={ rel || '' }
                        onChange={ this.onSetLinkRel }
                    />
					<PanelColorSettings
						title={__('Colors', 'getwid')}
						initialOpen={ true }
						colorSettings={[
							{
								value: textColor.color,
								onChange: setTextColor,
								label: __('Text Color', 'getwid')
							},
							{
								value: backgroundColor.color,
								onChange: setBackgroundColor,
								label: __('Overlay Color', 'getwid')
							}
						]}
					>
						<RangeControl
							label={ __( 'Overlay Opacity', 'getwid' ) }
							value={ backgroundOpacity }
							onChange={backgroundOpacity => setAttributes({backgroundOpacity})}
							min={ 0 }
							max={ 100 }
							step={ 5 }
						/>
					</PanelColorSettings>
				</PanelBody>
			</InspectorControls>
		);
	}
}