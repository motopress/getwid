/**
* External dependencies
*/
import classnames from 'classnames';
import { BackgroundSliderEdit as BackgroundSlider } from './sub-components/slider';
import Dividers from './sub-components/dividers';
import BackgroundVideo from './sub-components/video';
import GetwidCustomColorPalette from 'GetwidControls/custom-color-palette';

import Inspector from './inspector';

/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
import { pick, isEqual } from 'lodash';
// import { pick, has, get, set } from 'lodash';
const {jQuery: $} = window;
const {Component, Fragment} = wp.element;
const {
	Button,
	SelectControl,
	ButtonGroup,
	BaseControl,
	IconButton,
	Dashicon,
	Tooltip,
	Toolbar,
	DropdownMenu,
	Path,
	SVG,
	Popover
} = wp.components;
const {
	InnerBlocks,
	withColors,
	BlockControls,
	BlockAlignmentToolbar,
	MediaPlaceholder,
	MediaUpload,	
} = wp.blockEditor || wp.editor;
const {compose} = wp.compose;

/**
* Module Constants
*/
const TEMPLATE = [];
const baseClass = 'wp-block-getwid-section';
const ALLOWED_IMAGE_MEDIA_TYPES = ['image'];

/**
* Create an Inspector Controls
*/
class Edit extends Component {

	constructor(props) {
		super( props );

		this.videoRef = null;
		this.videoButtonRef = null;

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

		this.changeState  = this.changeState.bind( this );
		this.initSectionDrag  = this.initSectionDrag.bind( this );
		this.initDragRullers  = this.initDragRullers.bind( this );
	}

	changeState(param, value) {
		this.setState( { [ param ]: value } );
	}

	render() {
		const {
			attributes: {
				layout, 
				align,

				paddingTopValue,
				paddingBottomValue,
				paddingLeftValue,
				paddingRightValue,
				marginTopValue,
				marginBottomValue,
				marginLeftValue,
				marginRightValue,

				backgroundImage,
				backgroundImagePosition,
				backgroundImageAttachment,
				backgroundImageRepeat,
				backgroundImageSize,			

				sliderImages,
				backgroundVideoUrl,
				backgroundVideoControlsPosition,
				foregroundOpacity,
				foregroundColor,
				foregroundFilter,
				dividersBringTop,

				contentMaxWidth,
				contentMaxWidthPreset,
				minHeight,
				gapSize,
				entranceAnimation,
				entranceAnimationDuration,
				entranceAnimationDelay,

				resetMinHeightTablet,
				resetMinHeightMobile,

				verticalAlign, verticalAlignTablet, verticalAlignMobile,
				horizontalAlign, horizontalAlignTablet, horizontalAlignMobile,

				paddingTop, paddingRight, paddingBottom, paddingLeft,
				paddingTopTablet, paddingRightTablet, paddingBottomTablet, paddingLeftTablet,
				paddingTopMobile, paddingRightMobile, paddingBottomMobile, paddingLeftMobile,


				marginTop, marginRight, marginBottom, marginLeft,
				marginTopTablet, marginRightTablet, marginBottomTablet, marginLeftTablet,
				marginTopMobile, marginRightMobile, marginBottomMobile, marginLeftMobile,

				anchor,

				customBackgroundColor

			},
			className,
			backgroundColor,
			setBackgroundColor,

			prepareGradientStyle,
			prepareBackgroundImageStyles,
			setAttributes,
			isSelected
		} = this.props;	

		const {
			showRullers
		} = this.state;					

		const sectionStyle = {
			//Fix: for editor-only margin top & bottom rullers
			/*paddingTop : marginTop,
			paddingBottom : marginBottom,*/
			...(marginTop === 'custom' ? {marginTop: marginTopValue} : []),
			...(marginBottom === 'custom' ? {marginBottom: marginBottomValue} : []),
		};

        const wrapperStyle = {
			minHeight: minHeight,
			...(marginLeft === 'custom' ? {marginLeft: marginLeftValue} : []),
			...(marginRight === 'custom' ? {marginRight: marginRightValue} : []),
			...(paddingTop === 'custom' ? {paddingTop: paddingTopValue} : []),
			...(paddingBottom === 'custom' ? {paddingBottom: paddingBottomValue} : []),
			...(paddingLeft === 'custom' ? {paddingLeft: paddingLeftValue} : []),
			...(paddingRight === 'custom' ? {paddingRight: paddingRightValue} : [])
        };

		const wrapperClasses = classnames(
			`${baseClass}__wrapper`,
			{
				[`getwid-padding-top-${paddingTop}`]: paddingTop !== 'custom' && paddingTop !== '',
				[`getwid-padding-bottom-${paddingBottom}`]: paddingBottom !== 'custom' && paddingBottom !== '',
				[`getwid-padding-left-${paddingLeft}`]: paddingLeft !== 'custom' && paddingLeft !== '',
				[`getwid-padding-right-${paddingRight}`]: paddingRight !== 'custom' && paddingRight !== '',

				[`getwid-padding-tablet-top-${paddingTopTablet}`]: paddingTopTablet !== '',
				[`getwid-padding-tablet-bottom-${paddingBottomTablet}`]: paddingBottomTablet !== '',
				[`getwid-padding-tablet-left-${paddingLeftTablet}`]: paddingLeftTablet !== '',
				[`getwid-padding-tablet-right-${paddingRightTablet}`]: paddingRightTablet !== '',

				[`getwid-padding-mobile-top-${paddingTopMobile}`]: paddingTopMobile !== '',
				[`getwid-padding-mobile-bottom-${paddingBottomMobile}`]: paddingBottomMobile !== '',
				[`getwid-padding-mobile-left-${paddingLeftMobile}`]: paddingLeftMobile !== '',
				[`getwid-padding-mobile-right-${paddingRightMobile}`]: paddingRightMobile !== '',

				[`getwid-margin-left-${marginLeft}`]: marginLeft !== 'custom' && marginLeft !== '',
				[`getwid-margin-right-${marginRight}`]: marginRight !== 'custom' && marginRight !== '',

				[`getwid-margin-tablet-left-${marginLeftTablet}`]: marginLeftTablet !== '',
				[`getwid-margin-tablet-right-${marginRightTablet}`]: marginRightTablet !== '',

				[`getwid-margin-mobile-left-${marginLeftMobile}`]: marginLeftMobile !== '',
				[`getwid-margin-mobile-right-${marginRightMobile}`]: marginRightMobile !== '',

				[`getwid-align-items-${verticalAlign}`]: verticalAlign !== 'center',
				[`getwid-align-items-tablet-${verticalAlignTablet}`]: verticalAlignTablet !== '',
				[`getwid-align-items-mobile-${verticalAlignMobile}`]: verticalAlignMobile !== '',

				[`getwid-justify-content-${horizontalAlign}`]: horizontalAlign !== 'center',
				[`getwid-justify-content-tablet-${horizontalAlignTablet}`]: horizontalAlignTablet !== '',
				[`getwid-justify-content-mobile-${horizontalAlignMobile}`]: horizontalAlignMobile !== '',

				'getwid-reset-min-height-tablet': resetMinHeightTablet !== false,
				'getwid-reset-min-height-mobile': resetMinHeightMobile !== false
			}

		);

		const backgroundStyle = {
			backgroundColor: (this.props.backgroundColor.color ? this.props.backgroundColor.color : this.props.attributes.customBackgroundColor),
			...prepareGradientStyle('background', this.props),
			...prepareBackgroundImageStyles('background', this.props)
		};

		const backgroundClass = classnames(`${baseClass}__background`, {
			'has-background': backgroundColor.color,
			[ backgroundColor.class ]: backgroundColor.class,
		});

		const foregroundStyle = {
			opacity: foregroundOpacity !== undefined ? foregroundOpacity / 100 : undefined,
			backgroundColor: foregroundColor,
			...prepareGradientStyle('foreground', this.props),
			...prepareBackgroundImageStyles('foreground', this.props),
			mixBlendMode: foregroundFilter,
		};

		const innerWrapperStyle = {
			maxWidth: (contentMaxWidth && contentMaxWidthPreset === 'custom') ? `${contentMaxWidth}px` : undefined,
		};

		const wowData = !!entranceAnimation ? {
			'data-wow-duration':  entranceAnimationDuration !== undefined ? entranceAnimationDuration : '2000ms',
			'data-wow-delay': entranceAnimationDelay !== undefined ? entranceAnimationDelay : '500ms'
		} : {};

		const sectionClasses = classnames(className, {
			[`has-inner-blocks-gap-${gapSize}`]: gapSize !== undefined && gapSize !== '',
			[`getwid-anim ${entranceAnimation}`]: !!entranceAnimation,
			[`getwid-margin-top-${marginTop}`]: marginTop !== 'custom' && marginTop !== '',
			[`getwid-margin-bottom-${marginBottom}`]: marginBottom !== 'custom' && marginBottom !== '',
			[`getwid-margin-tablet-top-${marginTopTablet}`]: marginTopTablet !== 'custom' && marginTopTablet !== '',
			[`getwid-margin-tablet-bottom-${marginBottomTablet}`]: marginBottomTablet !== 'custom' && marginBottomTablet !== '',
			[`getwid-margin-mobile-top-${marginTopMobile}`]: marginTopMobile !== 'custom' && marginTopMobile !== '',
			[`getwid-margin-mobile-bottom-${marginBottomMobile}`]: marginBottomMobile !== 'custom' && marginBottomMobile !== '',
			[`getwid-section-content-full-width`]: contentMaxWidthPreset === 'full',
			[`getwid-section-content-custom-width`]: contentMaxWidthPreset === 'custom'
		});

		const id = anchor ? anchor : undefined;

		const changeState = this.changeState;
		const { isLockedPaddingsOnDesktop, isLockedPaddingsOntablet, isLockedPaddingsOnMobile } = this.state;
		const { isLockedMarginsOnDesktop , isLockedMarginsOnTablet , isLockedMarginsOnMobile  } = this.state;

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

		const vertical_align_controls = [ 'flex-start', 'center', 'flex-end' ];
		const vertical_align_arr = {
			'flex-start': {
				title: __('Top', 'getwid'),	
				icon: <SVG xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><Path fill="none" d="M0 0h24v24H0V0z" /><Path d="M8 11h3v10h2V11h3l-4-4-4 4zM4 3v2h16V3H4z" /></SVG>,
			},
			'center': {
				title: __('Middle', 'getwid'),
				icon: <SVG xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><Path fill="none" d="M0 0h24v24H0V0z" /><Path d="M8 19h3v4h2v-4h3l-4-4-4 4zm8-14h-3V1h-2v4H8l4 4 4-4zM4 11v2h16v-2H4z"/></SVG>,
			},
			'flex-end': {
				title: __('Bottom', 'getwid'),
				icon: <SVG xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><Path fill="none" d="M0 0h24v24H0V0z" /><Path d="M16 13h-3V3h-2v10H8l4 4 4-4zM4 19v2h16v-2H4z" /></SVG>,
			},						
		};

		const horizontal_align_controls = [ 'flex-start', 'center', 'flex-end' ];
		const horizontal_align_arr = {
			'flex-start': {
				title: __('Left', 'getwid'),	
				icon: 'editor-alignleft',
			},
			'center': {
				title: __('Center', 'getwid'),
				icon: 'editor-aligncenter',
			},
			'flex-end': {
				title: __('Right', 'getwid'),
				icon: 'editor-alignright',
			},						
		};

		const margin_sizes_arrays = {
			'small' : '10px',
			'medium' : '25px',
			'normal' : '40px',
			'large' : '60px',
		};

		const padding_sizes_arrays = {
			'small' : '25px',
			'medium' : '50px',
			'normal' : '70px',
			'large' : '120px',
		};

		return (
			<Fragment>
				{layout == false ? (
					<div className="components-placeholder block-editor-inner-blocks__template-picker has-many-options">
						<div className="components-placeholder__label">
							<Dashicon icon="layout" />{__('Choose Section Layout', 'getwid')}
						</div>
						<div className="components-placeholder__instructions">{__('Select a layout to start with, or make one yourself.', 'getwid')}</div>
						<div className="components-placeholder__fieldset">
							<ul className="block-editor-inner-blocks__template-picker-options">
								{
								templates.map((key, index) => {
									return (
										<li>
											<Tooltip text={ key.title }>
												<Button
													className="components-icon-button block-editor-inner-blocks__template-picker-option is-button is-default is-large"
													key={ index }
													onClick={
														() => {
															key.layout();
														}
													}
												>
													{ key.icon }
												</Button>
											</Tooltip>

										</li>
									);
								})
							}
							</ul>
							<div class="block-editor-inner-blocks__template-picker-skip">
								<Button
									className="components-button is-link"
									onClick={
										() => {
											setAttributes({layout : true});
										}
									}
								>
									{__('Skip', 'getwid')}								
								</Button>								
							</div>
						</div>
					</div>
				) : (
					<Fragment>
						<BlockControls>
							<BlockAlignmentToolbar
								value={ align }
								isCollapsed={ false }
								controls={ [ 'wide', 'full' ] }
								onChange={ value => setAttributes( { align: value } ) }
							/>
							<DropdownMenu
								icon={vertical_align_arr[verticalAlign].icon}
								hasArrowIndicator={true}
								className={'components-toolbar'}
								label={__('Vertical Alignment', 'getwid')}
								controls={
									vertical_align_controls.map( ( control ) => {
										return {
											...vertical_align_arr[ control ],
											isActive: verticalAlign === control,
											onClick: ()=>{
												setAttributes({verticalAlign: control});
											},
										};
									} )
								}
							/>	
							<DropdownMenu
								icon={horizontal_align_arr[horizontalAlign].icon}
								hasArrowIndicator={true}
								className={'components-toolbar'}
								label={__('Horizontal Alignment', 'getwid')}
								controls={
									horizontal_align_controls.map( ( control ) => {
										return {
											...horizontal_align_arr[ control ],
											isActive: horizontalAlign === control,
											onClick: ()=>{
												setAttributes({horizontalAlign: control});
											},
										};
									} )
								}
							/>	

							<DropdownMenu
								icon="admin-customizer"
								className={'components-toolbar'}
								label={__( 'Background Color', 'getwid' )}
								popoverProps={{
									onClick: (e)=> {
										e.stopPropagation();
									},
									className: 'components-getwid-toolbar-popup-wrapper',
									focusOnMount: 'container',
									position: "top center"
								}}
							>
								{ ( { onClose } ) => (
									<Fragment>
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
								icon="format-image"
								className={'components-toolbar'}
								label={__( 'Background Image', 'getwid' )}
								popoverProps={{
									onClick: (e)=> {
										e.stopPropagation();
									},
									className: 'components-getwid-toolbar-popup-wrapper',
									focusOnMount: 'container',
									position: "top center"
								}}						
							>
								{ ( { onClose } ) => (
									<Fragment>
										{ !backgroundImage && (
											<MediaPlaceholder
												icon="format-image"
												labels={ {
													title: __( 'Image', 'getwid' ),
													instructions: __( 'Upload an image file, pick one from your media library, or add one with a URL.', 'getwid' ),
												} }
												onSelect={ backgroundImage => {												
													setAttributes({
														backgroundImage: backgroundImage !== undefined ? pick(backgroundImage, ['alt', 'id', 'url']) : {}
													});
													this.setState( ( state ) => ( { imagePopover: false } ) );
												} }
												accept="image/*"
												allowedTypes={ALLOWED_IMAGE_MEDIA_TYPES}
											/>
										)}

										{ !!backgroundImage && (
											<MediaUpload
												onSelect={ backgroundImage => {
													setAttributes({
														backgroundImage: backgroundImage !== undefined ? pick(backgroundImage, ['alt', 'id', 'url']) : {}
													});
												} }
												allowedTypes={ ALLOWED_IMAGE_MEDIA_TYPES }
												value={ backgroundImage !== undefined ? backgroundImage.id : ''}
												render={ ( { open } ) => (
													<BaseControl>
														{ !!backgroundImage.url &&
															<div
																onClick={ open }
																className="getwid-background-image-wrapper"
															>
																	<img src={backgroundImage.url} />
															</div>
														}

														<ButtonGroup>
															<Button
																isPrimary
																onClick={ open }
															>
																{!backgroundImage.id && __('Select Image', 'getwid')}
																{!!backgroundImage.id && __('Replace Image', 'getwid')}
															</Button>

															{!!backgroundImage.id && (
																<Button
																	isDefault
																	onClick={(e) => {
																		setAttributes({backgroundImage: undefined})
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

										{!!backgroundImage && (					
											<Fragment>											
												<SelectControl
													label={__('Position', 'getwid')}
													value={backgroundImagePosition !== undefined ? backgroundImagePosition : ''}
													onChange={backgroundImagePosition => setAttributes({backgroundImagePosition})}
													options={[
														/*Center*/
														{value: '', label: __('Default', 'getwid')},
														{value: 'top left', label: __('Top Left', 'getwid')},
														{value: 'top center', label: __('Top Center', 'getwid')},
														{value: 'top right', label: __('Top Right', 'getwid')},
														{value: 'center left', label: __('Center Left ', 'getwid')},
														{value: 'center center', label: __('Center Center', 'getwid')},
														{value: 'center right', label: __('Center Right', 'getwid')},
														{value: 'bottom left', label: __('Bottom Left', 'getwid')},
														{value: 'bottom center', label: __('Bottom Center', 'getwid')},
														{value: 'bottom right', label: __('Bottom Right', 'getwid')},
													]}
												/>
												<SelectControl
													label={__('Attachment', 'getwid')}
													value={backgroundImageAttachment !== undefined ? backgroundImageAttachment : ''}
													onChange={backgroundImageAttachment => setAttributes({backgroundImageAttachment})}
													options={[
														/*Inherit*/
														{value: '', label: __('Default', 'getwid')},
														{value: 'scroll', label: __('Scroll', 'getwid')},
														{value: 'fixed', label: __('Fixed', 'getwid')},
													]}
												/>
												<SelectControl
													label={__('Repeat', 'getwid')}
													value={backgroundImageRepeat !== undefined ? backgroundImageRepeat : ''}
													onChange={backgroundImageRepeat => setAttributes({backgroundImageRepeat})}
													options={[
														/*Inherit*/
														{value: '', label: __('Default', 'getwid')},
														{value: 'no-repeat', label: __('No Repeat', 'getwid')},
														{value: 'repeat', label: __('Repeat', 'getwid')},
														{value: 'repeat-x', label: __('Repeat X', 'getwid')},
														{value: 'repeat-y', label: __('Repeat Y', 'getwid')},
														{value: 'space', label: __('Space', 'getwid')},
														{value: 'round', label: __('Round', 'getwid')},
													]}
												/>
												<SelectControl
													label={__('Size', 'getwid')}
													value={backgroundImageSize !== undefined ? backgroundImageSize : ''}
													onChange={backgroundImageSize => setAttributes({backgroundImageSize})}
													options={[
														/*Cover*/
														{value: '', label: __('Cover', 'getwid')},
														{value: 'contain', label: __('Contain', 'getwid')},
														{value: 'auto', label: __('Auto', 'getwid')},
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
										title: __('Show rullers', 'getwid'),
										isActive: showRullers,
										onClick: () => {
											this.setState({showRullers: !showRullers});
										}
									},
								]}/>
							)}


						</BlockControls>

						<Inspector {...{
							...this.props,
							...{ isLockedPaddingsOnDesktop, isLockedPaddingsOntablet, isLockedPaddingsOnMobile },
							...{ isLockedMarginsOnDesktop, isLockedMarginsOnTablet, isLockedMarginsOnMobile },
							changeState
						}} key='inspector'/>
						<div
							id={id}
							className={sectionClasses}
							style={sectionStyle}
							{...wowData}
						>
							<div className={`${baseClass}__top-margin-area`} style={{
								height: (marginTop == 'custom' ? marginTopValue :
									(marginTop && marginTop != 'none' ? margin_sizes_arrays[marginTop] : undefined)
								)
							}}>
								<Fragment>
									<div className={`${baseClass}__top-margin-label`}>{marginTop == 'custom' ? marginTopValue : margin_sizes_arrays[marginTop]}</div>
									<div className={`${baseClass}__top-margin-drag-zone`}></div>
								</Fragment>
							</div>

							<div className={`${baseClass}__top-padding-area`} style={{
								height: (paddingTop == 'custom' ? paddingTopValue :
									(paddingTop && paddingTop != 'none' ? padding_sizes_arrays[paddingTop] : undefined)
								)
							}}>
								<Fragment>
									<div className={`${baseClass}__top-padding-label`}>{paddingTop == 'custom' ? paddingTopValue : padding_sizes_arrays[paddingTop]}</div>
									<div className={`${baseClass}__top-padding-drag-zone`}></div>
								</Fragment>
							</div>

							<div className={wrapperClasses} style={wrapperStyle}>
								<Dividers {...{...this.props, baseClass}} />
									{
										(!!backgroundVideoUrl && backgroundVideoControlsPosition !== 'none') &&
											<div
												className={
													classnames(
														'getwid-background-video-controls',
														{
															[`is-position-${backgroundVideoControlsPosition}`]: backgroundVideoControlsPosition !== 'top-right'
														}
													)
												}
											>
												<button
													onClick={ this.playBackgroundVideo }
													className={'getwid-background-video-play'}
													ref={ node => {this.videoButtonRef = node}}
												>
													{
														this.state.videoPlayState === 'paused' &&
														<i className={'getwid-icon getwid-icon-play'}></i>
													}
													{
														this.state.videoPlayState === 'playing' &&
														<i className={'getwid-icon getwid-icon-pause'}></i>
													}
												</button>
												<button
													onClick={ this.muteBackgroundVideo }
													className={'getwid-background-video-mute'}
												>
													{
														this.state.videoMuteState === true &&
														<i className="getwid-icon getwid-icon-mute"></i>
													}
													{
														this.state.videoMuteState === false &&
														<i className="getwid-icon getwid-icon-volume-up"></i>
													}
												</button>
											</div>
									}

									<div className={classnames(`${baseClass}__inner-wrapper`, {
											[`has-dividers-over`]: dividersBringTop,
										})} style={innerWrapperStyle}>
										<div className={`${baseClass}__background-holder`}>
											<div className={backgroundClass} style={backgroundStyle}>
												{
													!!backgroundImage &&
													<div className={`${baseClass}__background-image-wrapper`}><img className={`${baseClass}__background-image`} src={backgroundImage.url}
																												alt={backgroundImage.alt} data-id={backgroundImage.id}/></div>
												}
												{
													!!sliderImages.length &&
													<div className={`${baseClass}__background-slider-wrapper`}><BackgroundSlider {...{...this.props, baseClass}} /></div>
												}
												{
													!!backgroundVideoUrl &&
													<div className={`${baseClass}__background-video-wrapper`}>
														<BackgroundVideo
															{...{...this.props, baseClass}}
															onVideoEnd={ this.onBackgroundVideoEnd }
															videoAutoplay={ false }
															videoMute={ this.state.videoMuteState }
															videoElemRef={ node => { this.videoRef = node } }
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
															<InnerBlocks.ButtonBlockAppender />
														) }
														defaultBlock={ false }
														template={ TEMPLATE }
														templateInsertUpdatesSelection={ false }
														templateLock={ false }
													/>
												</div>

										</div>
									</div>

							</div>

							<div className={`${baseClass}__bottom-margin-area`} style={{
								height: (marginBottom == 'custom' ? marginBottomValue :
									(marginBottom && marginBottom != 'none' ? margin_sizes_arrays[marginBottom] : undefined)
								)
							}}>
								<Fragment>
									<div className={`${baseClass}__bottom-margin-label`}>{marginBottom == 'custom' ? marginBottomValue : margin_sizes_arrays[marginBottom]}</div>
									<div className={`${baseClass}__bottom-margin-drag-zone`}></div>
								</Fragment>
							</div>

							<div className={`${baseClass}__bottom-padding-area`} style={{
								height: (paddingBottom == 'custom' ? paddingBottomValue :
									(paddingBottom && paddingBottom != 'none' ? padding_sizes_arrays[paddingBottom] : undefined)
								)
							}}>
								<Fragment>
									<div className={`${baseClass}__bottom-padding-label`}>{paddingBottom == 'custom' ? paddingBottomValue : padding_sizes_arrays[paddingBottom]}</div>
									<div className={`${baseClass}__bottom-padding-drag-zone`}></div>
								</Fragment>
							</div>
						</div>
					</Fragment>
				)}
			</Fragment>		
		);
	}

	initDragRullers(position = 'top', rullers = 'margin', direction = 'down') {

		const { clientId, setAttributes } = this.props;

		var capitalizePosition = position.charAt(0).toUpperCase() + position.slice(1);

		const thisBlock = $(`[data-block='${clientId}']`);
		const section = $(`.${baseClass}`, thisBlock);

		const section_wrapper = $(`.${baseClass}__wrapper`, thisBlock);
		const dragZone = $(`.${baseClass}__${position}-${rullers}-drag-zone`, thisBlock);
		const rullersArea = $(`.${baseClass}__${position}-${rullers}-area`, thisBlock);

		if (dragZone.length == 0 || rullersArea.length == 0) return;

		this.draggies.unshift( new Draggabilly(dragZone[ 0 ], {
			containment: rullersArea,
			axis: 'y'
		}) );

		// var dragObj = new Draggabilly(dragZone[0], {
		// 	containment: rullersArea,
		// 	axis: 'y'
		// });

		const [ draggie, ...reset ] = this.draggies;

		var blockHeight;
		var prevVectorVal;

		const onDragStart = function (event, pointer, moveVector ) {
			blockHeight = rullersArea.height();
			console.error(blockHeight); //!!!!!!!!!!!!!!!!!!!!!
		};

		const onDragMove = function (event, pointer, moveVector ) {

			let timer = setTimeout(function() {
				if (prevVectorVal != Math.floor(moveVector.y)){
					//console.log(prevVectorVal);
					//console.warn(Math.floor(moveVector.y));

					var newBlockHeight;
					if (direction == 'down'){
						newBlockHeight = Math.abs(blockHeight - Math.floor(moveVector.y)); 	
					} else if (direction == 'up'){
						newBlockHeight = Math.abs(blockHeight + Math.floor(moveVector.y));
					}

					//console.log('Height: ' + newBlockHeight);

					//Change blocks
					rullersArea.height(newBlockHeight);
					rullersArea.find(`.${baseClass}__${position}-${rullers}-label`).html(newBlockHeight + 'px');
					if (rullers == 'margin'){
						section.css({[ rullers + capitalizePosition ]: newBlockHeight });
					} else if (rullers == 'padding'){
						section_wrapper.css({[ rullers + capitalizePosition ]: newBlockHeight });
					}

					clearTimeout(timer);
				}
				prevVectorVal = Math.floor(moveVector.y);
			}, 0);
		};

		const onDragEnd = function (event, pointer, moveVector ) {
			blockHeight = rullersArea.height();

			//Clear events
			// dragObj.off('dragStart', onDragStart);
			// dragObj.off('dragMove', onDragMove);
			// dragObj.off('dragEnd', onDragEnd);

			setAttributes({
				[ rullers + capitalizePosition ] : 'custom',
				[ rullers + capitalizePosition + 'Value' ] : rullersArea.height() + 'px'
				// marginTop: 'custom',
				// marginTopValue: rulerArea.height() + 'px'
			});
		};

		//Add events
		draggie.on( 'dragStart', onDragStart );	
		draggie.on( 'dragMove' , onDragMove  );
		draggie.on( 'dragEnd'  , onDragEnd   );
	}

	initSectionDrag() {

		/* #region disable drag area at first initialize */
		const { showRullers } = this.state;
		const { isSelected, clientId } = this.props;

		const $block = $( `#block-${clientId}` );
		const $dragArea = $block.find( 'div[class$=\'-area\']' );

		if ( ! isSelected && showRullers ) {
			$dragArea.css({ display: 'none' });
		}
		/* #endregion */

		this.draggies = [];
		this.initDragRullers( 'top'   ,'margin' , 'up' );
		this.initDragRullers( 'top'   ,'padding', 'up' );
		this.initDragRullers( 'bottom','margin' , 'up' );
		this.initDragRullers( 'bottom','padding', 'up' );
	}

	componentDidMount() {

		const { entranceAnimation } = this.props.attributes;

		if ( !! entranceAnimation ) {
			this.animate();
		}

		this.initSectionDrag();
	}

	componentDidUpdate(prevProps, prevState) {
		//this.initSectionDrag();

		console.log( 'componentDidUpdate' );

		const {
			attributes: {
				
			},
			isSelected,
			baseClass,
			clientId
		} = this.props;

		const { entranceAnimation, entranceAnimationDuration } = this.props.attributes;
		

		const prevEntranceAnimation         = prevProps.attributes.entranceAnimation;
		const prevEntranceAnimationDuration = prevProps.attributes.entranceAnimationDuration;

		// Animate only on change effect or duration
		if ( !! entranceAnimation && (
				prevEntranceAnimation !== entranceAnimation
				|| prevEntranceAnimationDuration !== entranceAnimationDuration
			)
		) {
			//WOW.js don't update animation-name style so reset it manually
			$( `.${baseClass}-${clientId}` ).css( 'animation-name', '' );
			this.animate();
		}

		this.setDragAreaActivity( prevProps, prevState );
	}

	setDragAreaActivity(prevProps, prevState) {
		
		const { showRullers } = this.state;
		const { clientId, isSelected } = this.props;
		
		const $block = $( `#block-${clientId}` );
		const $dragArea = $block.find( 'div[class$=\'-area\']' );

		if ( ! prevState.showRullers && showRullers ) {
			$dragArea.css({ display: 'block' });
		} else if ( prevState.showRullers && ! showRullers ) {
			$dragArea.css({ display: 'none' });
		}

		if ( ! isEqual( isSelected, prevProps.isSelected ) && showRullers ) {
			if ( ! prevProps.isSelected && isSelected ) {
				$dragArea.css({ display: 'block' });
			} else if ( prevProps.isSelected && ! isSelected ) {
				$dragArea.css({ display: 'none' });
			}
		}
	}

	componentWillUnmount() {
		$.each( this.draggies, (index, draggie) => {
			draggie.destroy();
		} );
	}

	animate(){
		const {baseClass, clientId} = this.props;

		// Reinit wow only for current block
		new WOW({
			boxClass: `${baseClass}-${clientId}`,
			scrollContainer: '.edit-post-layout__content',
			live: false,
			mobile: false
		}).init();
	}

	playBackgroundVideo(){

		const video = this.videoRef;

		if(!video.paused){
			video.pause();
			this.setState({
				videoPlayState: 'paused'
			})
		}else{
			video.play();
			this.setState({
				videoPlayState: 'playing'
			})
		}
	}

	onBackgroundVideoEnd(){
		this.setState({
			videoPlayState: 'paused'
		})
	}

	muteBackgroundVideo(){

		const video = this.videoRef;

		video.muted = !video.muted;

		this.setState({
			videoMuteState: video.muted
		});

	}

}

export default compose( [
	withColors( 'backgroundColor' ),
] )( Edit );