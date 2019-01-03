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
				align,
				contentMaxWidth,
				minHeight,
				verticalAlign,
				horizontalAlign,
				paddingTop,
				paddingBottom,
				paddingLeft,
				paddingRight,
				textColor,
				overlayColor,
				overlayOpacity,
				contentAnimation,
				contentAnimationDuration,
				contentAnimationDelay,
				sliderAnimationEffect,
				sliderAutoplay,
				sliderAutoplaySpeed,
				sliderAnimationSpeed,
				currentSlide,
				selectedSlide,
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

		const renderOverlaySettings = () => {		
			return (
				<Fragment>
					<PanelColorSettings
						title={__('Overlay Color', 'getwid')}
						colorSettings={[
							{
								value: overlayColor,
								onChange: overlayColor => setAttributes({overlayColor}),
								label: __('Overlay Color', 'getwid')
							}
						]}
						initialOpen={false}
					/>
					<RangeControl
						label={__('Overlay Opacity', 'getwid')}
						value={overlayOpacity !== undefined ? overlayOpacity : 0}
						onChange={overlayOpacity => setAttributes({overlayOpacity})}
						min={0}
						max={100}
						step={1}
					/>
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
						placeholder={500}
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

			if ( newSlides.length < nextSlide ) {
				const amount = Math.abs( nextSlide - newSlides.length );
				{ times( amount, n => {
					const slideNumber = nextSlide - n;
					newSlides.push( {
						text: sprintf( __( 'Slide %d' ), slideNumber ),
					} );
				} ); }
				setAttributes( {
					sliderArrays: newSlides,
					slideCount: nextSlide
				} );
			} else {
				setAttributes( {
					sliderArrays: newSlides.slice(0, nextSlide),
					slideCount: nextSlide
				} );
			}
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
							value: textColor,
							onChange: textColor => setAttributes({textColor}),
							label: __('Text Color', 'getwid')
						}
					]}
				/>
				{ renderOverlaySettings() }
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
				<PanelBody title={__('Text Animation', 'getwid')} initialOpen={false}>
					{ renderAnimationSettings() }
				</PanelBody>			
			</InspectorControls>
		);
	}

}

export default ( Inspector );