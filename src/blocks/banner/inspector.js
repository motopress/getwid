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

/**
* WordPress dependencies
*/
const { Component, Fragment } = wp.element;
const { InspectorControls, MediaPlaceholder, MediaUpload, URLInput } = wp.blockEditor || wp.editor;
const { Button, BaseControl, PanelBody, RangeControl, TextControl, SelectControl, CheckboxControl } = wp.components;

/**
 * Module Constants
 */
const ALLOWED_MEDIA_TYPES = [ 'image', 'video' ];

/**
* Create an Inspector Controls
*/
export default class Inspector extends Component {

	constructor() {
		super(...arguments);

		this.onSetLinkRel = this.onSetLinkRel.bind( this );
		this.changeState  = this.changeState .bind( this );

		this.state = {
			tabName: 'general'
		};
	}

	changeState(param, value) {
		if (typeof param == 'object') {
			this.setState(param);
		} else if (typeof param == 'string') {
			this.setState({[param]: value});
		}
	}

    onSetLinkRel( value ) {
        this.props.setAttributes( { rel: value } );
    }

    render() {

		const { link, backgroundOpacity, blockAnimation, textAnimation, rel } = this.props.attributes;
		const { setAttributes, setBackgroundColor, setTextColor, backgroundColor, textColor, customBackgroundColor, customTextColor } = this.props;

		const { tabName } = this.state;
		const { changeState } = this;

		return (
			<InspectorControls>
				<GetwidCustomTabsControl
					state={tabName}
					stateName={'tabName'}
					onChangeTab={changeState}
					tabs = {[ 'general', 'style', 'advanced' ]}
				/>

				{ tabName === 'general' && (
					<Fragment>
						{ this.renderGeneralSettings() }
					</Fragment>
				) }

				{ tabName === 'style' && (
					<Fragment>
						<PanelBody>
							<RangeControl
								label={__( 'Overlay Opacity', 'getwid' )}
								value={backgroundOpacity}
								onChange={backgroundOpacity => setAttributes({ backgroundOpacity })}
								min={0}
								max={100}
								step={5}
							/>
							<GetwidCustomColorPalette
								colorSettings={[{
										title: __( 'Text Color', 'getwid' ),
										colors: {
											customColor: customTextColor,
											defaultColor: textColor
										},
										changeColor: setTextColor
									}, {
										title: __( 'Overlay Color', 'getwid' ),
										colors: {
											customColor: customBackgroundColor,
											defaultColor: backgroundColor
										},
										changeColor: setBackgroundColor
									}
								]}
							/>
						</PanelBody>
					</Fragment>
				) }

				{ tabName === 'advanced' && (
					<PanelBody title={__( 'Animation', 'getwid' )} initialOpen={true}>
						<SelectControl
							label={__('Block Animation', 'getwid')}
							value={blockAnimation}
							onChange={blockAnimation => setAttributes({blockAnimation})}
							options={[
								{ value: 'none'  , label: __( 'None'  , 'getwid' ) },
								{ value: 'style1', label: __( 'Aries' , 'getwid' ) },
								{ value: 'style2', label: __( 'Taurus', 'getwid' ) },
								{ value: 'style3', label: __( 'Gemini', 'getwid' ) },
								{ value: 'style4', label: __( 'Cancer', 'getwid' ) },
								{ value: 'style5', label: __( 'Leo'   , 'getwid' ) },
								{ value: 'style6', label: __( 'Virgo' , 'getwid' ) }
							]}
						/>
						<SelectControl
							label={__( 'Text Animation', 'getwid' )}
							value={textAnimation}
							onChange={textAnimation => setAttributes( { textAnimation } )}
							options={[
								{ value: 'none'            , label: __( 'None'         , 'getwid' ) },
								{ value: 'opacity'         , label: __( 'Fade In'      , 'getwid' ) },
								{ value: 'opacity-top'     , label: __( 'Fade In Up'   , 'getwid' ) },
								{ value: 'opacity-bottom'  , label: __( 'Fade In Down' , 'getwid' ) },
								{ value: 'opacity-left'    , label: __( 'Fade In Left' , 'getwid' ) },
								{ value: 'opacity-right'   , label: __( 'Fade In Right', 'getwid' ) },
								{ value: 'opacity-zoom-in' , label: __( 'Zoom In'      , 'getwid' ) },
								{ value: 'opacity-zoom-out', label: __( 'Zoom Out'     , 'getwid' ) }
							]}
						/>
						<BaseControl
							className='getwid-editor-url-input'
							label={__( 'Link', 'getwid' )}
						>
							<URLInput
								autoFocus={false}
								value={link}
								onChange={link => setAttributes({ link })}
								__nextHasNoMarginBottom
							/>
						</BaseControl>

						<TextControl
							label={ __( 'Link Rel', 'getwid' ) }
							value={ rel || '' }
							onChange={ this.onSetLinkRel }
						/>
					</PanelBody>
				) }
			</InspectorControls>
		);
	}

	renderGeneralSettings() {

		const onChangeImageSize = imageSize => {
			if ( typeof imgObj != 'undefined' ) {
				setAttributes( {
					imageSize
				} );
				changeImageSize( imgObj, imageSize );
			}
		};

		const { imageSize, id, url, type, minHeight, contentMaxWidth, verticalAlign, horizontalAlign } = this.props.attributes;
		const { changeImageSize, setAttributes, imgObj, onSelectMedia } = this.props;

		return (
			<PanelBody title={__( 'Settings', 'getwid' )} initialOpen={true}>
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
								{ (!!url && type != 'video' ) && (
										<div
											onClick={ open }
											className="getwid-background-image-wrapper"
										>
												<img src={url} />
										</div>
									)
								}

								{ (!!url && type == 'video' ) && (
									<Fragment>
										<video controls>
											<source src={url} type="video/mp4"/>
											<span>{__('Your browser does not support the video tag.', 'getwid')}</span>
										</video>
									</Fragment>
								)}

								<Button
									isPrimary
									onClick={ open }
								>
									{ (type == 'image' ) && (
										<Fragment>
											{!id && __('Select Image', 'getwid')}
											{!!id && __('Replace Image', 'getwid')}
										</Fragment>
									)}

									{ (type == 'video' ) && (
										<Fragment>
											{!id && __('Select Video', 'getwid')}
											{!!id && __('Replace Video', 'getwid')}
										</Fragment>
									)}

								</Button>

							</BaseControl>
						) }
					/>
				)}


				{ (imgObj && type == 'image') && (
					<SelectControl
						label={__( 'Image Size', 'getwid' )}
						help={__( 'For images from Media Library only.', 'getwid' )}
						value={imageSize}
						onChange={onChangeImageSize}
						options={Getwid.settings.image_sizes}
					/>
				) }

				<SelectControl
					label={__( 'Text Horizontal Alignment', 'getwid' )}
					value={horizontalAlign ? horizontalAlign : 'center'}
					onChange={horizontalAlign => setAttributes( { horizontalAlign } )}
					options={[
						{value: 'left'  , label: __( 'Left', 'getwid'   )},
						{value: 'center', label: __( 'Center', 'getwid' )},
						{value: 'right' , label: __( 'Right', 'getwid'  )}
					]}
				/>
				<SelectControl
					label={__( 'Text Vertical Alignment', 'getwid' )}
					value={verticalAlign ? verticalAlign : 'center'}
					onChange={verticalAlign => setAttributes({verticalAlign})}
					options={[
						{ value: 'top'   , label: __( 'Top'   , 'getwid' ) },
						{ value: 'center', label: __( 'Middle', 'getwid' ) },
						{ value: 'bottom', label: __( 'Bottom', 'getwid' ) }
					]}
				/>
				<GetwidStyleLengthControl
					label={__( 'Block Height', 'getwid' )}
					value={minHeight}
					units={[
						{ label: 'px', value: 'px' },
						{ label: 'vh', value: 'vh' },
						{ label: 'vw', value: 'vw' },
						{ label: '%' , value: '%'  }
					]}
					onChange={ minHeight => setAttributes( { minHeight } ) }
				/>
				<GetwidStyleLengthControl
					label={__( 'Text Width', 'getwid' )}
					value={contentMaxWidth}
					units={[
						{ label: 'px', value: 'px' },
						{ label: 'vh', value: 'vh' },
						{ label: 'vw', value: 'vw' },
						{ label: '%' , value: '%'  }
					]}
					onChange={ contentMaxWidth => setAttributes( { contentMaxWidth } ) }
				/>
			</PanelBody>
		);
	}
}