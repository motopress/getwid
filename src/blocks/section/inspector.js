/**
* External dependencies
*/
import GetwidStyleLengthControl from 'GetwidControls/style-length-control';
import GetwidAnimationSelectControl from 'GetwidControls/animation-select-control'
import {renderPaddingsPanelWithTabs, renderMarginsPanelWithTabs} from 'GetwidUtils/render-inspector';

/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
import { pick } from 'lodash';

const { Component, Fragment } = wp.element;
const {
	InspectorControls,
	MediaUpload,
	MediaPlaceholder,
	PanelColorSettings,
	withColors
} = wp.editor;
const {
	BaseControl,
	Button,
	PanelBody,
	RangeControl,
	SelectControl,
	TextControl,
	CheckboxControl,
	RadioControl,
	ToggleControl,
	ButtonGroup,
	TabPanel,
	ExternalLink
} = wp.components;
const {compose} = wp.compose;


/**
* Module Constants
*/
const ALLOWED_SLIDER_MEDIA_TYPES = [ 'image' ];
const ALLOWED_IMAGE_MEDIA_TYPES = ['image'];
const ALLOWED_VIDEO_MEDIA_TYPES = ['video'];


/**
* Create an Inspector Controls
*/
class Inspector extends Component {

	constructor( props ) {
		super( ...arguments );
		this.onSelectSliderImages = this.onSelectSliderImages.bind( this );
	}

	render() {

		return (
		<InspectorControls key="inspector">
			{this.renderSizeSettings()}

			{renderPaddingsPanelWithTabs(this)}
			
			{renderMarginsPanelWithTabs(this)}

			{this.renderAlignmentSettings()}
			<PanelBody title={__('Background', 'getwid')} initialOpen={false}>
				{this.renderBackgoundColors()}
				{this.renderBackgroundImage()}
				{this.renderSliderSettings()}
				{this.renderVideoSettings()}
			</PanelBody>
			{this.renderForegroundSettings()}
			{this.renderDividersSettings()}
			{this.renderAnimationSettings()}
		</InspectorControls>
		);
	}

	hasAnimation(){
		const {attributes: {entranceAnimation, entranceAnimationDelay, entranceAnimationDuration}} = this.props;
		return entranceAnimation !== undefined ||
			entranceAnimationDelay !== '200ms' ||
			entranceAnimationDuration !== '1500ms';
	}

	renderBackgroundImage(){
		// Setup the attributes
		const {
			attributes: {
				backgroundImage, backgroundImagePosition,
				backgroundImageAttachment, backgroundImageRepeat, backgroundImageSize
			}, setAttributes
		} = this.props;

		return(
			<PanelBody title={__('Background Image', 'getwid')} initialOpen={false}>
				<MediaUpload
					onSelect={ backgroundImage => {
						setAttributes({
							backgroundImage: backgroundImage !== undefined ? pick(backgroundImage, ['alt', 'id', 'url']) : {}
						});
					} }
					value={ backgroundImage !== undefined ? backgroundImage.id : ''}
					allowedTypes={ALLOWED_IMAGE_MEDIA_TYPES}
					render={ ( { open } ) => (
						<BaseControl>
							{ !!backgroundImage &&
							<div className="getwid-background-image-wrapper">
								<img src={backgroundImage.url}/>
							</div>
							}
							<Button isPrimary onClick={ open } >
								{ __('Select Image', 'getwid') }
							</Button>
							{ !!backgroundImage &&
								<Button isDefault isDestructive onClick={ () => { setAttributes({backgroundImage: undefined}) } } >
									{ __( 'Remove', 'getwid' ) }
								</Button>
							}
						</BaseControl>
					) }
				/>
				{!!backgroundImage &&
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
				}
			</PanelBody>
		);
	}

	renderBackgoundColors(){
		// Setup the attributes
		const {
			attributes: {
				backgroundGradientType, backgroundGradientFirstColor, backgroundGradientFirstColorLocation,
				backgroundGradientSecondColor,  backgroundGradientSecondColorLocation, backgroundGradientAngle,
			},
			setAttributes,
			setBackgroundColor,
			backgroundColor
		} = this.props;

		const resetBackgroundGradient = () => {
			setAttributes({
				backgroundGradientType: undefined,
				backgroundGradientFirstColor: undefined,
				backgroundGradientFirstColorLocation: undefined,
				backgroundGradientSecondColor: undefined,
				backgroundGradientSecondColorLocation: undefined,
				backgroundGradientAngle: undefined
			});
		};

		return (
			<Fragment>
				<PanelColorSettings
					title={__('Background Color', 'getwid')}
					colorSettings={[
						{
							value: backgroundColor.color,
							onChange: setBackgroundColor,
							// onChange: backgroundColor => setAttributes({backgroundColor}),
							label: __('Background Color', 'getwid')
						}
					]}
				/>
				<PanelBody title={__('Background Gradient', 'getwid')} initialOpen={false}>
					<SelectControl
						value={backgroundGradientType !== undefined ? backgroundGradientType : ''}
						onChange={backgroundGradientType => setAttributes({backgroundGradientType})}
						options={[
							{value: '', label: __('None', 'getwid')},
							{value: 'linear', label: __('Linear', 'getwid')},
							{value: 'radial', label: __('Radial', 'getwid')},
						]}
					/>
					{ backgroundGradientType &&
						<Fragment>
							<BaseControl>
								<Button isLink onClick={resetBackgroundGradient}>
									{__('Reset', 'getwid')}
								</Button>
							</BaseControl>
							<PanelColorSettings
								title={__('Gradient Colors', 'getwid')}
								colorSettings={[
									{
										value: backgroundGradientFirstColor,
										onChange: backgroundGradientFirstColor => setAttributes({backgroundGradientFirstColor}),
										label: __('First Color', 'getwid')
									},
									{
										value: backgroundGradientSecondColor,
										onChange: backgroundGradientSecondColor => setAttributes({backgroundGradientSecondColor}),
										label: __('Second Color', 'getwid')
									}
								]}
							/>
							<RangeControl
								label={__('First Color Location', 'getwid')}
								value={backgroundGradientFirstColorLocation !== undefined ? backgroundGradientFirstColorLocation : ''}
								onChange={backgroundGradientFirstColorLocation => setAttributes({backgroundGradientFirstColorLocation})}
								placeholder={0}
								min={0}
								max={100}
								step={1}
							/>
							<RangeControl
								label={__('Second Color Location', 'getwid')}
								value={backgroundGradientSecondColorLocation !== undefined ? backgroundGradientSecondColorLocation : ''}
								onChange={backgroundGradientSecondColorLocation => setAttributes({backgroundGradientSecondColorLocation})}
								placeholder={100}
								min={0}
								max={100}
								step={1}
							/>
							{backgroundGradientType === 'linear' &&
								<RangeControl
									label={__('Angle', 'getwid')}
									value={backgroundGradientAngle !== undefined ? backgroundGradientAngle : ''}
									onChange={backgroundGradientAngle => setAttributes({backgroundGradientAngle})}
									placeholder={180}
									min={0}
									max={360}
									step={1}
								/>
							}
						</Fragment>
					}
				</PanelBody>
			</Fragment>
		);
	}

	renderDividersSettings(){
		// Setup the attributes
		const {
			attributes: {
				dividerTop, dividersTopHeight, dividerTopColor, dividerBottom, dividersBottomHeight, dividersBringTop, dividerBottomColor
			}, setAttributes
		} = this.props;
		
		const dividersOptions = [
			{value: '', label: __('None', 'getwid')},
/* tilt */
			{value: 'tilt', label: __('Tilt', 'getwid')},
			{value: 'tilt-negative', label: __('Tilt Negative', 'getwid')},
			{value: 'tilt-layered-1', label: __('Tilt Layered 1', 'getwid')},
			{value: 'tilt-layered-2', label: __('Tilt Layered 2 ', 'getwid')},
			{value: 'tilt-layered-3', label: __('Tilt Layered 3', 'getwid')},
/* split */
			{value: 'split', label: __('Split', 'getwid')},
			{value: 'split-negative', label: __('Split Negative', 'getwid')},
/* clouds */
			{value: 'clouds', label: __('Clouds', 'getwid')},
			{value: 'clouds-negative', label: __('Clouds Negative', 'getwid')},
/* book */
			{value: 'book', label: __('Book', 'getwid')},
			{value: 'book-negative', label: __('Book Negative', 'getwid')},
/* arrow */
			{value: 'arrow', label: __('Arrow', 'getwid')},
			{value: 'arrow-negative', label: __('Arrow Negative', 'getwid')},
/* triangle */
			{value: 'triangle-rounded', label: __('Triangle Rounded', 'getwid')},
			{value: 'triangle-negative-rounded', label: __('Triangle Rounded Negative', 'getwid')},
			{value: 'triangle-asymmetrical-rounded', label: __('Triangle Rounded Asymmetrical', 'getwid')},
			{value: 'triangle-asymmetrical-negative-rounded', label: __('Triangle Rounded Asymmetrical Negative', 'getwid')},
			{value: 'triangle', label: __('Triangle', 'getwid')},
			{value: 'triangle-negative', label: __('Triangle Negative', 'getwid')},
			{value: 'triangle-asymmetrical', label: __('Triangle Asymmetrical', 'getwid')},
			{value: 'triangle-asymmetrical-negative', label: __('Triangle Asymmetrical Negative', 'getwid')},
			{value: 'triangle-layered-asymmetrical', label: __('Triangle Layered Asymmetrical', 'getwid')},
/* waves */
			{value: 'waves', label: __('Waves', 'getwid')},
			{value: 'waves-light', label: __('Waves Light', 'getwid')},
			{value: 'waves-large', label: __('Waves Large', 'getwid')},
			{value: 'waves-large-negative', label: __('Waves Large Negative', 'getwid')},
			{value: 'waves-layered', label: __('Waves Layered', 'getwid')},
			{value: 'mountains', label: __('Waves Multi-Layered', 'getwid')},
			{value: 'waves-pattern', label: __('Waves Pattern', 'getwid')},
/* drips/drops */
			{value: 'drips', label: __('Drips', 'getwid')},
			{value: 'drips-negative', label: __('Drips Negative', 'getwid')},
			{value: 'drops', label: __('Drops', 'getwid')},
			{value: 'drops-negative', label: __('Drops Negative', 'getwid')},
			{value: 'tilted-drips', label: __('Tilted Drips', 'getwid')},
			{value: 'tilted-drips-negative', label: __('Tilted Drips Negative', 'getwid')},
/* pyramids */
			{value: 'pyramids', label: __('Pyramids', 'getwid')},
			{value: 'pyramids-negative', label: __('Pyramids Negative', 'getwid')},
			{value: 'pyramids-round', label: __('Pyramids Rounded', 'getwid')},
			{value: 'pyramids-round-negative', label: __('Pyramids Rounded Negative', 'getwid')},
			{value: 'opacity-pyramids', label: __('Pyramids Layered', 'getwid')},
/* curve */
			{value: 'curve', label: __('Curve', 'getwid')},
			{value: 'curve-negative', label: __('Curve Negative', 'getwid')},
			{value: 'curve-1', label: __('Curve 1', 'getwid')},
			{value: 'curve-2', label: __('Curve 2', 'getwid')},
			{value: 'curve-3', label: __('Curve 3', 'getwid')},
			{value: 'curve-4', label: __('Curve 4', 'getwid')},
			{value: 'curve-5', label: __('Curve 5', 'getwid')},
			{value: 'curve-6', label: __('Curve 6', 'getwid')},
			{value: 'curve-7', label: __('Curve 7', 'getwid')},
			{value: 'curve-8', label: __('Curve 8', 'getwid')},
			{value: 'curve-layered-1', label: __('Curve Layered 1', 'getwid')},
			{value: 'curve-layered-2', label: __('Curve Layered 2', 'getwid')},
			{value: 'curve-layered-3', label: __('Curve Layered 3', 'getwid')},
			{value: 'curve-layered-4', label: __('Curve Layered 4', 'getwid')},
/* zigzag */
			{value: 'zigzag-ice', label: __('Zigzag', 'getwid')},
			{value: 'zigzag-ice-negative', label: __('Zigzag Negative', 'getwid')},
			{value: 'zigzag-pattern', label: __('Zigzag Pattern', 'getwid')},
		];

		return (
			<PanelBody title={ __( 'Dividers', 'getwid' ) } initialOpen={false}>
				<SelectControl
					label={__('Top Divider', 'getwid')}
					value={dividerTop !== undefined ? dividerTop : ''}
					options={dividersOptions}
					onChange={dividerTop => setAttributes({dividerTop})}
				/>
				<GetwidStyleLengthControl
					label={__('Top Divider Height', 'getwid')}
					value={dividersTopHeight}
					units={[
						{label: 'px', value: 'px'},
						{label: 'vh', value: 'vh'},
						{label: 'vw', value: 'vw'},						
					]}
					onChange={dividersTopHeight => setAttributes({dividersTopHeight})}
				/>				
				<SelectControl
					label={__('Bottom Divider', 'getwid')}
					value={dividerBottom !== undefined ? dividerBottom : ''}
					options={dividersOptions}
					onChange={dividerBottom => setAttributes({dividerBottom})}
				/>
				<GetwidStyleLengthControl
					label={__('Bottom Divider Height', 'getwid')}
					value={dividersBottomHeight}
					units={[
						{label: 'px', value: 'px'},
						{label: 'vh', value: 'vh'},
						{label: 'vw', value: 'vw'},							
					]}
					onChange={dividersBottomHeight => setAttributes({dividersBottomHeight})}
				/>
				<ToggleControl
					label={ __( 'Bring dividers to top', 'getwid' ) }
					checked={ dividersBringTop }
					onChange={ () => {
						setAttributes( { dividersBringTop: !dividersBringTop } );
					}}
				/>							
				{
					( dividerTop || dividerBottom ) &&
					<PanelColorSettings
						title={__('Divider Color', 'getwid')}
						colorSettings={[
							...(dividerTop ? [{
								value: dividerTopColor,
								onChange: dividerTopColor => setAttributes({dividerTopColor}),
								label: __('Top', 'getwid')
							}] : []),
							...(dividerBottom ? [{
								value: dividerBottomColor,
								onChange: dividerBottomColor => setAttributes({dividerBottomColor}),
								label: __('Bottom', 'getwid')
							}] : []),
						]}
					/>
				}
			</PanelBody>
		);
	}
	
	renderSizeSettings() {
		// Setup the attributes
		const {
			contentMaxWidth, minHeight, gapSize,
			resetMinHeightTablet, resetMinHeightMobile,
			contentMaxWidthPreset,
		} = this.props.attributes;
		const { setAttributes } = this.props;

		return (
			<PanelBody title={__('Size', 'getwid')}>
				<RadioControl
					label={__('Content Width', 'getwid')}
					selected={ contentMaxWidthPreset !== undefined ? contentMaxWidthPreset : 'boxed' }
					options={ [
						{value: 'boxed', label: __('Boxed', 'getwid')},
						{value: 'full', label: __('Full Width', 'getwid')},
						{value: 'custom', label: __('Custom', 'getwid')},
					] }
					onChange={contentMaxWidthPreset => setAttributes({contentMaxWidthPreset})}
				/>
				{ contentMaxWidthPreset === 'custom' &&
					<RangeControl
						value={contentMaxWidth !== undefined ? contentMaxWidth : ''}
						onChange={contentMaxWidth => {
							setAttributes({contentMaxWidth});
						}}
						allowReset
						min={0}
						max={2000}
						step={1}
					/>
				}
				<BaseControl
					label={__('Set the default width of the content area in Writing Settings.', 'getwid')}
				>
					<ExternalLink href={Getwid.options_writing_url}>{ __('Writing Settings', 'getwid' ) }</ExternalLink>
				</BaseControl>
				<TabPanel className="getwid-editor-tabs"
						  activeClass="is-active"
						  tabs={ [
							  {
								  name: 'desktop',
								  title: __('Desktop', 'getwid'),
								  className: 'components-button is-link is-small',
							  },
							  {
								  name: 'tablet',
								  title: __('Tablet', 'getwid'),
								  className: 'components-button is-link is-small',
							  },
							  {
								  name: 'mobile',
								  title: __('Mobile', 'getwid'),
								  className: 'components-button is-link is-small',
							  },
						  ] }>
					{
						(tab) => {
							switch (tab.name){
								case 'desktop':{
									return(
										<Fragment>
											<GetwidStyleLengthControl
												label={__('Section Height', 'getwid')}
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
									)
								}
								case 'tablet':{
									return(
										<Fragment>
											<CheckboxControl
												label={__('Reset height on tablet', 'getwid')}
												checked={ resetMinHeightTablet !== undefined ? resetMinHeightTablet : false}
												onChange={resetMinHeightTablet => setAttributes({resetMinHeightTablet})}
											/>
										</Fragment>
									)
								}
								case 'mobile':{
									return(
										<Fragment>
											<CheckboxControl
												label={__('Reset height on mobile', 'getwid')}
												checked={ resetMinHeightMobile !== undefined ? resetMinHeightMobile : false}
												onChange={resetMinHeightMobile => setAttributes({resetMinHeightMobile})}
											/>
										</Fragment>
									)
								}
							}
						}

					}
				</TabPanel>

				<SelectControl
					label={__('Inner Blocks Gap', 'getwid')}
					value={gapSize !== undefined ? gapSize : undefined}
					onChange={gapSize => setAttributes({gapSize})}
					options={[
						{value: '', label: __('Default', 'getwid')},
						{value: 'small', label: __('Small', 'getwid')},
						{value: 'medium', label: __('Medium', 'getwid')},
						{value: 'normal', label: __('Normal', 'getwid')},
						{value: 'large', label: __('Large', 'getwid')},
						{value: 'huge', label: __('Huge', 'getwid')},
						{value: 'none', label: __('None', 'getwid')},
					]}
				/>

			</PanelBody>
		);
	}

	renderAlignmentSettings() {
		// Setup the attributes
		const {
			verticalAlign, horizontalAlign,
			verticalAlignTablet, horizontalAlignTablet,
			verticalAlignMobile, horizontalAlignMobile,
		} = this.props.attributes;
		const { setAttributes } = this.props;

		return (
			<PanelBody title={__('Alignment', 'getwid')} initialOpen={false}>
				<TabPanel className="getwid-editor-tabs"
						  activeClass="is-active"
						  tabs={ [
							  {
								  name: 'desktop',
								  title: __('Desktop', 'getwid'),
								  className: 'components-button is-link is-small',
							  },
							  {
								  name: 'tablet',
								  title: __('Tablet', 'getwid'),
								  className: 'components-button is-link is-small',
							  },
							  {
								  name: 'mobile',
								  title: __('Mobile', 'getwid'),
								  className: 'components-button is-link is-small',
							  },
						  ] }>
					{
						(tab) => {
							switch (tab.name){
								case 'desktop':{
									return(
										<Fragment>
											<SelectControl
												label={__('Vertical Alignment', 'getwid')}
												value={verticalAlign !== undefined ? verticalAlign : 'center'}
												onChange={verticalAlign => setAttributes({verticalAlign})}
												options={[
													{value: 'flex-start', label: __('Top', 'getwid')},
													{value: 'center', label: __('Middle', 'getwid')},
													{value: 'flex-end', label: __('Bottom', 'getwid')},
												]}
											/>
											<SelectControl
												label={__('Horizontal Alignment', 'getwid')}
												value={horizontalAlign !== undefined ? horizontalAlign : 'center'}
												onChange={horizontalAlign => setAttributes({horizontalAlign})}
												options={[
													{value: 'flex-start', label: __('Left', 'getwid')},
													{value: 'center', label: __('Center', 'getwid')},
													{value: 'flex-end', label: __('Right', 'getwid')},
												]}
											/>
										</Fragment>
									)
								}
								case 'tablet':{
									return(
										<Fragment>
											<SelectControl
												label={__('Vertical Alignment', 'getwid')}
												value={verticalAlignTablet !== undefined ? verticalAlignTablet : 'center'}
												onChange={verticalAlignTablet => setAttributes({verticalAlignTablet})}
												options={[
													{value: '', label: __('Default', 'getwid')},
													{value: 'flex-start', label: __('Top', 'getwid')},
													{value: 'center', label: __('Middle', 'getwid')},
													{value: 'flex-end', label: __('Bottom', 'getwid')},
												]}
											/>
											<SelectControl
												label={__('Horizontal Alignment', 'getwid')}
												value={horizontalAlignTablet !== undefined ? horizontalAlignTablet : 'center'}
												onChange={horizontalAlignTablet => setAttributes({horizontalAlignTablet})}
												options={[
													{value: '', label: __('Default', 'getwid')},
													{value: 'flex-start', label: __('Left', 'getwid')},
													{value: 'center', label: __('Center', 'getwid')},
													{value: 'flex-end', label: __('Right', 'getwid')},
												]}
											/>
										</Fragment>
									)
								}
								case 'mobile':{
									return(
										<Fragment>
											<SelectControl
												label={__('Vertical Alignment', 'getwid')}
												value={verticalAlignMobile !== undefined ? verticalAlignMobile : 'center'}
												onChange={verticalAlignMobile => setAttributes({verticalAlignMobile})}
												options={[
													{value: '', label: __('Default', 'getwid')},
													{value: 'flex-start', label: __('Top', 'getwid')},
													{value: 'center', label: __('Middle', 'getwid')},
													{value: 'flex-end', label: __('Bottom', 'getwid')},
												]}
											/>
											<SelectControl
												label={__('Horizontal Alignment', 'getwid')}
												value={horizontalAlignMobile !== undefined ? horizontalAlignMobile : 'center'}
												onChange={horizontalAlignMobile => setAttributes({horizontalAlignMobile})}
												options={[
													{value: '', label: __('Default', 'getwid')},
													{value: 'flex-start', label: __('Left', 'getwid')},
													{value: 'center', label: __('Center', 'getwid')},
													{value: 'flex-end', label: __('Right', 'getwid')},
												]}
											/>
										</Fragment>
									)
								}
							}
						}

					}
				</TabPanel>
			</PanelBody>
		);
	}

	renderSliderSettings(){
		// Setup the attributes
		const {
			attributes: {
				sliderImages, sliderAnimationEffect, sliderAnimationDuration, sliderAnimationSpeed
			},
			setAttributes,
		} = this.props;

		const renderSliderImages = sliderImages.map(( img ) => {
		    return (
		    	<img src = {img.url} alt = {img.alt}/>
		    );
		});

		return (
			<Fragment>
				<PanelBody title={ __( 'Background Slider', 'getwid' ) } initialOpen={false}>
					{ sliderImages.length == 0 && (
						<MediaPlaceholder
							icon="format-gallery"
							// className={ className }
							labels={ {
								title: __( 'Slider', 'getwid' ),
								instructions: __( 'Drag images, upload new ones or select files from your library.', 'getwid' ),
							} }
							onSelect={ this.onSelectSliderImages }
							accept="image/*"
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
								value={ sliderImages !== undefined ? sliderImages.map( ( img ) => img.id ) : [] }
								render={ ( { open } ) => (
									<BaseControl>
										{ !!sliderImages &&
											<div className="getwid-slider-image-wrapper">
												{ renderSliderImages }
											</div>
										}
										<ButtonGroup>
											<Button
												isPrimary
												onClick={ open }
											>
												{__('Select Images', 'getwid')}
											</Button>
											<Button onClick={ () => { setAttributes({sliderImages: []}) } } isDefault>
												{ __( 'Remove', 'getwid' ) }
											</Button>
										</ButtonGroup>
									</BaseControl>
								) }
							/>
							<RadioControl
							    label={__('Animation Effect', 'getwid')}
							    selected={ sliderAnimationEffect !== undefined ? sliderAnimationEffect : '' }
							    options={ [
									{value: '', label: __('Slide', 'getwid')},
									{value: 'fade', label: __('Fade', 'getwid')},
							    ] }
							    onChange={sliderAnimationEffect => setAttributes({sliderAnimationEffect}) }
							/>
							<TextControl
								label={__('Animation Duration', 'getwid')}
								value={sliderAnimationDuration}
								type={'number'}
								min={0}
								onChange={sliderAnimationDuration => setAttributes({sliderAnimationDuration})}
							/>
							<TextControl
								label={__('Animation Speed', 'getwid')}
								type={'number'}
								value={sliderAnimationSpeed !== undefined ? sliderAnimationSpeed : ''}
								min={0}
								onChange={sliderAnimationSpeed => setAttributes({sliderAnimationSpeed})}
							/>
						</Fragment>
					)}
				</PanelBody>
			</Fragment>
		);
	}

	renderVideoSettings(){
		const {
			attributes: {
				backgroundVideoUrl,
				backgroundVideoMute,
				backgroundVideoLoop,
				backgroundVideoAutoplay,
				backgroundVideoPoster,
				backgroundVideoControlsPosition,
			},
			setAttributes
		} = this.props;

		return (
			<PanelBody title={ __( 'Background Video', 'getwid' ) } initialOpen={false}>
				{
					backgroundVideoUrl &&
						<Fragment>
							<video controls>
								<source src={backgroundVideoUrl.url} type="video/mp4"/>
								<span>Your browser does not support the video tag.</span>
							</video>
						</Fragment>
				}

				<MediaUpload
					onSelect={backgroundVideoUrl => {
						setAttributes({ backgroundVideoUrl: undefined });
						setAttributes({
							backgroundVideoUrl: backgroundVideoUrl !== undefined ? pick(backgroundVideoUrl, ['alt', 'id', 'url']) : {}
						});
					}}
					value={backgroundVideoUrl !== undefined ? backgroundVideoUrl.id : ''}
					allowedTypes={ALLOWED_VIDEO_MEDIA_TYPES}
					render={({ open }) => (
						<BaseControl>
							<Button
								isPrimary
								onClick={open}>
								{ __('Select Video', 'getwid') }
							</Button>
							{!!backgroundVideoUrl &&
								<Button onClick={() => { setAttributes({ backgroundVideoUrl: undefined }) }} isDefault>
									{__('Remove', 'getwid')}
								</Button>
							}
						</BaseControl>
					)}
				/>
				{backgroundVideoUrl &&
				<Fragment>
					<CheckboxControl
						label={__('Mute', 'getwid')}
						help={__('Enable this option to increase the chances for autoplay to succeed.', 'getwid')}
						checked={ backgroundVideoMute !== undefined ? backgroundVideoMute : true}
						onChange={backgroundVideoMute => setAttributes({backgroundVideoMute})}
					/>
					<CheckboxControl
						label={__('Repeat', 'getwid')}
						checked={ backgroundVideoLoop !== undefined ? backgroundVideoLoop : false}
						onChange={backgroundVideoLoop => setAttributes({backgroundVideoLoop})}
					/>
					<CheckboxControl
						label={__('Autoplay', 'getwid')}
						checked={ backgroundVideoAutoplay !== undefined ? backgroundVideoAutoplay : false }
						onChange={ backgroundVideoAutoplay => setAttributes({backgroundVideoAutoplay}) }
					/>
					<MediaUpload
						label={__('Poster Image', 'getwid')}
						onSelect={posterImageDetails => setAttributes({
							backgroundVideoPoster: posterImageDetails.url
						})}
						allowedTypes={ALLOWED_IMAGE_MEDIA_TYPES}
						value={ backgroundVideoPoster !== undefined ? backgroundVideoPoster : '' }
						render={ ( { open } ) => (
							<BaseControl>
								<Button
									isDefault
									onClick={ open }
								>
									{ ! backgroundVideoPoster &&  __('Select Poster', 'getwid') }
									{ !! backgroundVideoPoster &&  __('Replace Poster', 'getwid') }
								</Button>
							</BaseControl>
						) }
					/>
					{ !! backgroundVideoPoster &&
						<BaseControl>
							<Button onClick={ () => { setAttributes({backgroundVideoPoster: undefined}) } } isLink isDestructive>
								{ __( 'Remove Poster', 'getwid' ) }
							</Button>
						</BaseControl>
					}
					<SelectControl
						label={__('Controls Position', 'getwid')}
						value={ backgroundVideoControlsPosition }
						onChange={ backgroundVideoControlsPosition => setAttributes({backgroundVideoControlsPosition}) }
						options={[
							{value: 'none', label: __('None', 'getwid')},
							{value: 'top-left', label: __('Top Left', 'getwid')},
							{value: 'top-right', label: __('Top Right', 'getwid')},
							{value: 'bottom-left', label: __('Bottom Left', 'getwid')},
							{value: 'bottom-right', label: __('Bottom Right', 'getwid')},
							{value: 'center-center', label: __('Center Center', 'getwid')},
						]}
					/>
				</Fragment>
				}
			</PanelBody>
		);
	}

	renderForegroundSettings(){
		// Setup the attributes
		const {
			attributes: {
				foregroundOpacity,
				foregroundColor,
				foregroundImage,
				foregroundImagePosition,
				foregroundImageAttachment,
				foregroundImageRepeat,
				foregroundImageSize,
				foregroundFilter,
				foregroundGradientType,
				foregroundGradientFirstColor,
				foregroundGradientFirstColorLocation,
				foregroundGradientSecondColor,
				foregroundGradientSecondColorLocation,
				foregroundGradientAngle,
			}, setAttributes
		} = this.props;

		const resetForegroundGradient = () => {
			setAttributes({
				foregroundGradientType: undefined,
				foregroundGradientFirstColor: undefined,
				foregroundGradientFirstColorLocation: undefined,
				foregroundGradientSecondColor: undefined,
				foregroundGradientSecondColorLocation: undefined,
				foregroundGradientAngle: undefined,
				foregroundGradientCustomEnable: undefined,
				foregroundGradientCustom: undefined,
			})
		};

		const resetForegroundImage = () => {
			setAttributes({
				foregroundImage: undefined,
				foregroundImagePosition: undefined,
				foregroundImageAttachment: undefined,
				foregroundImageRepeat: undefined,
				foregroundImageSize: undefined
			})
		};

		return (
// Foreground
			<PanelBody title={__('Foreground', 'getwid')} initialOpen={false}>
				<RangeControl
					label={__('Foreground Layer Opacity', 'getwid')}
					value={foregroundOpacity !== undefined ? foregroundOpacity : ''}
					onChange={foregroundOpacity => setAttributes({foregroundOpacity})}
					min={0}
					max={100}
					step={1}
					allowReset
				/>
				<SelectControl
					label={__('Blend Mode', 'getwid')}
					value={foregroundFilter !== undefined ? foregroundFilter : ''}
					onChange={foregroundFilter => setAttributes({foregroundFilter})}
					options={[
						{value: '', label: __('None', 'getwid')},
						{value: 'normal', label: __('Normal', 'getwid')},
						{value: 'multiply', label: __('Multiply', 'getwid')},
						{value: 'screen', label: __('Screen', 'getwid')},
						{value: 'overlay', label: __('Overlay', 'getwid')},
						{value: 'darken', label: __('Darken', 'getwid')},
						{value: 'lighten', label: __('Lighten', 'getwid')},
						{value: 'color-dodge', label: __('Color Dodge', 'getwid')},
						{value: 'color-burn', label: __('Color Burn', 'getwid')},
						{value: 'hard-light', label: __('Hard Light', 'getwid')},
						{value: 'soft-light', label: __('Soft Light', 'getwid')},
						{value: 'difference', label: __('Difference', 'getwid')},
						{value: 'exclusion', label: __('Exclusion', 'getwid')},
						{value: 'hue', label: __('Hue', 'getwid')},
						{value: 'saturation', label: __('Saturation', 'getwid')},
						{value: 'color', label: __('Color', 'getwid')},
						{value: 'luminosity', label: __('Luminosity', 'getwid')},
					]}
				/>
				<PanelColorSettings
					title={__('Foreground Color', 'getwid')}
					colorSettings={[
						{
							value: foregroundColor,
							onChange: foregroundColor => setAttributes({foregroundColor}),
							label: __('Foreground Color', 'getwid')
						}
					]}
					initialOpen={false}
				/>
				<PanelBody title={__('Foreground Gradient', 'getwid')} initialOpen={false}>
					<SelectControl
						value={foregroundGradientType !== undefined ? foregroundGradientType : ''}
						onChange={foregroundGradientType => setAttributes({foregroundGradientType})}
						options={[
							{value: '', label: __('None', 'getwid')},
							{value: 'linear', label: __('Linear', 'getwid')},
							{value: 'radial', label: __('Radial', 'getwid')},
						]}
					/>
					{ foregroundGradientType &&
					<Fragment>
						<Button isSmall onClick={resetForegroundGradient}>
							{__('Reset', 'getwid')}
						</Button>
						<PanelColorSettings
							title={__('Gradient Colors', 'getwid')}
							colorSettings={[
								{
									value: foregroundGradientFirstColor,
									onChange: foregroundGradientFirstColor => setAttributes({foregroundGradientFirstColor}),
									label: __('First Color', 'getwid')
								},
								{
									value: foregroundGradientSecondColor,
									onChange: foregroundGradientSecondColor => setAttributes({foregroundGradientSecondColor}),
									label: __('Second Color', 'getwid')
								}
							]}
						/>
						<RangeControl
							label={__('First Color Location', 'getwid')}
							value={foregroundGradientFirstColorLocation !== undefined ? foregroundGradientFirstColorLocation : ''}
							onChange={foregroundGradientFirstColorLocation => setAttributes({foregroundGradientFirstColorLocation})}
							placeholder={0}
							min={0}
							max={100}
							step={1}
						/>
						<RangeControl
							label={__('Second Color Location', 'getwid')}
							value={foregroundGradientSecondColorLocation !== undefined ? foregroundGradientSecondColorLocation : ''}
							onChange={foregroundGradientSecondColorLocation => setAttributes({foregroundGradientSecondColorLocation})}
							placeholder={100}
							min={0}
							max={100}
							step={1}
						/>
						{foregroundGradientType === 'linear' && (
							<RangeControl
								label={__('Angle', 'getwid')}
								value={foregroundGradientAngle !== undefined ? foregroundGradientAngle : ''}
								onChange={foregroundGradientAngle => setAttributes({foregroundGradientAngle})}
								placeholder={180}
								min={0}
								max={360}
								step={1}
							/>
						)}
					</Fragment>
					}
				</PanelBody>
				<PanelBody title={__('Foreground Image', 'getwid')} initialOpen={false}>
					<MediaUpload
						label={__('Image', 'getwid')}
						onSelect={ foregroundImage => {
							setAttributes({
								foregroundImage: foregroundImage.url
							});
						} }
						allowedTypes={ALLOWED_IMAGE_MEDIA_TYPES}
						value={ foregroundImage !== undefined ? foregroundImage : ''}
						render={ ( { open } ) => (
							<BaseControl>
								{ !!foregroundImage &&
								<div className="getwid-background-image-wrapper">
									<img src={foregroundImage} />
								</div>
								}							
								<Button
									isPrimary
									onClick={ open }
								>
									{ __('Select Image', 'getwid') }
								</Button>
								{
									!!foregroundImage &&
										<Button isDefault onClick={resetForegroundImage}>
											{ __('Remove', 'getwid') }
										</Button>
								}
							</BaseControl>
						) }
					/>
					{foregroundImage &&
					<Fragment>
						<SelectControl
							label={__('Position', 'getwid')}
							value={foregroundImagePosition !== undefined ? foregroundImagePosition : ''}
							onChange={foregroundImagePosition => setAttributes({foregroundImagePosition})}
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
							value={foregroundImageAttachment !== undefined ? foregroundImageAttachment : ''}
							onChange={foregroundImageAttachment => setAttributes({foregroundImageAttachment})}
							options={[
								/*Inherit*/
								{value: '', label: __('Default', 'getwid')},
								{value: 'scroll', label: __('Scroll', 'getwid')},
								{value: 'fixed', label: __('Fixed', 'getwid')},
							]}
						/>
						<SelectControl
							label={__('Repeat', 'getwid')}
							value={foregroundImageRepeat !== undefined ? foregroundImageRepeat : ''}
							onChange={foregroundImageRepeat => setAttributes({foregroundImageRepeat})}
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
							value={foregroundImageSize !== undefined ? foregroundImageSize : ''}
							onChange={foregroundImageSize => setAttributes({foregroundImageSize})}
							options={[
								/*Cover*/
								{value: '', label: __('Cover', 'getwid')},
								{value: 'contain', label: __('Contain', 'getwid')},
								{value: 'auto', label: __('Auto', 'getwid')},
							]}
						/>
					</Fragment>
					}
				</PanelBody>
			</PanelBody>
		);
	}

	renderAnimationSettings(){
		// Setup the attributes
		const {
			attributes: {
				entranceAnimation,
				entranceAnimationDuration,
				entranceAnimationDelay,
			}, setAttributes
		} = this.props;

		const resetAnimation = () => {
			setAttributes({
				entranceAnimation: undefined,
				entranceAnimationDelay: '200ms',
				entranceAnimationDuration: '1500ms'
			})
		};

		return (
			<Fragment>
				<PanelBody title={__('Entrance Animation', 'getwid')} initialOpen={false}>
					<GetwidAnimationSelectControl
						label={__('Animation Effect', 'getwid')}
						allowAnimation={['Entrance','Seeker']}
						value={entranceAnimation !== undefined ? entranceAnimation : ''}
						onChange={entranceAnimation => setAttributes({entranceAnimation})}
					/>
					<SelectControl
						label={__('Duration', 'getwid')}
						value={entranceAnimationDuration !== undefined ? entranceAnimationDuration : ''}
						onChange={entranceAnimationDuration => setAttributes({entranceAnimationDuration})}
						options={[
							{value: '2000ms', label: __('Slow', 'getwid')},
							{value: '1500ms', label: __('Normal', 'getwid')},
							{value: '800ms', label: __('Fast', 'getwid')},
							{value: '400ms', label: __('Very Fast', 'getwid')},
						]}
					/>
					<TextControl
						label={__('Delay, ms', 'getwid')}
						value={entranceAnimationDelay !== undefined ? entranceAnimationDelay.replace('ms', '') : ''}
						type={'number'}
						min={0}
						placeholder={200}
						onChange={entranceAnimationDelay => {
							entranceAnimationDelay = parseInt(entranceAnimationDelay);
							if (isNaN(entranceAnimationDelay)) {
								entranceAnimationDelay = undefined;
							} else {
								entranceAnimationDelay = `${entranceAnimationDelay}ms`;
							}
							setAttributes({entranceAnimationDelay})
						}}
					/>

					<BaseControl>
						<Button isLink
							onClick={resetAnimation}
							disabled={ !this.hasAnimation() }>
							{__('Reset', 'getwid')}
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
	withColors( 'backgroundColor' ),
	// applyFallbackStyles,
] )( Inspector );