/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import classnames from 'classnames';

import { pick, get } from 'lodash';

/**
* Internal dependencies
*/
import GetwidCustomTabsControl       from 'GetwidControls/custom-tabs-control';
import GetwidCustomBackgroundControl from 'GetwidControls/custom-background-control';
import GetwidStyleLengthControl      from 'GetwidControls/style-length-control';

import GetwidAnimationSelectControl from 'GetwidControls/animation-select-control'
import GetwidCustomGradientPalette  from 'GetwidControls/custom-gradient-palette';

import { renderPaddingsPanelWithTabs, renderMarginsPanelWithTabs } from 'GetwidUtils/render-inspector';

/**
* WordPress dependencies
*/
const { select, withSelect } = wp.data;
const { Component, Fragment } = wp.element;
const { InspectorControls, MediaUpload, MediaPlaceholder, PanelColorSettings, withColors } = wp.blockEditor || wp.editor;
const { BaseControl, Button, PanelBody, RangeControl, SelectControl, TextControl, CheckboxControl, RadioControl, ToggleControl, ButtonGroup, TabPanel, ExternalLink, ColorPalette, ColorIndicator, Dropdown, Dashicon } = wp.components;
const {compose} = wp.compose;

/**
* Module Constants
*/
const ALLOWED_SLIDER_MEDIA_TYPES = [ 'image' ];
const ALLOWED_IMAGE_MEDIA_TYPES = [ 'image' ];
const ALLOWED_VIDEO_MEDIA_TYPES = [ 'video' ];

const controlClass = 'components-base-control';

/**
* Create an Inspector Controls
*/
class Inspector extends Component {

	constructor( props ) {
		super( ...arguments );
		this.onSelectSliderImages     = this.onSelectSliderImages    .bind( this );
		this.changeBackgroundGradient = this.changeBackgroundGradient.bind( this );
		this.changeForegroundGradient = this.changeForegroundGradient.bind( this );  

		this.changeState = this.changeState.bind( this );

		this.state = {
			contentHelpIsVisible: false,
			tabName: 'general',
			backgroundType: 'color',
			foregroundType: 'color'
		};
	}

	changeState (param, value) {
		this.setState({ [ param ]: value });
	}

	getState (value) {
		return this.state[ value ];
	}	

	render() {
		const { tabName, backgroundType, foregroundType } = this.state;

		const { customBackgroundColor } = this.props.attributes;
		const { setBackgroundColor, backgroundColor } = this.props;
		
		const { backgroundGradientFirstColor, backgroundGradientFirstColorLocation, backgroundGradientSecondColor, backgroundGradientSecondColorLocation, backgroundGradientType, backgroundGradientAngle } = this.props.attributes;
		const { foregroundGradientFirstColor, foregroundGradientFirstColorLocation, foregroundGradientSecondColor, foregroundGradientSecondColorLocation, foregroundGradientType, foregroundGradientAngle } = this.props.attributes;

		const changeState = this.changeState;

		return (
			<InspectorControls key='inspector'>
				<GetwidCustomTabsControl
					state={tabName}
					stateName='tabName'
					onChangeTab={changeState}
					tabs={[ 'general','style','advanced' ]}
				/>

				{ tabName === 'general' && (
					<Fragment>
						{this.renderSizeSettings()}
						{this.renderAlignmentSettings()}
					</Fragment>
				)}

				{ tabName === 'style' && (
					<Fragment>
						<PanelBody title={__( 'Background', 'getwid' )} initialOpen={true}>
							<GetwidCustomBackgroundControl
								//label={__( 'Background Type', 'getwid' )}
								state={backgroundType}
								stateName={'backgroundType'}
								onChangeBackgroundType={changeState}
								types={[ 'color','image','gradient','slider','video' ]}
							/>

							{ backgroundType === 'color' && (
								<PanelColorSettings
									title={__( 'Colors', 'getwid' )}
									initialOpen={true}
									className='getwid-custom-pallete'
									colorSettings={[
										{
											value: backgroundColor.color,
											onChange: setBackgroundColor,
											label: __( 'Text Color', 'getwid' )
										},						
									]}
								/>
							)}

							{ backgroundType === 'image' && (
								<Fragment>
									{this.renderBackgroundImage()}
								</Fragment>
							)}

							{ backgroundType === 'gradient' && (
								<GetwidCustomGradientPalette
									label='Background Gradient'
									value={{
										firstColor : backgroundGradientFirstColor,
										secondColor: backgroundGradientSecondColor,

										firstLocation : backgroundGradientFirstColorLocation,
										secondLocation: backgroundGradientSecondColorLocation,
																		
										type : backgroundGradientType,
										angle: backgroundGradientAngle
									}}
									onChange={this.changeBackgroundGradient}
								/>
							)}

							{ backgroundType === 'slider' && (
								<Fragment>
									{this.renderSliderSettings()}
								</Fragment>
							)}

							{ backgroundType === 'video' && (
								<Fragment>
									{this.renderVideoSettings()}
								</Fragment>
							)}		
						</PanelBody>
						<PanelBody title={__( 'Overlay', 'getwid' )} initialOpen={false}>
							{this.renderForegroundSettings()}

							<GetwidCustomBackgroundControl
								label={__( 'Overlay Type', 'getwid' )}
								state={foregroundType}
								stateName='foregroundType'
								onChangeBackgroundType={changeState}
								types={[ 'color','image','gradient' ]}
							/>

							{ foregroundType === 'color' && (
								<Fragment>
									{this.renderForegroundColor()}
								</Fragment>
							)}

							{ foregroundType === 'image' && (
								<Fragment>
									{this.renderForegroundImage()}
								</Fragment>
							)}

							{ foregroundType === 'gradient' && (
								<GetwidCustomGradientPalette
									label='Overlay Gradient'
									value={{
										firstColor : foregroundGradientFirstColor,
										secondColor: foregroundGradientSecondColor,

										firstLocation : foregroundGradientFirstColorLocation,
										secondLocation: foregroundGradientSecondColorLocation,

										type : foregroundGradientType,
										angle: foregroundGradientAngle
									}}
									onChange={this.changeForegroundGradient}
								/>
							)}
						</PanelBody>
				
						{renderPaddingsPanelWithTabs( this )}
						{renderMarginsPanelWithTabs( this )}

					</Fragment>
				)}

				{ tabName === 'advanced' && (
					<Fragment>
						{this.renderAnimationSettings()}
						{this.renderDividersSettings()}
					</Fragment>
				)}				
			</InspectorControls>
		);
	}

	changeBackgroundGradient( firstColor, firstLocation, secondColor, secondLocation, type, angle ) {

		const { setAttributes } = this.props;

		setAttributes( {
			backgroundGradientFirstColor  : firstColor,
			backgroundGradientSecondColor : secondColor,

			backgroundGradientFirstColorLocation : firstLocation,
			backgroundGradientSecondColorLocation: secondLocation,

			backgroundGradientType : type,
			backgroundGradientAngle: angle
		} );
	};

	changeForegroundGradient( firstColor, firstLocation, secondColor, secondLocation, type, angle ) {

		const { setAttributes } = this.props;

		setAttributes( {
			foregroundGradientFirstColor  : firstColor,
			foregroundGradientSecondColor : secondColor,

			foregroundGradientFirstColorLocation : firstLocation,
			foregroundGradientSecondColorLocation: secondLocation,

			foregroundGradientType : type,
			foregroundGradientAngle: angle
		} );
	};

	hasAnimation() {
		const { entranceAnimation, entranceAnimationDelay, entranceAnimationDuration } = this.props.attributes;

		return entranceAnimation !== undefined ||
			entranceAnimationDelay !== '200ms' ||
			entranceAnimationDuration !== '1500ms';
	}

	renderBackgroundImage() {

		const { backgroundImage, backgroundImagePosition, backgroundImageAttachment, backgroundImageRepeat, backgroundImageSize } = this.props.attributes;
		const { setAttributes, baseClass } = this.props;

		return(
			<Fragment>
				{ !backgroundImage && (
					<MediaPlaceholder
						icon='format-image'
						labels={ {
							title: __( 'Background Image', 'getwid' ),
							instructions: __( 'Upload an image file or pick one from your media library.', 'getwid' ),
						} }
						onSelect={backgroundImage => {												
							setAttributes({
								backgroundImage: backgroundImage !== undefined ? pick( backgroundImage, [ 'alt', 'id', 'url' ] ) : {}
							});
							this.setState( () => ({ imagePopover: false }) );
						} }
						accept='image/*'
						allowedTypes={ALLOWED_IMAGE_MEDIA_TYPES}
					/>
				)}

				{ !!backgroundImage && (
					<MediaUpload
						onSelect={ backgroundImage => {
							setAttributes({
								backgroundImage: backgroundImage !== undefined ? pick( backgroundImage, [ 'alt', 'id', 'url' ] ) : {}
							});
						} }
						allowedTypes={ALLOWED_IMAGE_MEDIA_TYPES}
						value={ backgroundImage !== undefined ? backgroundImage.id : ''}
						render={ ({ open }) => (
							<BaseControl>
								{ !!backgroundImage.url &&
									<div
										onClick={ open }
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
										{!backgroundImage.id  && __( 'Select Image' , 'getwid' )}
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
					<div className={`${controlClass}__custom-wrapper`}>
						<span className={`${controlClass}__label`}>{__( 'Background Settings', 'getwid' )}</span>
						<Dropdown
							className={`${controlClass}__dropdown-action`}
							contentClassName={`${controlClass}__dropdown-content`}
							renderToggle={({ isOpen, onToggle }) => (
								<Button
									isDefault
									onClick={onToggle}
								>
									<Dashicon icon='admin-tools'/>
								</Button>
							)}
							renderContent={() => (
								<Fragment>
									<SelectControl
										label={__( 'Position', 'getwid' )}
										value={backgroundImagePosition !== undefined ? backgroundImagePosition : ''}
										onChange={backgroundImagePosition => setAttributes({ backgroundImagePosition })}
										options={[
											/*Center*/
											{ value: ''             , label: __( 'Default'      , 'getwid' ) },
											{ value: 'top left'     , label: __( 'Top Left'     , 'getwid' ) },
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
										label={__( 'Size', 'getwid' )}
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
						/>
					</div>
				)}
			</Fragment>
		);
	}

	renderDividersSettings() {

		const { dividerTop, dividersTopHeight, dividerTopColor, dividerBottom, dividersBottomHeight, dividersBringTop, dividerBottomColor } = this.props.attributes;
		const { setAttributes } = this.props;
		
		const dividersOptions = [
			{ value: '', label: __( 'None', 'getwid' ) },

			/* tilt */
			{ value: 'tilt'          , label: __( 'Tilt'           , 'getwid' )},
			{ value: 'tilt-negative' , label: __( 'Tilt Negative'  , 'getwid' )},
			{ value: 'tilt-layered-1', label: __( 'Tilt Layered 1' , 'getwid' )},
			{ value: 'tilt-layered-2', label: __( 'Tilt Layered 2 ', 'getwid' )},
			{ value: 'tilt-layered-3', label: __( 'Tilt Layered 3' , 'getwid' )},

			/* split */
			{ value: 'split'         , label: __( 'Split'         , 'getwid' ) },
			{ value: 'split-negative', label: __( 'Split Negative', 'getwid' ) },

			/* clouds */
			{ value: 'clouds'         , label: __( 'Clouds'         , 'getwid' ) },
			{ value: 'clouds-negative', label: __( 'Clouds Negative', 'getwid' ) },

			/* book */
			{ value: 'book'         , label: __( 'Book'         , 'getwid' ) },
			{ value: 'book-negative', label: __( 'Book Negative', 'getwid' ) },

			/* arrow */
			{ value: 'arrow'         , label: __( 'Arrow'         , 'getwid' ) },
			{ value: 'arrow-negative', label: __( 'Arrow Negative', 'getwid' ) },

			/* triangle */
			{ value: 'triangle-rounded'                      , label: __( 'Triangle Rounded'                      , 'getwid' ) },
			{ value: 'triangle-negative-rounded'             , label: __( 'Triangle Rounded Negative'             , 'getwid' ) },
			{ value: 'triangle-asymmetrical-rounded'         , label: __( 'Triangle Rounded Asymmetrical'         , 'getwid' ) },
			{ value: 'triangle-asymmetrical-negative-rounded', label: __( 'Triangle Rounded Asymmetrical Negative', 'getwid' ) },
			{ value: 'triangle'                              , label: __( 'Triangle'                              , 'getwid' ) },
			{ value: 'triangle-negative'                     , label: __( 'Triangle Negative'					  , 'getwid' ) },
			{ value: 'triangle-asymmetrical'                 , label: __( 'Triangle Asymmetrical'				  , 'getwid' ) },
			{ value: 'triangle-asymmetrical-negative'        , label: __( 'Triangle Asymmetrical Negative'		  , 'getwid' ) },
			{ value: 'triangle-layered-asymmetrical'         , label: __( 'Triangle Layered Asymmetrical'		  , 'getwid' ) },

			/* waves */
			{ value: 'waves'               , label: __( 'Waves'               , 'getwid' ) },
			{ value: 'waves-light'         , label: __( 'Waves Light'         , 'getwid' ) },
			{ value: 'waves-large'         , label: __( 'Waves Large'         , 'getwid' ) },
			{ value: 'waves-large-negative', label: __( 'Waves Large Negative', 'getwid' ) },
			{ value: 'waves-layered'       , label: __( 'Waves Layered'       , 'getwid' ) },
			{ value: 'mountains'           , label: __( 'Waves Multi-Layered' , 'getwid' ) },
			{ value: 'waves-pattern'       , label: __( 'Waves Pattern'       , 'getwid' ) },

			/* drips/drops */
			{ value: 'drips'      			, label: __( 'Drips'		 		, 'getwid' ) },
			{ value: 'drips-negative'       , label: __( 'Drips Negative'		, 'getwid' ) },
			{ value: 'drops'                , label: __( 'Drops'         		, 'getwid' ) },
			{ value: 'drops-negative'       , label: __( 'Drops Negative'		, 'getwid' ) },
			{ value: 'tilted-drips'         , label: __( 'Tilted Drips'  		, 'getwid' ) },
			{ value: 'tilted-drips-negative', label: __( 'Tilted Drips Negative', 'getwid' ) },

			/* pyramids */
			{ value: 'pyramids'				  , label: __( 'Pyramids'				  , 'getwid' ) },
			{ value: 'pyramids-negative'	  , label: __( 'Pyramids Negative'		  , 'getwid' ) },
			{ value: 'pyramids-round'         , label: __( 'Pyramids Rounded'		  , 'getwid' ) },
			{ value: 'pyramids-round-negative', label: __( 'Pyramids Rounded Negative', 'getwid' ) },
			{ value: 'opacity-pyramids'		  , label: __( 'Pyramids Layered'		  , 'getwid' ) },

			/* curve */
			{ value: 'curve'		  , label: __( 'Curve'          , 'getwid' ) },
			{ value: 'curve-negative' , label: __( 'Curve Negative' , 'getwid' ) },
			{ value: 'curve-1'        , label: __( 'Curve 1'        , 'getwid' ) },
			{ value: 'curve-2'        , label: __( 'Curve 2'        , 'getwid' ) },
			{ value: 'curve-3'        , label: __( 'Curve 3'        , 'getwid' ) },
			{ value: 'curve-4'        , label: __( 'Curve 4'        , 'getwid' ) },
			{ value: 'curve-5'        , label: __( 'Curve 5'        , 'getwid' ) },
			{ value: 'curve-6'        , label: __( 'Curve 6'        , 'getwid' ) },
			{ value: 'curve-7'        , label: __( 'Curve 7'        , 'getwid' ) },
			{ value: 'curve-8'        , label: __( 'Curve 8'        , 'getwid' ) },
			{ value: 'curve-layered-1', label: __( 'Curve Layered 1', 'getwid' ) },
			{ value: 'curve-layered-2', label: __( 'Curve Layered 2', 'getwid' ) },
			{ value: 'curve-layered-3', label: __( 'Curve Layered 3', 'getwid' ) },
			{ value: 'curve-layered-4', label: __( 'Curve Layered 4', 'getwid' ) },

			/* zigzag */
			{ value: 'zigzag-ice'         , label: __( 'Zigzag'			, 'getwid' ) },
			{ value: 'zigzag-ice-negative', label: __( 'Zigzag Negative', 'getwid' ) },
			{ value: 'zigzag-pattern'     , label: __( 'Zigzag Pattern' , 'getwid' ) }
		];

		return (
			<PanelBody title={ __( 'Dividers', 'getwid' ) } initialOpen={false}>
				<SelectControl
					label={__( 'Top Divider', 'getwid' )}
					value={dividerTop !== undefined ? dividerTop : ''}
					options={dividersOptions}
					onChange={dividerTop => setAttributes({ dividerTop })}
				/>				
				<GetwidStyleLengthControl
					label={__( 'Top Divider Height', 'getwid' )}
					value={dividersTopHeight}
					units={[
						{ label: 'px', value: 'px' },
						{ label: 'vh', value: 'vh' },
						{ label: 'vw', value: 'vw' }
					]}
					onChange={dividersTopHeight => setAttributes({ dividersTopHeight })}
				/>				
				<SelectControl
					label={__( 'Bottom Divider', 'getwid' )}
					value={dividerBottom !== undefined ? dividerBottom : ''}
					options={dividersOptions}
					onChange={dividerBottom => setAttributes({ dividerBottom })}
				/>
				<GetwidStyleLengthControl
					label={__( 'Bottom Divider Height', 'getwid' )}
					value={dividersBottomHeight}
					units={[
						{ label: 'px', value: 'px' },
						{ label: 'vh', value: 'vh' },
						{ label: 'vw', value: 'vw' }							
					]}
					onChange={dividersBottomHeight => setAttributes({ dividersBottomHeight })}
				/>
				<ToggleControl
					label={ __( 'Bring dividers to top', 'getwid' ) }
					checked={ dividersBringTop }
					onChange={ () => {
						setAttributes({ dividersBringTop: !dividersBringTop });
					}}
				/>							
				{
					( dividerTop || dividerBottom ) &&
					<PanelColorSettings
						title={__( 'Divider Color', 'getwid' )}
						colorSettings={[
							...(dividerTop ? [{
								value: dividerTopColor,
								onChange: dividerTopColor => setAttributes({ dividerTopColor }),
								label: __( 'Top', 'getwid' )
							}] : []),
							...(dividerBottom ? [{
								value: dividerBottomColor,
								onChange: dividerBottomColor => setAttributes({ dividerBottomColor }),
								label: __( 'Bottom', 'getwid' )
							}] : [])
						]}
					/>
				}
			</PanelBody>
		);
	}
	
	renderSizeSettings() {

		const { contentMaxWidth, minHeight, gapSize, resetMinHeightTablet, resetMinHeightMobile, contentMaxWidthPreset } = this.props.attributes;
		const { setAttributes } = this.props;

		const { contentHelpIsVisible } = this.state;

		const contentHelpToggle = ()=> {
			this.setState({ contentHelpIsVisible: !contentHelpIsVisible });
		};

		return (
			<Fragment>
				<RadioControl
					label={__( 'Content Width', 'getwid' )}
					selected={ contentMaxWidthPreset !== undefined ? contentMaxWidthPreset : 'boxed' }
					options={ [
						{ value: 'boxed' , label: __( 'Boxed'     , 'getwid' ) },
						{ value: 'full'  , label: __( 'Full Width', 'getwid' ) },
						{ value: 'custom', label: __( 'Custom'    , 'getwid' ) }
					] }
					onChange={contentMaxWidthPreset => setAttributes({ contentMaxWidthPreset })}
				/>
				{ contentMaxWidthPreset === 'custom' &&
					<RangeControl
						value={contentMaxWidth !== undefined ? contentMaxWidth : ''}
						onChange={contentMaxWidth => {
							setAttributes({ contentMaxWidth });
						}}
						allowReset
						min={0}
						max={2000}
						step={1}
					/>
				}

				{ !!contentHelpIsVisible && (
					<Fragment>
						<BaseControl
							label={__( 'Set the default width of the content area in Writing Settings.', 'getwid' )}
						>
							<ExternalLink href={Getwid.options_writing_url}>{ __( 'Writing Settings', 'getwid' ) }</ExternalLink>
						</BaseControl>
						<Button
							isLink
							onClick={contentHelpToggle}
						>
							{ __( 'Hide Help', 'getwid' ) }
						</Button>
					</Fragment>
				) }	

				{ !contentHelpIsVisible && (
					<BaseControl>
						<Button
							isLink
							onClick={ contentHelpToggle }
						>
							{ __( 'Show Help', 'getwid' ) }
						</Button>
					</BaseControl>
				) }

				<BaseControl>
					<TabPanel className="getwid-editor-tabs"
								activeClass="is-active"
								tabs={[
									{
										name: 'desktop',
										title: __('Desktop', 'getwid'),
										className: 'components-button is-link is-small'
									},
									{
										name: 'tablet',
										title: __('Tablet', 'getwid'),
										className: 'components-button is-link is-small'
									},
									{
										name: 'mobile',
										title: __('Mobile', 'getwid'),
										className: 'components-button is-link is-small'
									}
								]}>
						{
							tab => {
								switch (tab.name) {
									case 'desktop': {
										return (
											<GetwidStyleLengthControl
												label={__( 'Section Height', 'getwid' )}
												value={minHeight}
												units={[
													{ label: 'px', value: 'px' },
													{ label: 'vh', value: 'vh' },
													{ label: 'vw', value: 'vw' },
													{ label: '%' , value: '%'  }
												]}
												onChange={minHeight => setAttributes({ minHeight })}
											/>
										)
									}
									case 'tablet':{
										return(
											<CheckboxControl
												label={__( 'Reset height on tablet', 'getwid' )}
												checked={ resetMinHeightTablet !== undefined ? resetMinHeightTablet : false}
												onChange={resetMinHeightTablet => setAttributes({ resetMinHeightTablet })}
											/>
										)
									}
									case 'mobile':{
										return (
											<CheckboxControl
												label={__( 'Reset height on mobile', 'getwid' )}
												checked={ resetMinHeightMobile !== undefined ? resetMinHeightMobile : false}
												onChange={resetMinHeightMobile => setAttributes({resetMinHeightMobile})}
											/>
										)
									}
								}
							}
						}
					</TabPanel>
				</BaseControl>

				<SelectControl
					label={__( 'Vertical space between blocks', 'getwid' )}
					value={gapSize !== undefined ? gapSize : undefined}
					onChange={gapSize => setAttributes({ gapSize })}
					options={[
						{ value: ''      , label: __( 'Default', 'getwid' ) },
						{ value: 'small' , label: __( 'Small'  , 'getwid' ) },
						{ value: 'medium', label: __( 'Medium' , 'getwid' ) },
						{ value: 'normal', label: __( 'Normal' , 'getwid' ) },
						{ value: 'large' , label: __( 'Large'  , 'getwid' ) },
						{ value: 'huge'  , label: __( 'Huge'   , 'getwid' ) },
						{ value: 'none'  , label: __( 'None'   , 'getwid' ) }
					]}
				/>
			</Fragment>
		);
	}

	renderAlignmentSettings() {

		const { verticalAlign, horizontalAlign, verticalAlignTablet, horizontalAlignTablet, verticalAlignMobile, horizontalAlignMobile } = this.props.attributes;
		const { setAttributes } = this.props;

		return (
			<Fragment>
				<BaseControl
					label={__( 'Content Alignment', 'getwid' )}					
				>
					<TabPanel className='getwid-editor-tabs'
							activeClass='is-active'
							tabs={[
								{
									name: 'desktop',
									title: __( 'Desktop', 'getwid' ),
									className: 'components-button is-link is-small'
								},
								{
									name: 'tablet',
									title: __( 'Tablet', 'getwid' ),
									className: 'components-button is-link is-small'
								},
								{
									name: 'mobile',
									title: __( 'Mobile', 'getwid' ),
									className: 'components-button is-link is-small'
								}
							]}>
						{
							tab => {
								switch ( tab.name ) {
									case 'desktop':{
										return(
											<Fragment>
												<SelectControl
													label={__('Vertical Alignment', 'getwid')}
													value={verticalAlign !== undefined ? verticalAlign : 'center'}
													onChange={verticalAlign => setAttributes({ verticalAlign })}
													options={[
														{ value: 'flex-start', label: __( 'Top'   , 'getwid' ) },
														{ value: 'center'    , label: __( 'Middle', 'getwid' ) },
														{ value: 'flex-end'  , label: __( 'Bottom', 'getwid' ) }
													]}
												/>
												<SelectControl
													label={__('Horizontal Alignment', 'getwid')}
													value={horizontalAlign !== undefined ? horizontalAlign : 'center'}
													onChange={horizontalAlign => setAttributes({ horizontalAlign })}
													options={[
														{ value: 'flex-start', label: __( 'Left'  , 'getwid' ) },
														{ value: 'center'    , label: __( 'Center', 'getwid' ) },
														{ value: 'flex-end'  , label: __( 'Right' , 'getwid' ) }
													]}
												/>
											</Fragment>
										)
									}
									case 'tablet': {
										return(
											<Fragment>
												<SelectControl
													label={__( 'Vertical Alignment', 'getwid' )}
													value={verticalAlignTablet !== undefined ? verticalAlignTablet : 'center'}
													onChange={verticalAlignTablet => setAttributes({verticalAlignTablet})}
													options={[
														{ value: ''          , label: __( 'Default', 'getwid' )},
														{ value: 'flex-start', label: __( 'Top'    , 'getwid' )},
														{ value: 'center'    , label: __( 'Middle' , 'getwid' )},
														{ value: 'flex-end'  , label: __( 'Bottom' , 'getwid' )}
													]}
												/>
												<SelectControl
													label={__( 'Horizontal Alignment', 'getwid' )}
													value={horizontalAlignTablet !== undefined ? horizontalAlignTablet : 'center'}
													onChange={horizontalAlignTablet => setAttributes({horizontalAlignTablet})}
													options={[
														{ value: ''          , label: __( 'Default', 'getwid' ) },
														{ value: 'flex-start', label: __( 'Left'   , 'getwid' ) },
														{ value: 'center'	 , label: __( 'Center' , 'getwid' ) },
														{ value: 'flex-end'  , label: __( 'Right'  , 'getwid' ) }
													]}
												/>
											</Fragment>
										)
									}
									case 'mobile': {
										return(
											<Fragment>
												<SelectControl
													label={__( 'Vertical Alignment', 'getwid' )}
													value={verticalAlignMobile !== undefined ? verticalAlignMobile : 'center'}
													onChange={verticalAlignMobile => setAttributes({ verticalAlignMobile })}
													options={[
														{ value: ''          , label: __( 'Default', 'getwid' ) },
														{ value: 'flex-start', label: __( 'Top'    , 'getwid' ) },
														{ value: 'center'    , label: __( 'Middle' , 'getwid' ) },
														{ value: 'flex-end'  , label: __( 'Bottom' , 'getwid' ) }
													]}
												/>
												<SelectControl
													label={__( 'Horizontal Alignment', 'getwid' )}
													value={horizontalAlignMobile !== undefined ? horizontalAlignMobile : 'center'}
													onChange={horizontalAlignMobile => setAttributes({ horizontalAlignMobile })}
													options={[
														{ value: ''          , label: __( 'Default', 'getwid') },
														{ value: 'flex-start', label: __( 'Left'   , 'getwid') },
														{ value: 'center'    , label: __( 'Center' , 'getwid') },
														{ value: 'flex-end'  , label: __( 'Right'  , 'getwid') }
													]}
												/>
											</Fragment>
										)
									}
								}
							}
						}
					</TabPanel>
				</BaseControl>
			</Fragment>
		);
	}

	renderSliderSettings(){

		const { sliderImages, sliderAnimationEffect, sliderAnimationDuration, sliderAnimationSpeed } = this.props.attributes;
		const { setAttributes } = this.props;

		const renderSliderImages = sliderImages.map(img => {
		    return (
		    	<img src={img.url} alt={img.alt}/>
		    );
		});

		return (
			<Fragment>
				{ sliderImages.length == 0 && (
					<MediaPlaceholder
						icon='format-gallery'
						labels={ {
							title: __( 'Slider', 'getwid' ),
							instructions: __( 'Drag images, upload new ones or select files from your library.', 'getwid' ),
						} }
						onSelect={this.onSelectSliderImages}
						accept='image/*'
						allowedTypes={ALLOWED_SLIDER_MEDIA_TYPES}
						multiple
					/>
				)}
				{ !!sliderImages.length && (
					<Fragment>
						<MediaUpload
							onSelect={ this.onSelectSliderImages }
							multiple
							allowedTypes={ALLOWED_SLIDER_MEDIA_TYPES}
							value={sliderImages !== undefined ? sliderImages.map( img => img.id ) : []}
							render={ ( { open } ) => (
								<BaseControl>
									{ !!sliderImages &&
										<div className='getwid-slider-image-wrapper'>
											{renderSliderImages}
										</div>
									}
									<ButtonGroup>
										<Button
											isPrimary
											onClick={open}
										>
											{__( 'Select Images', 'getwid' )}
										</Button>
										
										<Button onClick={ () => { setAttributes({ sliderImages: [] }) } } isDefault>
											{ __( 'Remove', 'getwid' ) }
										</Button>
									</ButtonGroup>
								</BaseControl>
							) }
						/>
						<RadioControl
							label={__( 'Animation Effect', 'getwid' )}
							selected={sliderAnimationEffect !== undefined ? sliderAnimationEffect : ''}
							options={ [
								{ value: ''    , label: __( 'Slide', 'getwid' ) },
								{ value: 'fade', label: __( 'Fade' , 'getwid' ) }
							] }
							onChange={sliderAnimationEffect => setAttributes({ sliderAnimationEffect }) }
						/>
						<TextControl
							label={__( 'Animation Duration', 'getwid' )}
							value={sliderAnimationDuration}
							type='number'
							min={0}
							onChange={sliderAnimationDuration => setAttributes({ sliderAnimationDuration })}
						/>
						<TextControl
							label={__( 'Animation Speed', 'getwid' )}
							type='number'
							value={sliderAnimationSpeed !== undefined ? sliderAnimationSpeed : ''}
							min={0}
							onChange={sliderAnimationSpeed => setAttributes({ sliderAnimationSpeed })}
						/>
					</Fragment>
				)}
			</Fragment>
		);
	}

	renderVideoSettings() {

		const { backgroundVideoUrl, backgroundVideoMute, backgroundVideoLoop, backgroundVideoAutoplay, backgroundVideoPoster, backgroundVideoControlsPosition } = this.props.attributes;
		const { setAttributes } = this.props;

		return (
			<Fragment>
				{
					backgroundVideoUrl && (
						<Fragment>
							<video controls>
								<source src={backgroundVideoUrl.url} type="video/mp4"/>
								<span>Your browser does not support the video tag.</span>
							</video>
						</Fragment>
					)						
				}

				<MediaUpload
					onSelect={backgroundVideoUrl => {
						setAttributes({ backgroundVideoUrl: undefined });
						setAttributes({
							backgroundVideoUrl: backgroundVideoUrl !== undefined ? pick( backgroundVideoUrl, [ 'alt', 'id', 'url' ] ) : {}
						});
					}}
					value={backgroundVideoUrl !== undefined ? backgroundVideoUrl.id : ''}
					allowedTypes={ALLOWED_VIDEO_MEDIA_TYPES}
					render={({ open }) => (
						<BaseControl>
							<Button
								isPrimary
								onClick={open}>
								{ __( 'Select Video', 'getwid' ) }
							</Button>
							{!!backgroundVideoUrl &&
								<Button onClick={() => { setAttributes({ backgroundVideoUrl: undefined }) }} isDefault>
									{__( 'Remove', 'getwid' )}
								</Button>
							}
						</BaseControl>
					)}
				/>
				{backgroundVideoUrl &&
				<Fragment>
					<CheckboxControl
						label={__( 'Mute', 'getwid' )}
						help={__( 'Enable this option to increase the chances for autoplay to succeed.', 'getwid' )}
						checked={ backgroundVideoMute !== undefined ? backgroundVideoMute : true}
						onChange={backgroundVideoMute => setAttributes({ backgroundVideoMute })}
					/>
					<CheckboxControl
						label={__( 'Repeat', 'getwid' )}
						checked={backgroundVideoLoop !== undefined ? backgroundVideoLoop : false}
						onChange={backgroundVideoLoop => setAttributes({ backgroundVideoLoop })}
					/>
					<CheckboxControl
						label={__( 'Autoplay', 'getwid' )}
						checked={backgroundVideoAutoplay !== undefined ? backgroundVideoAutoplay : false}
						onChange={backgroundVideoAutoplay => setAttributes({backgroundVideoAutoplay})}
					/>
					<MediaUpload
						label={__( 'Poster Image', 'getwid' )}
						onSelect={posterImageDetails => setAttributes({
							backgroundVideoPoster: posterImageDetails.url
						})}
						allowedTypes={ALLOWED_IMAGE_MEDIA_TYPES}
						value={ backgroundVideoPoster !== undefined ? backgroundVideoPoster : '' }
						render={({ open }) => (
							<BaseControl>
								<Button
									isDefault
									onClick={open}
								>
									{ ! backgroundVideoPoster  &&  __( 'Select Poster' , 'getwid' ) }
									{ !! backgroundVideoPoster &&  __( 'Replace Poster', 'getwid' ) }
								</Button>
							</BaseControl>
						) }
					/>
					{ !! backgroundVideoPoster &&
						<BaseControl>
							<Button onClick={ () => { setAttributes({ backgroundVideoPoster: undefined }) } } isLink isDestructive>
								{ __( 'Remove Poster', 'getwid' ) }
							</Button>
						</BaseControl>
					}
					<SelectControl
						label={__( 'Controls Position', 'getwid' )}
						value={backgroundVideoControlsPosition}
						onChange={backgroundVideoControlsPosition => setAttributes({ backgroundVideoControlsPosition })}
						options={[
							{ value: 'none'			, label: __( 'None'			, 'getwid' ) },
							{ value: 'top-left'		, label: __( 'Top Left'     , 'getwid' ) },
							{ value: 'top-right'    , label: __( 'Top Right'    , 'getwid' ) },
							{ value: 'bottom-left'  , label: __( 'Bottom Left'  , 'getwid' ) },
							{ value: 'bottom-right' , label: __( 'Bottom Right' , 'getwid' ) },
							{ value: 'center-center', label: __( 'Center Center', 'getwid' ) }
						]}
					/>
				</Fragment>
				}
			</Fragment>
		);
	}

	renderForegroundSettings() {

		const { foregroundOpacity, foregroundFilter } = this.props.attributes;
		const { setAttributes } = this.props;

		return (
			<Fragment>
				<RangeControl
					label={__( 'Overlay Layer Opacity', 'getwid' )}
					value={foregroundOpacity !== undefined ? foregroundOpacity : ''}
					onChange={foregroundOpacity => setAttributes({ foregroundOpacity })}
					min={0}
					max={100}
					step={1}
					allowReset
				/>
				<SelectControl
					label={__( 'Blend Mode', 'getwid' )}
					value={foregroundFilter !== undefined ? foregroundFilter : ''}
					onChange={foregroundFilter => setAttributes({ foregroundFilter })}
					options={[
						{ value: ''           , label: __( 'None'		, 'getwid' ) },
						{ value: 'normal'	  , label: __( 'Normal'     , 'getwid' ) },
						{ value: 'multiply'	  , label: __( 'Multiply'   , 'getwid' ) },
						{ value: 'screen'	  , label: __( 'Screen'     , 'getwid' ) },
						{ value: 'overlay'	  , label: __( 'Overlay'	, 'getwid' ) },
						{ value: 'darken'     , label: __( 'Darken'     , 'getwid' ) },
						{ value: 'lighten'    , label: __( 'Lighten'    , 'getwid' ) },
						{ value: 'color-dodge', label: __( 'Color Dodge', 'getwid' ) },
						{ value: 'color-burn' , label: __( 'Color Burn' , 'getwid' ) },
						{ value: 'hard-light' , label: __( 'Hard Light' , 'getwid' ) },
						{ value: 'soft-light' , label: __( 'Soft Light' , 'getwid' ) },
						{ value: 'difference' , label: __( 'Difference' , 'getwid' ) },
						{ value: 'exclusion'  , label: __( 'Exclusion'  , 'getwid' ) },
						{ value: 'hue'        , label: __( 'Hue'        , 'getwid' ) },
						{ value: 'saturation' , label: __( 'Saturation' , 'getwid' ) },
						{ value: 'color'      , label: __( 'Color'      , 'getwid' ) },
						{ value: 'luminosity' , label: __( 'Luminosity' , 'getwid' ) }
					]}
				/>
			</Fragment>
		);
	}

	renderForegroundColor() {

		const { foregroundColor } = this.props.attributes;
		const { setAttributes } = this.props;

		const editorColors = get( select( 'core/editor' ).getEditorSettings(), [ 'colors' ], [] );

		return (
			<Fragment>
				<BaseControl
					label={__( 'Overlay Color', 'getwid' )}
					className='components-getwid-color-palette-control'
				>
					{foregroundColor && (
						<ColorIndicator colorValue={foregroundColor}/>
					)}

					<ColorPalette
						colors= {editorColors }
						value= {foregroundColor }
						onChange= {foregroundColor => {
							setAttributes({ foregroundColor });
						}}
					/>
				</BaseControl>				
			</Fragment>
		);
	}

	renderForegroundImage() {

		const { foregroundImage, foregroundImagePosition, foregroundImageAttachment, foregroundImageRepeat, foregroundImageSize } = this.props.attributes;
		const { setAttributes } = this.props;

		const resetForegroundImage = () => {
			setAttributes({
				foregroundImage          : undefined,
				foregroundImagePosition  : undefined,
				foregroundImageAttachment: undefined,
				foregroundImageRepeat    : undefined,
				foregroundImageSize      : undefined
			})
		};

		return (
			<Fragment>
				{ !foregroundImage && (
					<MediaPlaceholder
						icon='format-image'
						labels={ {
							title: __( 'Image', 'getwid' ),
							instructions: __( 'Upload an image file, pick one from your media library, or add one with a URL.', 'getwid' ),
						} }
						onSelect={foregroundImage => {												
							setAttributes({
								foregroundImage: foregroundImage !== undefined ? pick( foregroundImage, [ 'alt', 'id', 'url' ] ) : {}
							});
							this.setState( () => ({ imagePopover: false }) );
						} }
						accept='image/*'
						allowedTypes={ALLOWED_IMAGE_MEDIA_TYPES}
					/>
				)}

				{ !!foregroundImage && (
					<MediaUpload
						onSelect={ foregroundImage => {
							setAttributes({
								foregroundImage: foregroundImage !== undefined ? pick( foregroundImage, [ 'alt', 'id', 'url' ] ) : {}
							});
						} }
						allowedTypes={ALLOWED_IMAGE_MEDIA_TYPES}
						value={ foregroundImage !== undefined ? foregroundImage.id : ''}
						render={ ({ open }) => (
							<BaseControl>
								{ !!foregroundImage.url &&
									<div
										onClick={ open }
										className='getwid-background-image-wrapper'
									>
										<img src={foregroundImage.url}/>
									</div>
								}

								<ButtonGroup>
									<Button
										isPrimary
										onClick={open}
									>
										{!foregroundImage.id  && __( 'Select Image' , 'getwid' )}
										{!!foregroundImage.id && __( 'Replace Image', 'getwid' )}
									</Button>

									{!!foregroundImage.id && (
										<Button isDefault onClick={resetForegroundImage}>
											{__( 'Remove Image', 'getwid' )}
										</Button>
									)}
								</ButtonGroup>
							</BaseControl>
						) }
					/>
				)}

				{foregroundImage &&
				<Fragment>
					<SelectControl
						label={__( 'Position', 'getwid' )}
						value={foregroundImagePosition !== undefined ? foregroundImagePosition : ''}
						onChange={foregroundImagePosition => setAttributes({ foregroundImagePosition })}
						options={[
							/*Center*/
							{ value: ''             , label: __( 'Default'      , 'getwid' ) },
							{ value: 'top left'     , label: __( 'Top Left'     , 'getwid' ) },
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
						value={foregroundImageAttachment !== undefined ? foregroundImageAttachment : ''}
						onChange={foregroundImageAttachment => setAttributes({ foregroundImageAttachment })}
						options={[
							/*Inherit*/
							{ value: ''      , label: __( 'Default', 'getwid' ) },
							{ value: 'scroll', label: __( 'Scroll' , 'getwid' ) },
							{ value: 'fixed' , label: __( 'Fixed'  , 'getwid' ) }
						]}
					/>
					<SelectControl
						label={__( 'Repeat', 'getwid' )}
						value={foregroundImageRepeat !== undefined ? foregroundImageRepeat : ''}
						onChange={foregroundImageRepeat => setAttributes({ foregroundImageRepeat })}
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
						label={__( 'Size', 'getwid' )}
						value={foregroundImageSize !== undefined ? foregroundImageSize : ''}
						onChange={foregroundImageSize => setAttributes({ foregroundImageSize })}
						options={[
							/*Cover*/
							{ value: ''       , label: __( 'Cover'  , 'getwid' ) },
							{ value: 'contain', label: __( 'Contain', 'getwid' ) },
							{ value: 'auto'   , label: __( 'Auto'   , 'getwid' ) }
						]}
					/>
				</Fragment>
				}			
			</Fragment>
		);
	}

	renderAnimationSettings() {

		const { entranceAnimation, entranceAnimationDuration, entranceAnimationDelay } = this.props.attributes;
		const { setAttributes } = this.props;

		const resetAnimation = () => {
			setAttributes({
				entranceAnimation: undefined,
				entranceAnimationDelay: '200ms',
				entranceAnimationDuration: '1500ms'
			})
		};

		return (
			<Fragment>
				<PanelBody title={__( 'Entrance Animation', 'getwid' )} initialOpen={false}>
					<GetwidAnimationSelectControl
						label={__( 'Animation Effect', 'getwid' )}
						allowAnimation={[ 'Entrance','Seeker' ]}
						value={entranceAnimation !== undefined ? entranceAnimation : ''}
						onChange={entranceAnimation => setAttributes({ entranceAnimation })}
					/>
					<SelectControl
						label={__( 'Duration', 'getwid' )}
						value={entranceAnimationDuration !== undefined ? entranceAnimationDuration : ''}
						onChange={entranceAnimationDuration => setAttributes({ entranceAnimationDuration })}
						options={[
							{ value: '2000ms', label: __( 'Slow'     , 'getwid' ) },
							{ value: '1500ms', label: __( 'Normal'   , 'getwid' ) },
							{ value: '800ms' , label: __( 'Fast'     , 'getwid' ) },
							{ value: '400ms' , label: __( 'Very Fast', 'getwid' ) }
						]}
					/>
					<TextControl
						label={__( 'Delay, ms', 'getwid' )}
						value={entranceAnimationDelay !== undefined ? entranceAnimationDelay.replace( 'ms', '' ) : ''}
						type='number'
						min={0}
						placeholder={200}
						onChange={entranceAnimationDelay => {
							entranceAnimationDelay = parseInt( entranceAnimationDelay );
							if ( isNaN( entranceAnimationDelay ) ) {
								entranceAnimationDelay = undefined;
							} else {
								entranceAnimationDelay = `${entranceAnimationDelay}ms`;
							}
							setAttributes({ entranceAnimationDelay });
						}}
					/>
					<BaseControl>
						<Button isLink
							onClick={resetAnimation}
							disabled={ !this.hasAnimation() }>
							{__( 'Reset', 'getwid' )}
						</Button>
					</BaseControl>					
				</PanelBody>
			</Fragment>
		);
	}

	onSelectSliderImages( images ) {
		this.props.setAttributes( {
			sliderImages: images !== undefined ? images.map( ( image ) => pick( image, [ 'alt', 'id', 'url' ] ) ) : [],
		} );
	}

}

export default compose( [
	withSelect( (select, props) => {
		const { getEditorSettings } = select( 'core/editor' );
		return {
			getEditorSettings
		};
	} ),
	withColors( 'backgroundColor' )
] )( Inspector );