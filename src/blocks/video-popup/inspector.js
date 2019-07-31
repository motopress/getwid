/**
* External dependencies
*/
import GetwidStyleLengthControl from 'GetwidControls/style-length-control';


/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {Component, Fragment} = wp.element;
const {
	InspectorControls,
	PanelColorSettings
} = wp.editor;
const {
	PanelBody,
	RangeControl,
    TextControl,
	SelectControl,
	CheckboxControl
} = wp.components;


/**
* Create an Inspector Controls
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
				imageSize,
				id,
				url,
				type,
				title,
				text,
				link,
				align,
				minHeight,
				buttonMaxWidth,
				imageAnimation,
				buttonAnimation,
				rel,
				linkTarget,
				backgroundOpacity
			},
			titleColor,
			setTitleColor,
			subtitleColor,
			setSubtitleColor,
			iconColor,
			setIconColor,
			buttonColor,
			setButtonColor,
			overlayColor,
			setOverlayColor,

			changeImageSize,
			setAttributes,
			// setBackgroundColor,
			// setTextColor,

			// backgroundColor,
			// textColor,
			imgObj
		} = this.props;

		const onChangeImageSize = (imageSize) => {

			if (typeof imgObj != 'undefined'){
				setAttributes( {
					imageSize
				} );
				changeImageSize(imgObj, imageSize);
			}
		};

		return (
			<InspectorControls>
				<PanelBody title={__('Settings', 'getwid')} initialOpen={true}>
				{url && (
					<Fragment>
						<SelectControl
							label={__('Image Size', 'getwid')}
							help={__('For images from Media Library only.', 'getwid')}
							value={imageSize}
							onChange={onChangeImageSize}
							options={Getwid.settings.image_sizes}
						/>						
						<GetwidStyleLengthControl
							label={__('Image Height', 'getwid')}
							value={minHeight}
							units={[
								{label: 'px', value: 'px'},
								{label: 'vh', value: 'vh'},
								{label: 'vw', value: 'vw'},
								{label: '%', value: '%'}
							]}
							onChange={minHeight => setAttributes({minHeight})}
						/>

						<SelectControl
							label={__('Image Animation', 'getwid')}
							value={imageAnimation}
							onChange={imageAnimation => setAttributes({imageAnimation})}
							options={[
								{value: 'style1', label: __('Aries', 'getwid')},
								{value: 'style2', label: __('Taurus', 'getwid')},
								{value: 'style3', label: __('Gemini', 'getwid')},
								{value: 'style4', label: __('Cancer', 'getwid')},
								{value: 'style5', label: __('Leo', 'getwid')},
								{value: 'style6', label: __('Virgo', 'getwid')},
							]}
						/>						
					</Fragment>
				)}

					<GetwidStyleLengthControl
						label={__('Button Width', 'getwid')}
						value={buttonMaxWidth}
						units={[
							{label: 'px', value: 'px'},
							{label: 'vh', value: 'vh'},
							{label: 'vw', value: 'vw'},
							{label: '%', value: '%'}
						]}
						onChange={buttonMaxWidth => setAttributes({buttonMaxWidth})}
					/>

					<SelectControl
						label={__('Button Animation', 'getwid')}
						value={buttonAnimation}
						onChange={buttonAnimation => setAttributes({buttonAnimation})}
						options={[
							{value: 'none', label: __('None', 'getwid')},
							{value: 'pulse', label: __('Pulse', 'getwid')},
						]}
					/>

					<SelectControl
						label={__('Button Size', 'getwid')}
						value={buttonAnimation}
						onChange={buttonAnimation => setAttributes({buttonAnimation})}
						options={[
							{value: 'default', label: __('Default', 'getwid')},
							{value: 'small', label: __('Small', 'getwid')},
							{value: 'normal', label: __('Normal', 'getwid')},
							{value: 'large', label: __('Large', 'getwid')},
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
								value: titleColor.color,
								onChange: setTitleColor,
								label: __('Title Color', 'getwid')
							},
							{
								value: subtitleColor.color,
								onChange: setSubtitleColor,
								label: __('Subtitle Color', 'getwid')
							},	
							{
								value: iconColor.color,
								onChange: setIconColor,
								label: __('Icon button Color', 'getwid')
							},
							{
								value: buttonColor.color,
								onChange: setButtonColor,
								label: __('Button Color', 'getwid')
							},
							...( url ? [{
								value: overlayColor.color,
								onChange: setOverlayColor,
								label: __('Overlay Color', 'getwid')
							}] : [])							
						]}
					>
					</PanelColorSettings>

					{url && (
						<RangeControl
							label={ __( 'Overlay Opacity', 'getwid' ) }
							value={ backgroundOpacity }
							onChange={backgroundOpacity => setAttributes({backgroundOpacity})}
							min={ 0 }
							max={ 100 }
							step={ 5 }
						/>
					)}

				</PanelBody>
			</InspectorControls>
		);
	}
}