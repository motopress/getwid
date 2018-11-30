/**
 * Inspector Controls
 */

import GetwidStyleLengthControl from 'GetwidControls/style-length-control';
import GetwidAnimationSelectControl from 'GetwidControls/animation-select-control';
import {
	pick,
	times
} from "lodash";

const { __ } = wp.i18n;
const {
	Component,
	Fragment,
} = wp.element;
const {
	InnerBlocks,
	InspectorControls,
	ColorPalette,
	RichText,
	BlockControls,
	AlignmentToolbar,
	BlockAlignmentToolbar,
	MediaUpload,
	MediaPlaceholder,
	PanelColorSettings
} = wp.editor;
const {
	Button,
	BaseControl,
	ButtonGroup,
	Tooltip,
	TabPanel,
	IconButton,
	Dashicon,
	PanelBody,
	RangeControl,
	ToggleControl,
	SelectControl,
	DropdownMenu,
	Toolbar,
	RadioControl,
	TextControl,
	CheckboxControl
} = wp.components;

const ALLOWED_IMAGE_MEDIA_TYPES = ['image'];

/**
 * Create an Inspector Controls wrapper Component
 */
class Inspector extends Component {

	constructor( props ) {
		super( ...arguments );	
	}

	render() {

		const {
			attributes: {
				uniqueID,
				slideCount,
				contentMaxWidth,
				minHeight,
				verticalAlign,
				horizontalAlign,
				paddingTop,
				paddingBottom,
				paddingLeft,
				paddingRight,
				titleColor,
				contentColor,
				backgroundColor,
				backgroundGradientFirstColor,
				backgroundGradientFirstColorLocation,
				backgroundGradientSecondColor,
				backgroundGradientSecondColorLocation,
				backgroundGradientType,
				backgroundGradientAngle,
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
				contentAnimation,
				contentAnimationDuration,
				contentAnimationDelay,
				sliderAnimationEffect,
				sliderAutoplay,
				sliderAutoplaySpeed,
				sliderAnimationSpeed,
				currentSlide,
				selectedSlide,
				slideAlignment,
				align,
				sliderArrays,
			},
			setAttributes,
			updateArrValues
		} = this.props;

		//*********RENDER PARTS*********
		const renderSliderSettings = () => {		
			return (
				<Fragment>
					<RadioControl
					    label={__('Animation Effect', 'getwid')}
					    selected={ sliderAnimationEffect !== undefined ? sliderAnimationEffect : '' }
					    options={ [
							{value: '', label: __('Slide', 'getwid')},
							{value: 'fade', label: __('Fade', 'getwid')},
					    ] }
					    onChange={sliderAnimationEffect => setAttributes({sliderAnimationEffect}) }
					/>

					<ToggleControl
					    label="Autoplay"
					    checked={ sliderAutoplay }
					    onChange={ () => setAttributes({sliderAutoplay: !sliderAutoplay}) }
					/>
					{sliderAutoplay &&
						<TextControl
							label={__('Autoplay Speed', 'getwid')}
							type={'number'}
							value={sliderAutoplaySpeed !== undefined ? sliderAutoplaySpeed : ''}
							min={0}
							onChange={sliderAutoplaySpeed => setAttributes({sliderAutoplaySpeed})}
						/>
					}
					
					<TextControl
						label={__('Animation Speed', 'getwid')}
						type={'number'}
						value={sliderAnimationSpeed !== undefined ? sliderAnimationSpeed : ''}
						min={0}
						onChange={sliderAnimationSpeed => setAttributes({sliderAnimationSpeed})}
					/>
				</Fragment>
			);
		};

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

		const renderBackgoundSettings = () => {		
			return (
				<Fragment>
					<PanelColorSettings
						title={__('Background Color', 'getwid')}
						colorSettings={[
							{
								value: backgroundColor,
								onChange: backgroundColor => setAttributes({backgroundColor}),
								label: __('Background Color', 'getwid')
							}
						]}
						initialOpen={false}
					/>
					<PanelBody title={__('Gradient', 'getwid')} initialOpen={false}>
						<SelectControl
							value={backgroundGradientType !== undefined ? backgroundGradientType : ''}
							onChange={backgroundGradientType => setAttributes({backgroundGradientType})}
							options={[
								{value: '', label: __('-', 'getwid')},
								{value: 'linear', label: __('Linear', 'getwid')},
								{value: 'radial', label: __('Radial', 'getwid')},
							]}
						/>
						{ backgroundGradientType &&
							<Fragment>
								<Button isLink isDestructive onClick={resetBackgroundGradient}>
									{__('Reset', 'getwid')}
								</Button>
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
		};

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

		const renderForegroundSettings = () => {		
			return (
				<Fragment>
					<RangeControl
						label={__('Opacity', 'getwid')}
						value={foregroundOpacity !== undefined ? foregroundOpacity : ''}
						onChange={foregroundOpacity => setAttributes({foregroundOpacity})}
						min={0}
						max={100}
						step={1}
					/>
					<SelectControl
						label={__('Filters', 'getwid')}
						value={foregroundFilter !== undefined ? foregroundFilter : ''}
						onChange={foregroundFilter => setAttributes({foregroundFilter})}
						options={[
							{value: '', label: __('-', 'getwid')},
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
					<PanelBody title={__('Gradient', 'getwid')} initialOpen={false}>
						<SelectControl
							value={foregroundGradientType !== undefined ? foregroundGradientType : ''}
							onChange={foregroundGradientType => setAttributes({foregroundGradientType})}
							options={[
								{value: '', label: __('-', 'getwid')},
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
								title={__('Foreground Gradient Colors', 'getwid')}
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
									<div className="background-img">
										<img src={foregroundImage} />
									</div>
									}							
									<Button
										isDefault
										onClick={ open }
									>
										{!foregroundImage && __('Select Image', 'getwid')}
										{!!foregroundImage && __('Replace Image', 'getwid')}
									</Button>
									{
										!!foregroundImage &&
										<Fragment>
											<br />
											<Button isLink isDestructive onClick={resetForegroundImage}>
												{ __('Remove', 'getwid') }
											</Button>
										</Fragment>
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
									{value: '', label: __('Center', 'getwid')},
									{value: 'top left', label: __('Top Left', 'getwid')},
									{value: 'top center', label: __('Top', 'getwid')},
									{value: 'top right', label: __('Top Right', 'getwid')},
									{value: 'center left', label: __('Left', 'getwid')},
									{value: 'center right', label: __('Right', 'getwid')},
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
									{value: '', label: __('-', 'getwid')},
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
									{value: '', label: __('-', 'getwid')},
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
									/*Auto*/
									{value: '', label: __('-', 'getwid')},
									{value: 'cover', label: __('Cover', 'getwid')},
									{value: 'contain', label: __('Contain', 'getwid')},
								]}
							/>
						</Fragment>
						}
					</PanelBody>
				</Fragment>
			);
		};

		const hascontentAnimation = () => {
			return contentAnimation !== undefined ||
				contentAnimationDelay !== undefined ||
				contentAnimationDuration !== undefined;
		};
		const resetcontentAnimation = () => {
			setAttributes({
				contentAnimation: undefined,
				contentAnimationDelay: undefined,
				contentAnimationDuration: undefined
			})
		};

		const renderAnimationSettings = () => {		
			return (
				<Fragment>
					{
						hascontentAnimation() &&
						<Fragment>
							<Button isLink isDestructive onClick={resetcontentAnimation}>
								{__('Reset', 'getwid')}
							</Button>
						</Fragment>
					}
					<GetwidAnimationSelectControl
						label={__('Animation Effect', 'getwid')}
						allowAnimation={['Entrance','Seeker']}
						value={contentAnimation !== undefined ? contentAnimation : ''}
						onChange={contentAnimation => setAttributes({contentAnimation})}
					/>
					<SelectControl
						label={__('Duration', 'getwid')}
						value={contentAnimationDuration !== undefined ? contentAnimationDuration : ''}
						onChange={contentAnimationDuration => setAttributes({contentAnimationDuration})}
						options={[
							{value: '2000ms', label: __('Slow', 'getwid')},
							{value: '1500ms', label: __('Normal', 'getwid')},
							{value: '800ms', label: __('Fast', 'getwid')},
						]}
					/>
					<TextControl
						label={__('Delay (ms)', 'getwid')}
						value={contentAnimationDelay !== undefined ? contentAnimationDelay.replace('ms', '') : ''}
						type={'number'}
						min={0}
						placeholder={2000}
						onChange={contentAnimationDelay => {
							contentAnimationDelay = parseInt(contentAnimationDelay);
							if (isNaN(contentAnimationDelay)) {
								contentAnimationDelay = undefined;
							} else {
								contentAnimationDelay = `${contentAnimationDelay}ms`;
							}
							setAttributes({contentAnimationDelay})
						}}
					/>
				</Fragment>
			);
		};

		//*********/RENDER PARTS*********
		const addNewSlide = ( nextSlide ) => {
			const newSlides = sliderArrays;

			console.info(newSlides.length);
			console.info(nextSlide);

			console.error(newSlides.length < nextSlide);

			if ( newSlides.length < nextSlide ) {
				const amount = Math.abs( nextSlide - newSlides.length );
				{ times( amount, n => {
					const tabnumber = nextSlide - n;
					newSlides.push( {
						text: sprintf( __( 'Slide %d' ), tabnumber ),
					} );
				} ); }
				console.log('HERE');
				console.warn(newSlides);
				setAttributes( { sliderArrays: newSlides } );
			} else {
				console.log(newSlides.slice(0, nextSlide));
				setAttributes( { sliderArrays: newSlides.slice(0, nextSlide) } );
			}

			setAttributes({
				slideCount: nextSlide,
			});
		};

		const hasPadding = () => {
			return paddingTop !== undefined ||
				paddingBottom !== undefined ||
				paddingRight !== undefined ||
				paddingLeft !== undefined;
		}

		const resetPadding = () => {
			setAttributes({
				paddingTop: undefined,
				paddingBottom: undefined,
				paddingLeft: undefined,
				paddingRight: undefined
			})
		};

		return (
			<InspectorControls key="inspector">
				<RangeControl
					label={ __( 'Slides count', 'getwid' ) }
					value={ slideCount }
					onChange={ ( nextSlide ) => {
						addNewSlide(nextSlide);
					}}
					min={ 1 }
					max={ 12 }
				/>
				<RangeControl
					label={__('Content Max Width (px)', 'getwid')}
					value={contentMaxWidth !== undefined ? contentMaxWidth : ''}
					onChange={contentMaxWidth => {
						setAttributes({contentMaxWidth});
					}}
					allowReset
					min={0}
					max={2000}
					step={1}
				/>
				<GetwidStyleLengthControl
					label={__('Min Height', 'getwid')}
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
					label={__('Vertical Alignment', 'getwid')}
					value={verticalAlign !== undefined ? verticalAlign : 'center'}
					onChange={verticalAlign => setAttributes({verticalAlign})}
					options={[
						{value: 'top', label: __('Top', 'getwid')},
						{value: 'center', label: __('Middle', 'getwid')},
						{value: 'bottom', label: __('Bottom', 'getwid')},
					]}
				/>
				<SelectControl
					label={__('Horizontal Alignment', 'getwid')}
					value={horizontalAlign !== undefined ? horizontalAlign : 'center'}
					onChange={horizontalAlign => setAttributes({horizontalAlign})}
					options={[
						{value: 'left', label: __('Left', 'getwid')},
						{value: 'center', label: __('Center', 'getwid')},
						{value: 'right', label: __('Right', 'getwid')},
					]}
				/>
				<PanelColorSettings
					title={__('Text colors', 'getwid')}
					colorSettings={[
						{
							value: titleColor,
							onChange: titleColor => setAttributes({titleColor}),
							label: __('Title Color', 'getwid')
						},
						{
							value: contentColor,
							onChange: contentColor => setAttributes({contentColor}),
							label: __('Content Color', 'getwid')
						}
					]}
				/>
				<PanelBody title={__('Padding', 'getwid')} initialOpen={false}>
					{
						hasPadding() &&
						<Button isLink isDestructive onClick={resetPadding} >
							{__('Reset', 'getwid')}
						</Button>
					}
					<GetwidStyleLengthControl
						label={__('Top', 'getwid')}
						value={paddingTop}
						onChange={paddingTop => {
							setAttributes({paddingTop});
						}}
					/>
					<GetwidStyleLengthControl
						label={__('Bottom', 'getwid')}
						value={paddingBottom}
						onChange={paddingBottom => {
							setAttributes({paddingBottom});
						}}
					/>
					<GetwidStyleLengthControl
						label={__('Left', 'getwid')}
						value={paddingLeft}
						onChange={paddingLeft => {
							setAttributes({paddingLeft});
						}}
					/>
					<GetwidStyleLengthControl
						label={__('Right', 'getwid')}
						value={paddingRight}
						onChange={paddingRight => {
							setAttributes({paddingRight});
						}}
					/>
				</PanelBody>
				<PanelBody title={__('Slider setting', 'getwid')} initialOpen={false}>
					{ renderSliderSettings() }
				</PanelBody>
				<PanelBody title={__('Background', 'getwid')} initialOpen={false}>
					{ renderBackgoundSettings() }
				</PanelBody>
				<PanelBody title={__('Foreground', 'getwid')} initialOpen={false}>
					{ renderForegroundSettings() }
				</PanelBody>
				<PanelBody title={__('Animation', 'getwid')} initialOpen={false}>
					{ renderAnimationSettings() }
				</PanelBody>			
			</InspectorControls>
		);
	}

}

export default ( Inspector );