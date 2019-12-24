/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import classnames from 'classnames';
import { pick, isEqual, has, get, set, unset } from 'lodash';

/**
* Internal dependencies
*/
import Dividers from './sub-components/dividers';
import BackgroundVideo from './sub-components/video';
import GetwidCustomColorPalette from 'GetwidControls/custom-color-palette';

import { BackgroundSliderEdit as BackgroundSlider } from './sub-components/slider';

import Inspector from './inspector';

/**
* WordPress dependencies
*/
const { Component, Fragment } = wp.element;
const { Button, IconButton, SelectControl, ButtonGroup, BaseControl, Dashicon, Tooltip, Toolbar, DropdownMenu, Path, SVG } = wp.components;
const { InnerBlocks, withColors, BlockControls, BlockAlignmentToolbar, MediaPlaceholder, MediaUpload } = wp.blockEditor || wp.editor;
const { compose } = wp.compose;

const { jQuery: $ } = window;

/**
* Module Constants
*/
const TEMPLATE = [];
const baseClass = 'wp-block-getwid-section';
const ALLOWED_IMAGE_MEDIA_TYPES = [ 'image' ];

const paddingSizes = {
	'small' : '10px',
	'medium' : '25px',
	'normal' : '40px',
	'large' : '60px'
};

/**
* Create an Component
*/
class Edit extends Component {

	constructor(props) {
		super( props );

		this.videoRef = null;
		this.videoButtonRef = null;
		this.draggies = {};

		this.state = {
			draggablesObj: {},
			showRullers: true,
			videoPlayState: 'paused',
			videoMuteState: true,

			isLockedPaddingsOnDesktop: false,
			isLockedPaddingsOntablet : false,
			isLockedPaddingsOnMobile : false,

			isLockedMarginsOnDesktop: false,
			isLockedMarginsOnTablet : false,
			isLockedMarginsOnMobile : false
		};

		this.playBackgroundVideo  = this.playBackgroundVideo .bind( this );
		this.onBackgroundVideoEnd = this.onBackgroundVideoEnd.bind( this );
		this.muteBackgroundVideo  = this.muteBackgroundVideo .bind( this );

		this.changeState  = this.changeState .bind( this );
		this.initDraggies = this.initDraggies.bind( this );

		this.initDragRullers = this.initDragRullers.bind( this );		
	}

	changeState(param, value) {
		this.setState({ [ param ]: value });
	}

	render() {

		const { layout, align, minHeight, gapSize, anchor, customBackgroundColor } = this.props.attributes;
		const { resetMinHeightTablet, resetMinHeightMobile, sliderImages, backgroundVideoUrl } = this.props.attributes;
		const { backgroundVideoControlsPosition, foregroundOpacity, foregroundColor, foregroundFilter, dividersBringTop } = this.props.attributes;
		
		const { contentMaxWidth, contentMaxWidthPreset, entranceAnimation, entranceAnimationDuration, entranceAnimationDelay } = this.props.attributes;
		const { backgroundImage, backgroundImagePosition, backgroundImageAttachment, backgroundImageRepeat, backgroundImageSize } = this.props.attributes;
		const { paddingTopValue, paddingBottomValue, paddingLeftValue, paddingRightValue, marginTopValue, marginBottomValue, marginLeftValue, marginRightValue } = this.props.attributes;
		
		const { paddingTop, paddingRight, paddingBottom, paddingLeft } = this.props.attributes;
		const { paddingTopTablet, paddingRightTablet, paddingBottomTablet, paddingLeftTablet } = this.props.attributes;
		const { paddingTopMobile, paddingRightMobile, paddingBottomMobile, paddingLeftMobile } = this.props.attributes;

		const { marginTop, marginRight, marginBottom, marginLeft } = this.props.attributes;
		const { marginTopTablet, marginRightTablet, marginBottomTablet, marginLeftTablet } = this.props.attributes;
		const { verticalAlign, verticalAlignTablet, verticalAlignMobile, horizontalAlign, horizontalAlignTablet, horizontalAlignMobile } = this.props.attributes;

		const { marginTopMobile, marginRightMobile, marginBottomMobile, marginLeftMobile } = this.props.attributes;
		const { className,backgroundColor,setBackgroundColor, prepareGradientStyle, prepareBackgroundImageStyles, setAttributes, isSelected } = this.props;

		const { showRullers } = this.state;		
		const { isLockedPaddingsOnDesktop, isLockedPaddingsOntablet, isLockedPaddingsOnMobile } = this.state;
		const { isLockedMarginsOnDesktop , isLockedMarginsOnTablet , isLockedMarginsOnMobile  } = this.state;

		const changeState = this.changeState;

		const { clientId } = this.props;

		const sectionStyle = {
			...(marginTop === 'custom' ? { marginTop: marginTopValue } : []),
			...(marginBottom === 'custom' ? { marginBottom: marginBottomValue } : [])
		};

        const wrapperStyle = {
			minHeight: minHeight,
			...(marginLeft  === 'custom' ? { marginLeft: marginLeftValue   } : []),
			...(marginRight === 'custom' ? { marginRight: marginRightValue } : []),
			...(paddingTop  === 'custom' ? { paddingTop: paddingTopValue   } : []),

			...(paddingBottom === 'custom' ? { paddingBottom: paddingBottomValue } : []),
			...(paddingLeft   === 'custom' ? { paddingLeft  : paddingLeftValue   } : []),
			...(paddingRight  === 'custom' ? { paddingRight : paddingRightValue  } : [])
        };

		const wrapperClasses = classnames( `${baseClass}__wrapper`, {
				[ `getwid-padding-top-${paddingTop}`       ]: paddingTop    !== 'custom' && paddingTop    !== '',
				[ `getwid-padding-bottom-${paddingBottom}` ]: paddingBottom !== 'custom' && paddingBottom !== '',
				[ `getwid-padding-left-${paddingLeft}`     ]: paddingLeft   !== 'custom' && paddingLeft   !== '',
				[ `getwid-padding-right-${paddingRight}`   ]: paddingRight  !== 'custom' && paddingRight  !== '',

				[ `getwid-padding-tablet-top-${paddingTopTablet}`      ]: paddingTopTablet    !== '',
				[ `getwid-padding-tablet-bottom-${paddingBottomTablet}`]: paddingBottomTablet !== '',
				[ `getwid-padding-tablet-left-${paddingLeftTablet}`    ]: paddingLeftTablet   !== '',
				[ `getwid-padding-tablet-right-${paddingRightTablet}`  ]: paddingRightTablet  !== '',

				[ `getwid-padding-mobile-top-${paddingTopMobile}`      ]: paddingTopMobile    !== '',
				[ `getwid-padding-mobile-bottom-${paddingBottomMobile}`]: paddingBottomMobile !== '',
				[ `getwid-padding-mobile-left-${paddingLeftMobile}`    ]: paddingLeftMobile   !== '',
				[ `getwid-padding-mobile-right-${paddingRightMobile}`  ]: paddingRightMobile  !== '',

				[ `getwid-margin-left-${marginLeft}`   ]: marginLeft  !== 'custom' && marginLeft  !== '',
				[ `getwid-margin-right-${marginRight}` ]: marginRight !== 'custom' && marginRight !== '',

				[ `getwid-margin-tablet-left-${marginLeftTablet}`  ]: marginLeftTablet !== '',
				[ `getwid-margin-tablet-right-${marginRightTablet}`]: marginRightTablet !== '',

				[ `getwid-margin-mobile-left-${marginLeftMobile}`  ]: marginLeftMobile !== '',
				[ `getwid-margin-mobile-right-${marginRightMobile}`]: marginRightMobile !== '',

				[ `getwid-align-items-${verticalAlign}`             ]: verticalAlign       !== 'center',
				[ `getwid-align-items-tablet-${verticalAlignTablet}`]: verticalAlignTablet !== '',
				[ `getwid-align-items-mobile-${verticalAlignMobile}`]: verticalAlignMobile !== '',

				[ `getwid-justify-content-${horizontalAlign}`             ]: horizontalAlign       !== 'center',
				[ `getwid-justify-content-tablet-${horizontalAlignTablet}`]: horizontalAlignTablet !== '',
				[ `getwid-justify-content-mobile-${horizontalAlignMobile}`]: horizontalAlignMobile !== '',

				'getwid-reset-min-height-tablet': resetMinHeightTablet !== false,
				'getwid-reset-min-height-mobile': resetMinHeightMobile !== false
			}
		);

		const backgroundStyle = {
			backgroundColor: backgroundColor.color ? backgroundColor.color : customBackgroundColor,
			...prepareGradientStyle( 'background', this.props ),
			...prepareBackgroundImageStyles( 'background', this.props )
		};

		const backgroundClass = classnames(`${baseClass}__background`, {
			'has-background': backgroundColor.color,
			[ backgroundColor.class ]: backgroundColor.class,
		});

		const foregroundStyle = {
			opacity: foregroundOpacity !== undefined ? foregroundOpacity / 100 : undefined,
			backgroundColor: foregroundColor,
			...prepareGradientStyle( 'foreground', this.props ),
			...prepareBackgroundImageStyles( 'foreground', this.props ),
			mixBlendMode: foregroundFilter
		};

		const innerWrapperStyle = {
			maxWidth: (contentMaxWidth && contentMaxWidthPreset === 'custom') ? `${contentMaxWidth}px` : undefined
		};

		const wowData = !!entranceAnimation ? {
			'data-wow-duration':  entranceAnimationDuration !== undefined ? entranceAnimationDuration : '2000ms',
			'data-wow-delay'   : entranceAnimationDelay     !== undefined ? entranceAnimationDelay    : '500ms'
		} : {};

		const sectionClasses = classnames(className,
			`${baseClass}-${clientId}`,
			{
				[ `has-inner-blocks-gap-${gapSize}` ]: gapSize   !== undefined && gapSize   !== '',
				[ `getwid-margin-top-${marginTop}`  ]: marginTop !== 'custom'  && marginTop !== '',
				[ `getwid-anim ${entranceAnimation}`]: !!entranceAnimation,

				[ `getwid-margin-bottom-${marginBottom}`       ]: marginBottom    !== 'custom' && marginBottom    !== '',
				[ `getwid-margin-tablet-top-${marginTopTablet}`]: marginTopTablet !== 'custom' && marginTopTablet !== '',

				[ `getwid-margin-tablet-bottom-${marginBottomTablet}`]: marginBottomTablet !== 'custom' && marginBottomTablet !== '',
				[ `getwid-margin-mobile-top-${marginTopMobile}`      ]: marginTopMobile    !== 'custom' && marginTopMobile    !== '',
				[ `getwid-margin-mobile-bottom-${marginBottomMobile}`]: marginBottomMobile !== 'custom' && marginBottomMobile !== '',

				'getwid-section-content-full-width'  : contentMaxWidthPreset === 'full',
				'getwid-section-content-custom-width': contentMaxWidthPreset === 'custom',

				'drag-paddings-off': isLockedPaddingsOnDesktop,
				'drag-margins-off' : isLockedMarginsOnDesktop
			}
		);

		const id = anchor ? anchor : undefined;

		const templates = [
			{
				'title': __('Full width 1', 'getwid'),
				'icon': <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 64 64" width="64" height="64"><rect y="45" fill="#505050" width="64" height="3"/><rect y="52" fill="#505050" width="64" height="2"/><rect y="57" fill="#505050" width="64" height="2"/><rect y="62" fill="#505050" width="40" height="2"/><path fill="#505050" d="M62,2v36H2V2H62 M64,0H0v40h64V0L64,0z"/><line fill="none" stroke="#505050" stroke-miterlimit="10" x1="1.2" y1="31.4" x2="2.7" y2="30.1"/><line fill="none" stroke="#505050" stroke-miterlimit="10" stroke-dasharray="4.5513,2.2756" x1="4.4" y1="28.6" x2="19.1" y2="16"/><polyline fill="none" stroke="#505050" stroke-miterlimit="10" points="20,15.3 21.5,14 23,15.3 "/><line fill="none" stroke="#505050" stroke-miterlimit="10" stroke-dasharray="4.0432,2.0216" x1="24.5" y1="16.6" x2="37.6" y2="27.8"/><polyline fill="none" stroke="#505050" stroke-miterlimit="10" points="38.4,28.5 39.9,29.8 41.4,28.5 "/><line fill="none" stroke="#505050" stroke-miterlimit="10" stroke-dasharray="3.2164,1.6082" x1="42.6" y1="27.4" x2="45.7" y2="24.8"/><polyline fill="none" stroke="#505050" stroke-miterlimit="10" points="46.3,24.3 47.8,23 49.3,24.3 "/><line fill="none" stroke="#505050" stroke-miterlimit="10" stroke-dasharray="4.5793,2.2897" x1="51" y1="25.8" x2="60.6" y2="34"/><line fill="none" stroke="#505050" stroke-miterlimit="10" x1="61.5" y1="34.7" x2="63" y2="36"/></svg>,
				'layout': () => {
					setAttributes( {
						layout : true,
						align: 'full'
					} );
				}
			},
			{
				'title': __('full width 2', 'getwid'),
				'icon': <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 64 64" width="64" height="64"><rect y="45" fill="#505050" width="64" height="3"/><rect y="52" fill="#505050" width="64" height="2"/><rect y="57" fill="#505050" width="64" height="2"/><rect y="62" fill="#505050" width="40" height="2"/><path fill="#505050" d="M62,2v36H2V2H62 M64,0H0v40h64V0L64,0z"/><line fill="none" stroke="#505050" stroke-miterlimit="10" x1="1.2" y1="31.4" x2="2.7" y2="30.1"/><line fill="none" stroke="#505050" stroke-miterlimit="10" stroke-dasharray="4.5513,2.2756" x1="4.4" y1="28.6" x2="19.1" y2="16"/><polyline fill="none" stroke="#505050" stroke-miterlimit="10" points="20,15.3 21.5,14 23,15.3 "/><line fill="none" stroke="#505050" stroke-miterlimit="10" stroke-dasharray="4.0432,2.0216" x1="24.5" y1="16.6" x2="37.6" y2="27.8"/><polyline fill="none" stroke="#505050" stroke-miterlimit="10" points="38.4,28.5 39.9,29.8 41.4,28.5 "/><line fill="none" stroke="#505050" stroke-miterlimit="10" stroke-dasharray="3.2164,1.6082" x1="42.6" y1="27.4" x2="45.7" y2="24.8"/><polyline fill="none" stroke="#505050" stroke-miterlimit="10" points="46.3,24.3 47.8,23 49.3,24.3 "/><line fill="none" stroke="#505050" stroke-miterlimit="10" stroke-dasharray="4.5793,2.2897" x1="51" y1="25.8" x2="60.6" y2="34"/><line fill="none" stroke="#505050" stroke-miterlimit="10" x1="61.5" y1="34.7" x2="63" y2="36"/></svg>,
				'layout': () => {
					setAttributes( {
						layout : true,
						align: 'full',
						contentMaxWidthPreset: 'full'					
					} );
				}
			},
			{
				'title': __('Full screen', 'getwid'),
				'icon': <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 64 64" width="64" height="64"><rect y="45" fill="#505050" width="64" height="3"/><rect y="52" fill="#505050" width="64" height="2"/><rect y="57" fill="#505050" width="64" height="2"/><rect y="62" fill="#505050" width="40" height="2"/><path fill="#505050" d="M62,2v36H2V2H62 M64,0H0v40h64V0L64,0z"/><line fill="none" stroke="#505050" stroke-miterlimit="10" x1="1.2" y1="31.4" x2="2.7" y2="30.1"/><line fill="none" stroke="#505050" stroke-miterlimit="10" stroke-dasharray="4.5513,2.2756" x1="4.4" y1="28.6" x2="19.1" y2="16"/><polyline fill="none" stroke="#505050" stroke-miterlimit="10" points="20,15.3 21.5,14 23,15.3 "/><line fill="none" stroke="#505050" stroke-miterlimit="10" stroke-dasharray="4.0432,2.0216" x1="24.5" y1="16.6" x2="37.6" y2="27.8"/><polyline fill="none" stroke="#505050" stroke-miterlimit="10" points="38.4,28.5 39.9,29.8 41.4,28.5 "/><line fill="none" stroke="#505050" stroke-miterlimit="10" stroke-dasharray="3.2164,1.6082" x1="42.6" y1="27.4" x2="45.7" y2="24.8"/><polyline fill="none" stroke="#505050" stroke-miterlimit="10" points="46.3,24.3 47.8,23 49.3,24.3 "/><line fill="none" stroke="#505050" stroke-miterlimit="10" stroke-dasharray="4.5793,2.2897" x1="51" y1="25.8" x2="60.6" y2="34"/><line fill="none" stroke="#505050" stroke-miterlimit="10" x1="61.5" y1="34.7" x2="63" y2="36"/></svg>,
				'layout': () => {
					setAttributes( {
						layout : true,
						align: 'full',
						minHeight: '100vh'						
					} );
				}
			},
		];

		const verticalAlignControls = [ 'flex-start', 'center', 'flex-end' ];
		const verticalAligns = {
			'flex-start': {
				title: __( 'Top', 'getwid' ),	
				icon: <SVG xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><Path fill="none" d="M0 0h24v24H0V0z" /><Path d="M8 11h3v10h2V11h3l-4-4-4 4zM4 3v2h16V3H4z" /></SVG>
			},
			'center': {
				title: __( 'Middle', 'getwid' ),
				icon: <SVG xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><Path fill="none" d="M0 0h24v24H0V0z" /><Path d="M8 19h3v4h2v-4h3l-4-4-4 4zm8-14h-3V1h-2v4H8l4 4 4-4zM4 11v2h16v-2H4z"/></SVG>
			},
			'flex-end': {
				title: __( 'Bottom', 'getwid' ),
				icon: <SVG xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><Path fill="none" d="M0 0h24v24H0V0z" /><Path d="M16 13h-3V3h-2v10H8l4 4 4-4zM4 19v2h16v-2H4z" /></SVG>
			}
		};

		const horizontalAlignControls = [ 'flex-start', 'center', 'flex-end' ];
		const horizontalAligns = {
			'flex-start': {
				title: __( 'Left', 'getwid' ),	
				icon: 'editor-alignleft'
			},
			'center': {
				title: __( 'Center', 'getwid' ),
				icon: 'editor-aligncenter'
			},
			'flex-end': {
				title: __( 'Right', 'getwid' ),
				icon: 'editor-alignright'
			}
		};

		const marginSizes = {
			'small' : '10px',
			'medium' : '25px',
			'normal' : '40px',
			'large' : '60px'
		};

		const paddingSizes = {
			'small' : '10px',
			'medium' : '25px',
			'normal' : '40px',
			'large' : '60px'
		};
		
		// console.log( paddingTop );
		// console.log( paddingTopValue );

		return (
			<Fragment>
				{layout == false ? (
					<div className='components-placeholder block-editor-inner-blocks__template-picker has-many-options'>
						<div className='components-placeholder__label'>
							<Dashicon icon='layout' />{__( 'Choose Section Layout', 'getwid' )}
						</div>
						<div className='components-placeholder__instructions'>{__('Select a layout to start with, or make one yourself.', 'getwid')}</div>
						<div className='components-placeholder__fieldset'>
							<ul className='block-editor-inner-blocks__template-picker-options'>
								{
								templates.map((key, index) => {
									return (
										<li>
											<Tooltip text={key.title}>
												<Button
													className='components-icon-button block-editor-inner-blocks__template-picker-option is-button is-default is-large'
													key={ index }
													onClick={
														() => {
															key.layout();
														}
													}
												>
													{key.icon}
												</Button>
											</Tooltip>
										</li>
									);
								})
							}
							</ul>
							<div class='block-editor-inner-blocks__template-picker-skip'>
								<Button
									className='components-button is-link'
									onClick={
										() => {
											setAttributes({ layout : true });
										}
									}
								>
									{__( 'Skip', 'getwid' )}								
								</Button>								
							</div>
						</div>
					</div>
				) : (
					<Fragment>
						<BlockControls>
							<BlockAlignmentToolbar
								value={align}
								isCollapsed={false}
								controls={[ 'wide', 'full' ]}
								onChange={ value => setAttributes({ align: value }) }
							/>
							<DropdownMenu
								icon={verticalAligns[ verticalAlign ].icon}
								hasArrowIndicator={true}
								className='components-toolbar'
								label={__( 'Vertical Alignment', 'getwid' )}
								controls={
									verticalAlignControls.map( control => {
										return {
											...verticalAligns[ control ],
											isActive: verticalAlign === control,
											onClick: () => {
												setAttributes({ verticalAlign: control });
											}
										};
									} )
								}
							/>	
							<DropdownMenu
								icon={horizontalAligns[ horizontalAlign ].icon}
								hasArrowIndicator={true}
								className='components-toolbar'
								label={__( 'Horizontal Alignment', 'getwid' )}
								controls={
									horizontalAlignControls.map( control => {
										return {
											...horizontalAligns[ control ],
											isActive: horizontalAlign === control,
											onClick: ()=>{
												setAttributes({ horizontalAlign: control });
											},
										};
									} )
								}
							/>	

							<DropdownMenu
								icon='admin-customizer'
								className='components-toolbar'
								label={__( 'Background Color', 'getwid' )}
								popoverProps={{
									onClick: event => {
										event.stopPropagation();
									},
									className: 'components-getwid-toolbar-popup-wrapper',
									focusOnMount: 'container',
									position: 'top center'
								}}
							>
								{ ({ onClose }) => (
									<Fragment>
										<div class="components-getwid-toolbar-popup-wrapper-close small-icon">
											<IconButton
												icon="no-alt"
												className="alignright"
												onClick={ onClose }											
											/>
										</div>

										<GetwidCustomColorPalette							
											colorSettings={[{
												title: __( 'Background Color', 'getwid' ),
												colors: {
													customColor : customBackgroundColor,
													defaultColor: backgroundColor
												},										
												changeColor: setBackgroundColor
											}]}									
										/>
									</Fragment>
								) }
							</DropdownMenu>

							<DropdownMenu
								icon='format-image'
								className='components-toolbar'
								label={__( 'Background Image', 'getwid' )}
								popoverProps={{
									onClick: event => {
										event.stopPropagation();
									},
									className: 'components-getwid-toolbar-popup-wrapper',
									focusOnMount: 'container',
									position: 'top center'
								}}						
							>
								{ ({ onClose }) => (
									<Fragment>
										<div class="components-getwid-toolbar-popup-wrapper-close small-icon">
											<IconButton
												icon="no-alt"
												className="alignright"
												onClick={ onClose }											
											/>
										</div>

										{ ! backgroundImage && (
											<MediaPlaceholder
												icon='format-image'
												labels={{
													title: __( 'Image', 'getwid' ),
													instructions: __( 'Upload an image file, pick one from your media library, or add one with a URL.', 'getwid' )
												}}
												onSelect={backgroundImage => {												
													setAttributes({
														backgroundImage: backgroundImage !== undefined ? pick( backgroundImage, ['alt', 'id', 'url'] ) : {}
													});
													this.setState( () => ({ imagePopover: false }) );
												} }
												accept='image/*'
												allowedTypes={ALLOWED_IMAGE_MEDIA_TYPES}
											/>
										)}

										{ !!backgroundImage && (
											<MediaUpload
												onSelect={backgroundImage => {
													setAttributes({
														backgroundImage: backgroundImage !== undefined ? pick( backgroundImage, [ 'alt', 'id', 'url' ] ) : {}
													});
												}}
												allowedTypes={ALLOWED_IMAGE_MEDIA_TYPES}
												value={backgroundImage !== undefined ? backgroundImage.id : ''}
												render={({ open }) => (
													<BaseControl>
														{ !!backgroundImage.url &&
															<div
																onClick={open}
																className='getwid-background-image-wrapper'
															>
																	<img src={backgroundImage.url}/>
															</div>
														}

														<ButtonGroup>
															<Button
																isPrimary
																onClick={open}
															>
																{!backgroundImage.id  && __( 'Select Image', 'getwid' )}
																{!!backgroundImage.id && __( 'Replace Image', 'getwid' )}
															</Button>

															{!!backgroundImage.id && (
																<Button
																	isDefault
																	onClick={() => {
																		setAttributes({ backgroundImage: undefined })
																	}}
																>
																	{__( 'Remove Image', 'getwid' )}
																</Button>
															)}
														</ButtonGroup>
													</BaseControl>
												) }
											/>
										)}

										{!!backgroundImage && (					
											<Fragment>											
												<SelectControl
													label={__( 'Position', 'getwid' )}
													value={backgroundImagePosition !== undefined ? backgroundImagePosition : ''}
													onChange={backgroundImagePosition => setAttributes({ backgroundImagePosition })}
													options={[
														/*Center*/
														{ value: ''             , label: __( 'Default'	    , 'getwid' ) },
														{ value: 'top left'     , label: __( 'Top Left'	    , 'getwid' ) },
														{ value: 'top center'   , label: __( 'Top Center'   , 'getwid' ) },
														{ value: 'top right'    , label: __( 'Top Right'    , 'getwid' ) },
														{ value: 'center left'  , label: __( 'Center Left ' , 'getwid' ) },
														{ value: 'center center', label: __( 'Center Center', 'getwid' ) },
														{ value: 'center right' , label: __( 'Center Right' , 'getwid' ) },
														{ value: 'bottom left'  , label: __( 'Bottom Left'  , 'getwid' ) },
														{ value: 'bottom center', label: __( 'Bottom Center', 'getwid' ) },
														{ value: 'bottom right' , label: __( 'Bottom Right' , 'getwid' ) }
													]}
												/>
												<SelectControl
													label={__( 'Attachment', 'getwid' )}
													value={backgroundImageAttachment !== undefined ? backgroundImageAttachment : ''}
													onChange={backgroundImageAttachment => setAttributes({ backgroundImageAttachment })}
													options={[
														/*Inherit*/
														{ value: ''      , label: __( 'Default', 'getwid' ) },
														{ value: 'scroll', label: __( 'Scroll' , 'getwid' ) },
														{ value: 'fixed' , label: __( 'Fixed'  , 'getwid' ) }
													]}
												/>
												<SelectControl
													label={__( 'Repeat', 'getwid' )}
													value={backgroundImageRepeat !== undefined ? backgroundImageRepeat : ''}
													onChange={backgroundImageRepeat => setAttributes({ backgroundImageRepeat })}
													options={[
														/*Inherit*/
														{ value: ''         , label: __( 'Default'  , 'getwid' ) },
														{ value: 'no-repeat', label: __( 'No Repeat', 'getwid' ) },
														{ value: 'repeat'   , label: __( 'Repeat'   , 'getwid' ) },
														{ value: 'repeat-x' , label: __( 'Repeat X' , 'getwid' ) },
														{ value: 'repeat-y' , label: __( 'Repeat Y' , 'getwid' ) },
														{ value: 'space'    , label: __( 'Space'    , 'getwid' ) },
														{ value: 'round'    , label: __( 'Round'    , 'getwid' ) }
													]}
												/>
												<SelectControl
													label={__('Size', 'getwid')}
													value={backgroundImageSize !== undefined ? backgroundImageSize : ''}
													onChange={backgroundImageSize => setAttributes({ backgroundImageSize })}
													options={[
														/*Cover*/
														{ value: ''       , label: __( 'Cover'  , 'getwid' ) },
														{ value: 'contain', label: __( 'Contain', 'getwid' ) },
														{ value: 'auto'   , label: __( 'Auto'   , 'getwid' ) }
													]}
												/>
											</Fragment>				
										)}
									</Fragment>
								) }
							</DropdownMenu>

							{(marginTop || paddingTop || marginBottom || paddingBottom) && (
								<Toolbar controls={[
									{
										icon: 'visibility',
										title: __( 'Show rullers', 'getwid' ),
										isActive: showRullers,
										onClick: () => {
											this.setState({ showRullers: !showRullers });
										}
									}
								]}/>
							)}
						</BlockControls>

						<Inspector {...{
							...this.props,
							...{ isLockedPaddingsOnDesktop, isLockedPaddingsOntablet, isLockedPaddingsOnMobile },
							...{ isLockedMarginsOnDesktop, isLockedMarginsOnTablet, isLockedMarginsOnMobile },
							baseClass,
							changeState
						}} key='inspector'/>
						<div
							id={id}
							className={sectionClasses}
							style={sectionStyle}
							{...wowData}
						>
							{/* Margin Top */}
							{ (showRullers && isSelected && marginTop && marginTop != 'none') && (
								<div className={`${baseClass}__top-margin-area`} style={{
									right: (marginRight == 'custom' ? marginRightValue:
										(marginRight && marginRight !='none' ? paddingSizes[ marginRight ] : undefined)
									),
									left: (marginLeft == 'custom' ? marginLeftValue:
										(marginLeft && marginLeft !='none' ? paddingSizes[ marginLeft ] : undefined)
									),
									height: (marginTop == 'custom' ? marginTopValue :
										(marginTop && marginTop !='none' ? marginSizes[ marginTop ] : undefined )
									)
								}}>
									<Fragment>
										<div className={`${baseClass}__top-margin-label`}>{marginTop == 'custom' ? marginTopValue : marginSizes[ marginTop ]}</div>
										<div className={`${baseClass}__top-margin-drag-zone`}></div>
									</Fragment>
								</div>
							)}

							{/* Margin Right */}
							{ (showRullers && isSelected && marginRight && marginRight != 'none') && (
								<div className={`${baseClass}__right-margin-area`} style={{
									width: (marginRight == 'custom' ? marginRightValue :
										(marginRight && marginRight !='none' ? marginSizes[ marginRight ] : undefined )
									)
								}}>
									<Fragment>
										<div className={`${baseClass}__right-margin-label`}>{marginRight == 'custom' ? marginRightValue : marginSizes[ marginRight ]}</div>
										<div className={`${baseClass}__right-margin-drag-zone`}></div>
									</Fragment>
								</div>
							)}

							{/* Margin Bottom */}
							{ (showRullers && isSelected && marginBottom && marginBottom != 'none') && (
								<div className={`${baseClass}__bottom-margin-area`} style={{
									right: (marginRight == 'custom' ? marginRightValue:
										(marginRight && marginRight !='none' ? paddingSizes[ marginRight ] : undefined)
									),
									left: (marginLeft == 'custom' ? marginLeftValue:
										(marginLeft && marginLeft !='none' ? paddingSizes[ marginLeft ] : undefined)
									),
									height: (marginBottom == 'custom' ? marginBottomValue :
										(marginBottom && marginBottom !='none' ? marginSizes[ marginBottom ] : undefined )
									)
								}}>
									<Fragment>
										<div className={`${baseClass}__bottom-margin-label`}>{marginBottom == 'custom' ? marginBottomValue : marginSizes[ marginBottom ]}</div>
										<div className={`${baseClass}__bottom-margin-drag-zone`}></div>
									</Fragment>
								</div>
							)}

							{/* Margin Left */}
							{ (showRullers && isSelected && marginLeft && marginLeft != 'none') && (
								<div className={`${baseClass}__left-margin-area`} style={{
									width: (marginLeft == 'custom' ? marginLeftValue :
										(marginLeft && marginLeft !='none' ? marginSizes[ marginLeft ] : undefined)
									)
								}}>
									<Fragment>
										<div className={`${baseClass}__left-margin-label`}>{marginLeft == 'custom' ? marginLeftValue : marginSizes[ marginLeft ]} <Dashicon icon='unlock' /></div>
										<div className={`${baseClass}__left-margin-drag-zone`}></div>
									</Fragment>
								</div>
							)}

							<div className={wrapperClasses} style={wrapperStyle}>
								<Dividers {...{...this.props, baseClass}} />
									{
										(!!backgroundVideoUrl && backgroundVideoControlsPosition !== 'none') && (
											<div
												className={
													classnames( 'getwid-background-video-controls', {
															[ `is-position-${backgroundVideoControlsPosition}` ]: backgroundVideoControlsPosition !== 'top-right'
														}
													)
												}
											>
												<button
													onClick={this.playBackgroundVideo}
													className='getwid-background-video-play'
													ref={node => this.videoButtonRef = node}
												>
													{
														this.state.videoPlayState === 'paused' &&
														<i className='getwid-icon getwid-icon-play'></i>
													}
													{
														this.state.videoPlayState === 'playing' &&
														<i className='getwid-icon getwid-icon-pause'></i>
													}
												</button>
												<button
													onClick={this.muteBackgroundVideo}
													className='getwid-background-video-mute'
												>
													{
														this.state.videoMuteState === true &&
														<i className='getwid-icon getwid-icon-mute'></i>
													}
													{
														this.state.videoMuteState === false &&
														<i className='getwid-icon getwid-icon-volume-up'></i>
													}
												</button>
											</div>
										)
									}

									<div className={classnames( `${baseClass}__inner-wrapper`, {
											[ `has-dividers-over` ]: dividersBringTop,
										})} style={innerWrapperStyle}>
										<div className={`${baseClass}__background-holder`}>
											<div className={backgroundClass} style={backgroundStyle}>
												{
													!!backgroundImage && (
														<div className={`${baseClass}__background-image-wrapper`}><img className={`${baseClass}__background-image`} src={backgroundImage.url}
															alt={backgroundImage.alt} data-id={backgroundImage.id}/></div>
													)
												}
												{
													!!sliderImages.length && (
														<div className={`${baseClass}__background-slider-wrapper`}><BackgroundSlider {...{...this.props, baseClass}}/></div>
													)													
												}
												{
													!!backgroundVideoUrl &&
													<div className={`${baseClass}__background-video-wrapper`}>
														<BackgroundVideo
															{...{...this.props, baseClass}}
															onVideoEnd={this.onBackgroundVideoEnd}
															videoAutoplay={false}
															videoMute={this.state.videoMuteState}
															videoElemRef={node => this.videoRef = node}
														/>
													</div>
												}
											</div>
											<div className={`${baseClass}__foreground`} style={foregroundStyle}></div>
										</div>
										<div className={`${baseClass}__content`}>

											<div className={`${baseClass}__inner-content`}>
												<InnerBlocks
													renderAppender={ () => (
														<InnerBlocks.ButtonBlockAppender/>
													) }
													defaultBlock={false}
													template={TEMPLATE}
													templateInsertUpdatesSelection={false}
													templateLock={false}
												/>
											</div>
										</div>
									</div>
							</div>

							{/* Padding Top */}
							{ (showRullers && isSelected && paddingTop && paddingTop != 'none') && (
								<div className={`${baseClass}__top-padding-area`} style={{
									right: (marginRight == 'custom' ? marginRightValue:
										(marginRight && marginRight !='none' ? paddingSizes[ marginRight ] : 0)
									),
									left: (marginLeft == 'custom' ? marginLeftValue:
										(marginLeft && marginLeft !='none' ? paddingSizes[ marginLeft ] : 0)
									),
									height: (paddingTop == 'custom' ? paddingTopValue :
										(paddingTop && paddingTop !='none' ? paddingSizes[ paddingTop ] : undefined )
									)
								}}>
									<Fragment>
										<div className={`${baseClass}__top-padding-label`}>{paddingTop == 'custom' ? paddingTopValue : paddingSizes[ paddingTop ]}</div>
										<div className={`${baseClass}__top-padding-drag-zone`} draggable={false}></div>
									</Fragment>
								</div>
							)}

							{/* Padding Right */}
							{ (showRullers && isSelected && paddingRight && paddingRight != 'none') && (
								<div className={`${baseClass}__right-padding-area`} style={{
									// width: (paddingRight == 'custom' ? paddingRightValue :
									// 	(paddingRight && paddingRight !='none' ? paddingSizes[ paddingRight ] : undefined)
									// ),
									left: this.getOffset( 'right' ),
									top: (paddingTop != 'none' && paddingTop ? (
											paddingTop != 'custom' ? paddingSizes[ paddingTop ] : (
												paddingTopValue ? paddingTopValue : 0
											)
										) : 0
									),
									bottom: (paddingBottom != 'none' && paddingBottom ? (
											paddingBottom != 'custom' ? paddingSizes[ paddingBottom ] : (
												paddingBottomValue ? paddingBottomValue : 0
											)
										) : 0
									),
									right: (marginRight == 'custom' ? marginRightValue :
										(marginRight && marginRight !='none' ? paddingSizes[ marginRight ] : 0)   //*********************** */
									)
								}}>
									<Fragment>
										<div className={`${baseClass}__right-padding-label`}>{paddingRight == 'custom' ? paddingRightValue : paddingSizes[ paddingRight ]}</div>
										<div className={`${baseClass}__right-padding-drag-zone`}></div>
									</Fragment>
								</div>
							)}

							{/* Padding Bottom */}
							{ (showRullers && isSelected && paddingBottom && paddingBottom != 'none') && (
								<div className={`${baseClass}__bottom-padding-area`} style={{
									right: (marginRight == 'custom' ? marginRightValue:
										(marginRight && marginRight !='none' ? paddingSizes[ marginRight ] : 0)
									),
									left: (marginLeft == 'custom' ? marginLeftValue:
										(marginLeft && marginLeft !='none' ? paddingSizes[ marginLeft ] : 0)
									),
									height: (paddingBottom == 'custom' ? paddingBottomValue :
										(paddingBottom && paddingBottom !='none' ? paddingSizes[ paddingBottom ] : undefined )
									)
								}}>
									<Fragment>
										<div className={`${baseClass}__bottom-padding-label`}>{paddingBottom == 'custom' ? paddingBottomValue : paddingSizes[ paddingBottom ]} <Dashicon icon='lock' /></div>
										<div className={`${baseClass}__bottom-padding-drag-zone`}></div>
									</Fragment>
								</div>
							)}

							{/* Padding Left */}
							{ (showRullers && isSelected && paddingLeft && paddingLeft != 'none') && (
								<div className={`${baseClass}__left-padding-area`} style={{
									// width: (paddingLeft == 'custom' ? paddingLeftValue :
									// 	(paddingLeft && paddingLeft !='none' ? paddingSizes[ paddingLeft ] : undefined)
									// ),
									right: this.getOffset( 'left' ),
									top: (paddingTop != 'none' && paddingTop ? (
											paddingTop != 'custom' ? paddingSizes[ paddingTop ] : (
												paddingTopValue ? paddingTopValue : 0
											)
										) : 0
									),
									bottom: (paddingBottom != 'none' && paddingBottom ? (
											paddingBottom != 'custom' ? paddingSizes[ paddingBottom ] : (
												paddingBottomValue ? paddingBottomValue : 0
											)
										) : 0
									),
									left: (marginLeft == 'custom' ? marginLeftValue :
										(marginLeft && marginLeft !='none' ? paddingSizes[ marginLeft ] : 0)
									)
								}}>
									<Fragment>
										<div className={`${baseClass}__left-padding-label`}>{paddingLeft == 'custom' ? paddingLeftValue : paddingSizes[ paddingLeft ]} <Dashicon icon='unlock' /></div>
										<div className={`${baseClass}__left-padding-drag-zone`}></div>
									</Fragment>
								</div>
							)}

						</div>
					</Fragment>
				)}
			</Fragment>		
		);
	}

	getPaddingRight() {
		const { paddingRight, paddingRightValue } = this.props.attributes;

		return (paddingRight == 'custom' ? paddingRightValue :
			(paddingRight && paddingRight !='none' ? paddingSizes[ paddingRight ] : 0)
		);
	}

	getPaddingLeft() {
		const { paddingLeft, paddingLeftValue } = this.props.attributes;

		//debugger;

		return (paddingLeft == 'custom' ? paddingLeftValue :
			(paddingLeft && paddingLeft !='none' ? paddingSizes[ paddingLeft ] : 0)
		);
	}

	getOffset(position) {

		const { clientId } = this.props;
		
		const $block = $( `#block-${clientId}` );
		const $section = $block.find( `.${baseClass}` );

		let currentWidth = isEqual( position, 'left' ) ? this.getPaddingLeft() : this.getPaddingRight();
		currentWidth = parseFloat( currentWidth.replace( 'px', '' ) );

		//console.log( currentWidth );

		let adjacentMargin = 0;
		if ( has( this.draggies, [ 'margin', position ] ) ) {
			adjacentMargin = get( this.draggies, [ 'margin', 'right' ] ).$element.width();
		}

		return $section.outerWidth() - currentWidth - adjacentMargin;
	}

	initDragRullers(position = 'top', rullers = 'margin', direction = 'down') {

		const { clientId, setAttributes } = this.props;
		const capitalizePosition = position.charAt( 0 ).toUpperCase() + position.slice( 1 );

		const $block = $( `#block-${clientId}` );
		const $section = $block.find( `.${baseClass}` );
		
		const $wrapper     = $block.find( `.${baseClass}__wrapper` );
		const $dragZone    = $block.find( `.${baseClass}__${position}-${rullers}-drag-zone` );
		const $rullersArea = $block.find( `.${baseClass}__${position}-${rullers}-area` );		

		if ( $dragZone.length == 0 || $rullersArea.length == 0 ) return;

		if ( Object.keys(this.draggies).length ) {
			let shouldEventAdd = true;
			let getItem = get(this.draggies, [rullers, position]);

			if (getItem){
				if ( getItem.element.className == $dragZone[ 0 ].className ) {
					shouldEventAdd = false;
				}
			}

			if ( ! shouldEventAdd ) return;
		}		

		set(this.draggies, [rullers, position], 
			new Draggabilly($dragZone[ 0 ], {
				containment: $rullersArea,
				axis: (position == 'top' || position == 'bottom') ? 'y' : 'x'
			})
		);

		console.log(this.draggies);

		const draggie = get(this.draggies, [rullers, position]);

		let blockHeight, blockWidth;
		let yOffset, xOffset;

		draggie.on( 'dragStart', () => {

			//console.log( 'dragStart' );

			if ( $section.hasClass( 'drag-paddings-off' ) || $section.hasClass( 'drag-margins-off' ) ) {
				return;
			}

			if ( position == 'top' || position == 'bottom' ) {
				blockHeight = $rullersArea.height();
			} else {
				blockWidth = $rullersArea.width();
			}
		} );

		draggie.on( 'dragMove' , (event, pointer, vector) => {

			//console.log( 'dragMove' );

			if ( $section.hasClass( 'drag-paddings-off' ) || $section.hasClass( 'drag-margins-off' ) ) {
				return;
			}

			if ( yOffset != Math.floor( vector.y ) ) {

				/* #region new */
				let leftOffset, rightOffset;
				/* #endregion */

				let newHeight, newWidth;
				if ( direction == 'down' ) {
					newHeight = Math.abs( blockHeight - Math.floor( vector.y ) );
				} else if ( direction == 'up' ) {
					newHeight = Math.abs( blockHeight + Math.floor( vector.y ) );
				}


				/* #region set left-right paddings */				
				const wrapperInnerWidth = $( `.${baseClass}__wrapper` ).innerWidth();
				const wrapperOuterWidth = $section.outerWidth();

				if ( position == 'right' ) {

					if (rullers == 'padding') {
						/* #region new code */
						const leftPadding = $wrapper.css( 'padding-left' );
						const allowedWidth = wrapperOuterWidth - this.minWidth - parseFloat( leftPadding );
							
						const calcWidth = Math.abs( blockWidth - Math.floor( vector.x ) );
	
						if ( calcWidth <= allowedWidth ) {
							newWidth = calcWidth;

							let marginRight = 0;
							if ( has( this.draggies, [ 'margin', 'right' ] ) ) {
								marginRight = get( this.draggies, [ 'margin', 'right' ] ).$element.width();
							}
							
							leftOffset = wrapperOuterWidth - newWidth - marginRight;
						} else {
							return;
						}
						/* #endregion */

					} else if (rullers == 'margin') {
						// debugger;

						const leftMargin = $wrapper.css( 'margin-left' );
						const allowedWidth = wrapperInnerWidth - this.minWidth - parseFloat( leftMargin );
	
						const calcWidth = Math.abs( blockWidth - Math.floor( vector.x ) );

						console.log(calcWidth);
						console.warn(allowedWidth);
	
						if ( calcWidth <= allowedWidth ) {
							newWidth = calcWidth;
						} else {
							return;
						}
					}			
				}

				if ( position == 'left' ) {

					if ( rullers == 'padding' ) {

						/* #region new code */
						const rightPadding = $wrapper.css( 'padding-right' );
						const allowedWidth = wrapperOuterWidth - this.minWidth - parseFloat( rightPadding );
							
						const calcWidth = Math.abs( blockWidth + Math.floor( vector.x ) );
	
						if ( calcWidth <= allowedWidth ) {
							newWidth = calcWidth;

							let marginLeft = 0;
							if ( has( this.draggies, [ 'margin', 'left' ] ) ) {
								marginLeft = get( this.draggies, [ 'margin', 'left' ] ).$element.width();
							}
							
							rightOffset = wrapperOuterWidth - newWidth - marginLeft;
						} else {
							return;
						}
						/* #endregion */
					}
				}
				/* #endregion */

				if ( position == 'top' || position == 'bottom' ) {
					$rullersArea.height( newHeight );
					$rullersArea.find( `.${baseClass}__${position}-${rullers}-label` ).html( newHeight + 'px' );
				} else {
					//$rullersArea.width( newWidth );   //убрать позже когда правый марджин будет менять отступ с права для правой драг зоны
					if ( position == 'right' ) {
						$rullersArea.css({ 'left': leftOffset });
					} else {
						$rullersArea.css({ 'right': rightOffset });
					}
					   //********************* */
					$rullersArea.find( `.${baseClass}__${position}-${rullers}-label` ).html( newWidth + 'px' );
				}

				if ( rullers == 'margin' ) {
					$wrapper.css({ [ rullers + capitalizePosition ]: (position == 'top' || position == 'bottom') ? newHeight : newWidth });
				} else if ( rullers == 'padding' ) {
					$wrapper.css({ [ rullers + capitalizePosition ]: (position == 'top' || position == 'bottom') ? newHeight : newWidth });

					const $rightPadding = $( `.${baseClass}__right-padding-area` );
					const $leftPadding  = $( `.${baseClass}__left-padding-area`  );

					if ( position == 'top' ) {
						$rightPadding.css({ 'top': newHeight });
						$leftPadding .css({ 'top': newHeight });

					} else if ( position == 'bottom' ) {
						$rightPadding.css({ 'bottom': newHeight });
						$leftPadding .css({ 'bottom': newHeight });
					}
				}
			}

			if ( position == 'top' || position == 'bottom' ) {
				yOffset = Math.floor( vector.y );
			} else {
				xOffset = Math.floor( vector.x );
			}
		});

		draggie.on( 'dragEnd', () => {

			//console.log( 'dragEnd' );

			if ( $section.hasClass( 'drag-paddings-off' ) || $section.hasClass( 'drag-margins-off' ) ) {
				return;
			}

			// if ( position == 'top' || position == 'bottom' ) {
			// 	blockHeight = $rullersArea.height();
			// } else {
			// 	blockWidth = $rullersArea.width();
			// }

			// const width = $rullersArea.width();
			// debugger;
			
			setAttributes({
				[ rullers + capitalizePosition ] : 'custom',
				[ rullers + capitalizePosition + 'Value' ] : (position == 'top' || position == 'bottom') ? $rullersArea.height() + 'px' : $rullersArea.width() + 'px'
			});
		});
	}

	initDraggies() {
		const { layout } = this.props.attributes;

		if ( layout ) {
			const { initDragRullers } = this;

			//Top
			initDragRullers( 'top'   , 'margin' , 'up' );
			initDragRullers( 'top'   , 'padding', 'up' );
			
			//Right
			initDragRullers( 'right' , 'margin' , 'left'  );
			initDragRullers( 'right' , 'padding' , 'left'  );

			//Bottom
			initDragRullers( 'bottom', 'margin' , 'up' );
			initDragRullers( 'bottom', 'padding', 'up' );

			//Left
			initDragRullers( 'left'  , 'margin' , 'right' );
			initDragRullers( 'left'  , 'padding' , 'right' );
		}
	}

	createSizeObserver() {
		const { clientId, baseClass } = this.props;

		const $block = $( `#block-${clientId}` );
		const $section = $block.find( `.${baseClass}` );

		const iframe = document.createElement( 'iframe' );
		iframe.style.pointerEvents = 'none';
		iframe.style.position      = 'absolute';
		iframe.style.display       = 'block';

		iframe.style.height = '100%';
		iframe.style.width  = '100%';

		iframe.style.top    = '0';
		iframe.style.bottom = '0';
		iframe.style.left   = '0';

		iframe.style.backgroundColor = 'transparent';
		iframe.className = `${baseClass}__size-observer`;

		$( iframe ).load( () => {
			$( iframe.contentWindow ).resize( () => {
				if ( has( this.draggies, [ 'padding', 'right' ] ) ) {
	
					const leftOffset = this.getOffset( 'right' );
					const $rullersArea = get( this.draggies, [ 'padding', 'right' ] ).$element.parent();
	
					$rullersArea.css({ 'left': leftOffset });
				} else if ( has( this.draggies, [ 'padding', 'left' ] ) ) {

					const rightOffset = this.getOffset( 'left' );
					const $rullersArea = get( this.draggies, [ 'padding', 'left' ] ).$element.parent();
	
					$rullersArea.css({ 'right': rightOffset });
				}
			} );
		} );
		$section.append( iframe );
	}

	componentDidMount() {
		const { entranceAnimation } = this.props.attributes;

		if ( !! entranceAnimation ) {
			this.animate();
		}
				
		this.initDraggies();
		this.createSizeObserver();
	}

	componentDidUpdate(prevProps, prevState) {

		const { entranceAnimation, entranceAnimationDuration } = this.props.attributes;
		const { baseClass, clientId, isSelected } = this.props;

		const prevEntranceAnimation = prevProps.attributes.entranceAnimation;
		const prevEntranceAnimationDuration = prevProps.attributes.entranceAnimationDuration;

		//Animate only on change effect or duration
		if ( !! entranceAnimation && (
				prevEntranceAnimation !== entranceAnimation
				|| prevEntranceAnimationDuration !== entranceAnimationDuration
			)
		) {
			//WOW.js don't update animation-name style so reset it manually
			$( `.${baseClass}-${clientId}` ).css( 'animation-name', '' );

			this.animate();
		}

		/* #region set min width to wrapper */
		const { layout } = this.props.attributes;

		if ( layout ) {
			const $block = $( `#block-${clientId}` );

			this.minWidth = parseFloat( $block.find( `.${baseClass}__wrapper` ).css( 'min-width' ) );
		}
		/* #endregion */

		this.dropDraggies( prevProps, prevState );
		this.initDraggies();
	}

	componentWillUnmount() {
		if ( this.draggies.length ) {
			$.each( this.draggies, (index, draggie) => {
				draggie.destroy();
			} );
		}		
	}

	dropDraggies(prevProps, prevState) {

		const { showRullers } = this.state;
		const { isSelected, clientId } = this.props;

		const spacing = ['margin', 'padding'];
		const direction = ['top', 'right', 'bottom', 'left'];
			
		if ( ! isEqual( isSelected, prevProps.isSelected ) || ! isEqual( showRullers, prevState.showRullers ) ) {
			if ( ! isSelected || ! showRullers ) {
				$.each( spacing, (index, spacings) => {
					$.each( direction, (index, directions) => {
						if (get(this.draggies, [spacings, directions])){
							get(this.draggies, [spacings, directions]).destroy();
						}
					} );
				} );
				this.draggies = {};
			}
		}

		/* #region write in function */
		const { 
			paddingTop,
			paddingBottom,
			paddingLeft,
			paddingRight,

			marginTop,
			marginBottom,
			marginLeft,
			marginRight
		 } = this.props.attributes;

		const paddingValues = {
			paddingTop,
			paddingBottom,
			paddingLeft,
			paddingRight
		};

		const marginValues = {
			marginTop,
			marginBottom,
			marginLeft,
			marginRight
		};

		this.destroyDraggies( paddingValues, 'padding' );
		this.destroyDraggies( marginValues, 'margin' );
		/* #endregion */
	}

	destroyDraggies(spacingArr = [], spacing = 'padding') {
		$.each( spacingArr, (name, value) => {
			if ( value == 'none' ) {
				const position = name.replace( spacing, '' ).toLowerCase();
				if (get(this.draggies, [spacing, position])){
					get(this.draggies, [spacing, position]).destroy();
				}
				unset(this.draggies, [spacing, position]);
			}
		} );
	}

	animate() {
		const {baseClass, clientId} = this.props;

		// Reinit wow only for current block
		new WOW({
			boxClass: `${baseClass}-${clientId}`,
			scrollContainer: '.edit-post-layout__content',
			live: false,
			mobile: false
		}).init();
	}

	playBackgroundVideo() {

		const video = this.videoRef;

		if( ! video.paused) {
			video.pause();
			this.setState({
				videoPlayState: 'paused'
			});
		} else {
			video.play();
			this.setState({
				videoPlayState: 'playing'
			});
		}
	}

	onBackgroundVideoEnd() {
		this.setState({
			videoPlayState: 'paused'
		});
	}

	muteBackgroundVideo() {
		const video = this.videoRef;

		video.muted = ! video.muted;

		this.setState({
			videoMuteState: video.muted
		});
	}
}

export default compose([
	withColors( 'backgroundColor' )
])( Edit );