/**
* External dependencies
*/
import GetwidStyleLengthControl from 'GetwidControls/style-length-control';
import GetwidCustomTabsControl from 'GetwidControls/custom-tabs-control';


/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
const {Component, Fragment} = wp.element;
const {
	InspectorControls,
	PanelColorSettings,
	MediaPlaceholder,
	MediaUpload,
} = wp.editor;
const {
	PanelBody,
	RangeControl,
    TextControl,
	SelectControl,
	CheckboxControl,
	BaseControl,
	Button,
	ButtonGroup
} = wp.components;


/**
 * Module Constants
 */
const ALLOWED_MEDIA_TYPES = ['image'];


/**
* Create an Inspector Controls
*/
export default class Inspector extends Component {

	constructor() {
		super(...arguments);
		this.onSetLinkRel = this.onSetLinkRel.bind( this );

		this.changeState = this.changeState.bind(this);
		
		this.state = {
			tabName: 'general',
		};
	}

	changeState (param, value) {
		this.setState({[param]: value});
	}

	getState (value) {
		return this.state[value];
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
			onSelectMedia,
			setAttributes,
			imgObj
		} = this.props;

		const {
			tabName,
		} = this.state;

		const changeState = this.changeState;

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
				<GetwidCustomTabsControl
					state={tabName}
					stateName={'tabName'}
					onChangeTab={changeState}
					tabs={['general','style']}
				/>

				{ tabName === 'general' && (
					<Fragment>

						{ !url && (
							<MediaPlaceholder
								icon="format-image"
								labels={ {
									title: __( 'Image', 'getwid' ),
									instructions: __( 'Upload an image file, pick one from your media library, or add one with a URL.', 'getwid' ),
								} }
								onSelect={ onSelectMedia }
								accept="image/*"
								allowedTypes={ALLOWED_MEDIA_TYPES}
							/>
						)}

						{ url && (
							<MediaUpload
								onSelect={ onSelectMedia }
								allowedTypes={ ALLOWED_MEDIA_TYPES }
								value={ id }
								render={ ( { open } ) => (
									<BaseControl>
										{ !!url &&
											<div
												onClick={ open }
												className="getwid-background-image-wrapper"
											>
													<img src={url} />
											</div>
										}

										<ButtonGroup>
											<Button
												isPrimary
												onClick={ open }
											>
												{!id && __('Select Image', 'getwid')}
												{!!id && __('Replace Image', 'getwid')}
											</Button>

											{!!id && (
												<Button
													isDefault
													onClick={(e) => {
														setAttributes({id: null, url: null})
													}}
												>
													{__('Remove Image', 'getwid')}
												</Button>
											)}
										</ButtonGroup>

									</BaseControl>
								) }
							/>
						)}	

						<TextControl
							label={__('Video URL', 'getwid')}
							help={__('Link to Youtube, Vimeo or self-hosted video', 'getwid')}
							value={ link }
							onChange={ link => setAttributes({link}) }
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

						{url && (
							<Fragment>
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
					</Fragment>
				)}

				{ tabName === 'style' && (
					<Fragment>
						<SelectControl
							label={__('Button Style', 'getwid')}
							value={buttonStyle}
							onChange={buttonStyle => setAttributes({buttonStyle})}
							options={[
								{value: 'default', label: __('Default', 'getwid')},
								{value: 'bordered', label: __('Border', 'getwid')},
								{value: 'outline', label: __('Outline', 'getwid')},
								{value: 'fill', label: __('Fill', 'getwid')},
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

						{url && (
							<Fragment>
								{ imgObj && (
									<SelectControl
										label={__('Image Size', 'getwid')}
										help={__('For images from Media Library only.', 'getwid')}
										value={imageSize}
										onChange={onChangeImageSize}
										options={Getwid.settings.image_sizes}
									/>
								)}
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
							</Fragment>
						)}

						<PanelColorSettings
							title={__('Colors', 'getwid')}
							initialOpen={ true }
							colorSettings={[
								{
									value: buttonColor.color,
									onChange: (val) =>{
										setButtonColor(val);
										setAttributes({buttonColorHEX:val})
									},
									label: __('Button Color', 'getwid')
								},
								{
									value: iconColor.color,
									onChange: setIconColor,
									label: __('Icon Color', 'getwid')
								},
								{
									value: titleColor.color,
									onChange: setTitleColor,
									label: __('Title Color', 'getwid')
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
					</Fragment>
				)}
			</InspectorControls>
		);
	}
}
