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
				url,
				link,
				minHeight,
				buttonMaxWidth,
				imageAnimation,
				buttonStyle,
				buttonAnimation,
				buttonSize,
				overlayOpacity
			},
			titleColor,
			setTitleColor,
			iconColor,
			setIconColor,
			buttonColor,
			buttonColorHEX,
			setButtonColor,
			overlayColor,
			setOverlayColor,

			changeImageSize,
			setAttributes,
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

					<TextControl
						label={__('URL', 'getwid')}
						help={__('Link to Youtube, Vimeo or self-hosted video', 'getwid')}
						value={ link }
						onChange={ link => setAttributes({link}) }
					/>

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
									{value: 'none', label: __('None', 'getwid')},
									{value: 'slide-left', label: __('Slide Left', 'getwid')},
									{value: 'slide-right', label: __('Slide Right', 'getwid')},
									{value: 'slide-top', label: __('Slide Top', 'getwid')},
									{value: 'slide-bottom', label: __('Slide Bottom', 'getwid')},
									{value: 'zoom-in', label: __('Zoom In', 'getwid')},
									{value: 'zoom-out', label: __('Zoom Out', 'getwid')},
								]}
							/>
						</Fragment>
					)}

					{!url && (
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
					)}

					<SelectControl
						label={__('Button Style', 'getwid')}
						value={buttonStyle}
						onChange={buttonStyle => setAttributes({buttonStyle})}
						options={[
							{value: 'none', label: __('Default', 'getwid')},
							{value: 'default', label: __('Border', 'getwid')},
							{value: 'outline', label: __('Outline', 'getwid')},
							{value: 'fill', label: __('Fill', 'getwid')},
						]}
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
						value={buttonSize}
						onChange={buttonSize => setAttributes({buttonSize})}
						options={[
							{value: 'default', label: __('Default', 'getwid')},
							{value: 'small', label: __('Small', 'getwid')},
							{value: 'normal', label: __('Normal', 'getwid')},
							{value: 'large', label: __('Large', 'getwid')},
						]}
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
								value: iconColor.color,
								onChange: setIconColor,
								label: __('Icon button Color', 'getwid')
							},
							{
								value: buttonColor.color,
								onChange: (val) =>{
									setButtonColor(val);
									setAttributes({buttonColorHEX:val})
								},
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
							value={ overlayOpacity }
							onChange={overlayOpacity => setAttributes({overlayOpacity})}
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
