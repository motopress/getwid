/**
* External dependencies
*/
import attributes from './attributes';
import GetwidStyleLengthControl from 'GetwidControls/style-length-control';
import GetwidAnimationSelectControl from 'GetwidControls/animation-select-control';
import {
	times
} from "lodash";


/**
* WordPress dependencies
*/
import { __ } from '@wordpress/i18n';
const {
	Component,
	Fragment,
} = wp.element;
const {
	InspectorControls,
	PanelColorSettings
} = wp.editor;
const {
	Button,
	BaseControl,
	PanelBody,
	RangeControl,
	ToggleControl,
	SelectControl,
	RadioControl,
	TextControl,
} = wp.components;


/**
* Create an Inspector Controls
*/
class Inspector extends Component {

	constructor( props ) {
		super( ...arguments );	
	}

	hasSliderSettings(){
		const {
			attributes: {
				sliderAnimationEffect,
				sliderAutoplay,
				pauseOnHover,
				sliderAutoplaySpeed,
				sliderAnimationSpeed,
			}
		} = this.props;

		return sliderAnimationEffect != undefined ||
			sliderAutoplay != attributes.sliderAutoplay.default ||
			pauseOnHover != attributes.pauseOnHover.default ||
			sliderAutoplaySpeed != attributes.sliderAutoplaySpeed.default ||
			sliderAnimationSpeed != attributes.sliderAnimationSpeed.default;
	}

	render() {

		const {
			attributes: {
				uniqueID,
				imageSize,
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
				pauseOnHover,
				sliderAutoplaySpeed,
				sliderAnimationSpeed,
				sliderArrays,
			},
			changeState,
			getState,
			setAttributes,
			updateArrValues
		} = this.props;

		const resetSliderSettings = () => {
			setAttributes({
				sliderAnimationEffect: undefined,
				sliderAutoplay: attributes.sliderAutoplay.default,
				pauseOnHover: attributes.pauseOnHover.default,
				sliderAutoplaySpeed: attributes.sliderAutoplaySpeed.default,
				sliderAnimationSpeed: attributes.sliderAnimationSpeed.default
			})
		};

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
					    label={__('Enable Slideshow', 'getwid')}
					    checked={ sliderAutoplay }
					    onChange={ () => setAttributes({sliderAutoplay: !sliderAutoplay}) }
					/>
					{sliderAutoplay &&
						(
							<Fragment>
								<ToggleControl
								    label={__('Pause On Hover', 'getwid')}
								    checked={ pauseOnHover }
								    onChange={ () => setAttributes({pauseOnHover: !pauseOnHover}) }
								/>					
								<TextControl
									label={__('Slideshow Speed', 'getwid')}
									type={'number'}
									value={sliderAutoplaySpeed !== undefined ? sliderAutoplaySpeed : ''}
									min={0}
									onChange={sliderAutoplaySpeed => setAttributes({sliderAutoplaySpeed})}
								/>
							</Fragment>
						)
					}
					
					<TextControl
						label={__('Animation Speed', 'getwid')}
						type={'number'}
						value={sliderAnimationSpeed !== undefined ? sliderAnimationSpeed : ''}
						min={0}
						onChange={sliderAnimationSpeed => setAttributes({sliderAnimationSpeed})}
					/>

					<BaseControl>
						<Button isLink
							onClick={resetSliderSettings}
							disabled={ !this.hasSliderSettings() }>
							{__('Reset', 'getwid')}
						</Button>
					</BaseControl>					
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
						initialOpen={true}
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
			return contentAnimation !== 'fadeIn' ||
				contentAnimationDelay !== '0ms' ||
				contentAnimationDuration !== '1500ms';
		};
		const resetcontentAnimation = () => {
			setAttributes({
				contentAnimation: 'fadeIn',
				contentAnimationDelay: '0ms',
				contentAnimationDuration: '1500ms'
			})
		};

		const renderAnimationSettings = () => {		
			return (
				<Fragment>
					<GetwidAnimationSelectControl
						label={__('Animation Effect', 'getwid')}
						allowAnimation={['Entrance','Seeker']}
						value={contentAnimation !== 'fadeIn' ? contentAnimation : 'fadeIn'}
						onChange={contentAnimation => setAttributes({contentAnimation})}
					/>
					<SelectControl
						label={__('Duration', 'getwid')}
						value={contentAnimationDuration !== undefined ? contentAnimationDuration : ''}
						onChange={contentAnimationDuration => setAttributes({contentAnimationDuration})}
						options={[
							{value: '3000ms', label: __('Very Slow', 'getwid')},
							{value: '2000ms', label: __('Slow', 'getwid')},
							{value: '1500ms', label: __('Normal', 'getwid')},
							{value: '800ms', label: __('Fast', 'getwid')},
							{value: '400ms', label: __('Very Fast', 'getwid')},
						]}
					/>
					<TextControl
						label={__('Delay, ms', 'getwid')}
						value={contentAnimationDelay !== undefined ? contentAnimationDelay.replace('ms', '') : ''}
						type={'number'}
						min={0}
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
					<BaseControl>
						<Button isLink
							onClick={resetcontentAnimation}
							disabled={ !hascontentAnimation() }>
							{__('Reset', 'getwid')}
						</Button>
					</BaseControl>
				</Fragment>
			);
		};

		//*********/RENDER PARTS*********
		const addNewSlide = ( nextSlide ) => {
		
			const sliderArraysParsed = JSON.parse(sliderArrays);

			const newSlides = sliderArraysParsed;

			if ( newSlides.length < nextSlide ) {
				const amount = Math.abs( nextSlide - newSlides.length );
				{ times( amount, n => {
					const slideNumber = nextSlide - n;
					newSlides.push( {
						text: sprintf( __( 'Slide %d', 'getwid' ), slideNumber ),
					} );
				} ); }
				setAttributes( {
					sliderArrays: JSON.stringify(newSlides),
					slideCount: nextSlide
				} );
			} else {
				setAttributes( {
					sliderArrays: JSON.stringify(newSlides.slice(0, nextSlide)),
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
				<PanelBody title={ __( 'Settings', 'getwid' ) } initialOpen={true}>
					<RangeControl
						label={ __( 'Number of slides', 'getwid' ) }
						value={ slideCount }
						onChange={ ( nextSlide ) => {
							addNewSlide(nextSlide);
						}}
						min={ 1 }
						max={ 12 }
					/>
					<SelectControl
						label={__('Image Size', 'getwid')}
						help={__('For images from Media Library only.', 'getwid')}
						value={imageSize}
						onChange={imageSize => {
							setAttributes({imageSize});
						}}
						options={Getwid.settings.image_sizes}
					/>
					<GetwidStyleLengthControl
						label={__('Slider Height', 'getwid')}
						value={minHeight}
						units={[
							{label: 'px', value: 'px'},
							{label: 'vh', value: 'vh'},
							{label: 'vw', value: 'vw'},
							{label: '%', value: '%'}
						]}
						onChange={minHeight => setAttributes({minHeight})}
					/>
					<RangeControl
						label={__('Content Width', 'getwid')}
						value={contentMaxWidth !== undefined ? contentMaxWidth : ''}
						onChange={contentMaxWidth => {
							setAttributes({contentMaxWidth});
						}}
						allowReset
						min={0}
						max={2000}
						step={1}
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
				</PanelBody>
				
				<PanelColorSettings
					title={__('Text Color', 'getwid')}
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
					<GetwidStyleLengthControl
						label={__('Padding Top', 'getwid')}
						value={paddingTop}
						onChange={paddingTop => {
							setAttributes({paddingTop});
						}}
					/>
					<GetwidStyleLengthControl
						label={__('Padding Bottom', 'getwid')}
						value={paddingBottom}
						onChange={paddingBottom => {
							setAttributes({paddingBottom});
						}}
					/>
					<GetwidStyleLengthControl
						label={__('Padding Left', 'getwid')}
						value={paddingLeft}
						onChange={paddingLeft => {
							setAttributes({paddingLeft});
						}}
					/>
					<GetwidStyleLengthControl
						label={__('Padding Right', 'getwid')}
						value={paddingRight}
						onChange={paddingRight => {
							setAttributes({paddingRight});
						}}
					/>
					<BaseControl>
						<Button isLink
							onClick={resetPadding}
							disabled={ !hasPadding() }>
							{__('Reset', 'getwid')}
						</Button>
					</BaseControl>
				</PanelBody>
				<PanelBody title={__('Slider Settings', 'getwid')} initialOpen={false}>
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