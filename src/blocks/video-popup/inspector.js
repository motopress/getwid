/**
* External dependencies
*/
import { __ } from 'wp.i18n';

/**
* Internal dependencies
*/
import GetwidStyleLengthControl from 'GetwidControls/style-length-control';
import GetwidCustomTabsControl  from 'GetwidControls/custom-tabs-control';
import GetwidCustomColorPalette from 'GetwidControls/custom-color-palette';

import { renderMediaControl as GetwidMediaControl } from 'GetwidUtils/render-inspector';

/**
* WordPress dependencies
*/
const {Component, Fragment} = wp.element;
const { InspectorControls } = wp.blockEditor || wp.editor;
const {PanelBody,RangeControl, TextControl,SelectControl } = wp.components;

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
			setButtonColor,
			overlayColor,
			setOverlayColor,
			customIconColor,
			customTitleColor,
			customOverlayColor,
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
						<PanelBody initialOpen={true}>
							<GetwidMediaControl
								label={__( 'Image', 'getwid' )}
								url={url}
								id={id}
								onSelectMedia={onSelectMedia}
								onRemoveMedia={() => setAttributes({
									url: undefined,
									id: undefined
								})}
							/>
							<TextControl
								label={__('Video URL', 'getwid')}
								help={__('Link to Youtube, Vimeo or self-hosted video. This video will be opened in a popup.', 'getwid')}
								value={ link || '' }
								onChange={ link => setAttributes({link}) }
							/>
						</PanelBody>
					</Fragment>
				)}

				{ tabName === 'style' && (
					<Fragment>
						<PanelBody initialOpen={true}>
							<SelectControl
								label={__('Button Style', 'getwid')}
								help={__('Button styles depend on whether the image is selected.', 'getwid')}
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
									label={__('Button Maximum Width', 'getwid')}
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
							<GetwidCustomColorPalette
								colorSettings={[{
										title: __( 'Button Color', 'getwid' ),
										colors: {
											customColor: customTitleColor,
											defaultColor: buttonColor
										},
										changeColor: value => {
											setButtonColor(value);
											setAttributes({ buttonColorHEX: value });
										}
									}, {
										title: __( 'Icon Color', 'getwid' ),
										colors: {
											customColor: customIconColor,
											defaultColor: iconColor
										},
										changeColor: setIconColor
									}, {
										title: __( 'Title Color', 'getwid' ),
										colors: {
											customColor: customTitleColor,
											defaultColor: titleColor
										},
										changeColor: setTitleColor
									},
									...( url ? [{
										title: __( 'Overlay Color', 'getwid' ),
										colors: {
											customColor: customOverlayColor,
											defaultColor: overlayColor
										},
										changeColor: setOverlayColor
									}] : [])
								]}
							/>
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
					</Fragment>
				)}
			</InspectorControls>
		);
	}
}
