/**
* External dependencies
*/
import { __ } from 'wp.i18n';

/**
* Internal dependencies
*/
import GetwidCustomTabsControl      from 'GetwidControls/custom-tabs-control';
import GetwidStyleLengthControl     from 'GetwidControls/style-length-control';
import GetwidAnimationSelectControl from 'GetwidControls/animation-select-control';
import GetwidCustomColorPalette 	from 'GetwidControls/custom-color-palette';

import { renderPaddingsPanel } from 'GetwidUtils/render-inspector';

import attributes from './attributes';

/**
* WordPress dependencies
*/
const { Component, Fragment } = wp.element;
const { InspectorControls } = wp.blockEditor || wp.editor;
const { Button, BaseControl, PanelBody, RangeControl, ToggleControl, SelectControl, RadioControl, TextControl } = wp.components;

/**
* Create an Inspector Controls
*/
class Inspector extends Component {

	constructor(props) {
		super(...arguments);

		this.state = {
			tabName: 'general'
		};
	}

	hasSliderSettings() {
		const { sliderAnimationEffect, sliderAutoplay, pauseOnHover, sliderAutoplaySpeed, sliderAnimationSpeed } = this.props.attributes;

		return sliderAnimationEffect != undefined ||
			sliderAutoplay       != attributes.sliderAutoplay.default      ||
			pauseOnHover         != attributes.pauseOnHover.default        ||
			sliderAutoplaySpeed  != attributes.sliderAutoplaySpeed.default ||
			sliderAnimationSpeed != attributes.sliderAnimationSpeed.default;
	}

	render() {
		const { addNewSlide, setAttributes, clientId } = this.props;

		const { imageSize, slideCount, contentMaxWidth, minHeight, verticalAlign, horizontalAlign, textColor, overlayColor, overlayOpacity, contentAnimation} = this.props.attributes;
		const { contentAnimationDuration, contentAnimationDelay, sliderAnimationEffect, sliderAutoplay, pauseOnHover, sliderAutoplaySpeed, sliderAnimationSpeed} = this.props.attributes;
		const { sliderArrows, sliderDots } = this.props.attributes;

		const { tabName } = this.state;

		const { select } = wp.data;
		const block = select( 'core/editor' ).getBlock( clientId );

		if ( ! block ) {
			return (
				<InspectorControls></InspectorControls>
			);
		}

		const resetSliderSettings = () => 
			setAttributes({
				sliderAnimationEffect: undefined,
				sliderAutoplay      : attributes.sliderAutoplay.default,
				pauseOnHover        : attributes.pauseOnHover.default,
				sliderAutoplaySpeed : attributes.sliderAutoplaySpeed.default,
				sliderAnimationSpeed: attributes.sliderAnimationSpeed.default
			});

		const renderSliderSettings = () => {
			return (
				<Fragment>
					<RadioControl
					    label={__( 'Animation Effect', 'getwid' )}
					    selected={sliderAnimationEffect !== undefined ? sliderAnimationEffect : ''}
					    options={[
							{ value: ''    , label: __( 'Slide', 'getwid' ) },
							{ value: 'fade', label: __( 'Fade' , 'getwid' ) }
					    ]}
					    onChange={sliderAnimationEffect => setAttributes({ sliderAnimationEffect })}
					/>

					<ToggleControl
					    label={__( 'Enable Slideshow', 'getwid' )}
					    checked={sliderAutoplay}
					    onChange={() => setAttributes({ sliderAutoplay: !sliderAutoplay })}
					/>
					{sliderAutoplay && (
							<Fragment>
								<ToggleControl
								    label={__( 'Pause On Hover', 'getwid' )}
								    checked={ pauseOnHover }
								    onChange={ () => setAttributes({ pauseOnHover: !pauseOnHover }) }
								/>
								<TextControl
									label={__( 'Slideshow Speed', 'getwid' )}
									type='number'
									value={sliderAutoplaySpeed !== undefined ? sliderAutoplaySpeed : ''}
									min={0}
									onChange={sliderAutoplaySpeed => setAttributes({ sliderAutoplaySpeed })}
								/>
							</Fragment>
						)
					}
					<TextControl
						label={__( 'Animation Speed', 'getwid' )}
						type='number'
						value={sliderAnimationSpeed !== undefined ? sliderAnimationSpeed : ''}
						min={0}
						onChange={sliderAnimationSpeed => setAttributes({ sliderAnimationSpeed })}
					/>
					<BaseControl>
						<Button isLink
							onClick={resetSliderSettings}
							disabled={!this.hasSliderSettings()}>
							{__( 'Reset', 'getwid' )}
						</Button>
					</BaseControl>
					<RadioControl
						label={__( 'Arrows', 'getwid' )}
						selected={sliderArrows}
						options={[
							{ value: 'outside', label: __( 'Outside', 'getwid' ) },
							{ value: 'inside' , label: __( 'Inside' , 'getwid' ) },
							{ value: 'none'   , label: __( 'None'   , 'getwid' ) }
						]}
						onChange={sliderArrows => setAttributes({ sliderArrows })}
					/>
					<RadioControl
						label={__( 'Dots', 'getwid' )}
						selected={sliderDots}
						options={[
							{ value: 'outside', label: __( 'Outside', 'getwid' ) },
							{ value: 'inside' , label: __( 'Inside' , 'getwid' ) },
							{ value: 'none'   , label: __( 'None'   , 'getwid' ) }
						]}
						onChange={sliderDots => setAttributes({ sliderDots })}
					/>
				</Fragment>
			);
		};

		const hascontentAnimation = () => {
			return contentAnimation      !== attributes.contentAnimation.default      ||
				contentAnimationDelay    !== attributes.contentAnimationDelay.default ||
				contentAnimationDuration !== attributes.contentAnimationDuration.default;
		};

		const resetcontentAnimation = () => {
			setAttributes({
				contentAnimation        : attributes.contentAnimation.default,
				contentAnimationDelay   : attributes.contentAnimationDelay.default,
				contentAnimationDuration: attributes.contentAnimationDuration.default
			})
		};

		const renderAnimationSettings = () => {
			return (
				<Fragment>
					<GetwidAnimationSelectControl
						label={__( 'Animation Effect', 'getwid' )}
						allowAnimation={[ 'Entrance', 'Seeker' ]}
						value={contentAnimation !== undefined ? contentAnimation : ''}
						onChange={contentAnimation => setAttributes({ contentAnimation })}
					/>
					<SelectControl
						label={__( 'Duration', 'getwid' )}
						value={contentAnimationDuration !== undefined ? contentAnimationDuration : ''}
						onChange={contentAnimationDuration => setAttributes({ contentAnimationDuration })}
						options={[
							{ value: '3000ms', label: __( 'Very Slow', 'getwid' ) },
							{ value: '2000ms', label: __( 'Slow'     , 'getwid' ) },
							{ value: '1500ms', label: __( 'Normal'   , 'getwid' ) },
							{ value: '800ms' , label: __( 'Fast'     , 'getwid' ) },
							{ value: '400ms' , label: __( 'Very Fast', 'getwid' ) }
						]}
					/>
					<TextControl
						label={__( 'Delay, ms', 'getwid' )}
						value={contentAnimationDelay !== undefined ? contentAnimationDelay.replace( 'ms', '' ) : ''}
						type='number'
						min={0}
						onChange={contentAnimationDelay => {
							contentAnimationDelay = parseInt( contentAnimationDelay );
							if ( isNaN( contentAnimationDelay ) ) {
								contentAnimationDelay = undefined;
							} else {
								contentAnimationDelay = `${contentAnimationDelay}ms`;
							}
							setAttributes({ contentAnimationDelay });
						}}
					/>
					<BaseControl>
						<Button isLink
							onClick={resetcontentAnimation}
							disabled={!hascontentAnimation()}>
							{__( 'Reset', 'getwid' )}
						</Button>
					</BaseControl>
				</Fragment>
			);
		};

		return (
			<InspectorControls key='inspector'>
				<GetwidCustomTabsControl
					state={tabName}
					stateName='tabName'
					onChangeTab={(param, value)=> {
						this.setState({ [ param ]: value });
					}}
					tabs={[ 'general', 'style', 'advanced'  ]}
				/>
				{ tabName === 'general' && (
					<Fragment>
						<PanelBody>
							<RangeControl
								label={ __( 'Number of slides', 'getwid' ) }
								value={slideCount}
								onChange={nextSlide => addNewSlide( nextSlide )}
								min={1}
								max={12}
							/>
							<SelectControl
								label={__( 'Image Size', 'getwid' )}
								help={__( 'For images from Media Library only.', 'getwid' )}
								value={imageSize}
								onChange={imageSize => {
									setAttributes({ imageSize });
								}}
								options={Getwid.settings.image_sizes}
							/>
							<BaseControl
								label={__( 'Slider Height', 'getwid' )}
							>
								<GetwidStyleLengthControl
									value={minHeight}
									units={[
										{ label: 'px', value: 'px' },
										{ label: 'vh', value: 'vh' },
										{ label: 'vw', value: 'vw' },
										{ label: '%' , value: '%'  }
									]}
									onChange={minHeight => setAttributes({ minHeight })}
								/>
							</BaseControl>
							<RangeControl
								label={__( 'Content Area Width', 'getwid' )}
								value={contentMaxWidth !== undefined ? contentMaxWidth : ''}
								onChange={contentMaxWidth => {
									setAttributes({ contentMaxWidth });
								}}
								allowReset
								min={0}
								max={2000}
								step={1}
							/>
							<SelectControl
								label={__( 'Content Area Vertical Alignment', 'getwid' )}
								value={verticalAlign !== undefined ? verticalAlign : 'center'}
								onChange={verticalAlign => setAttributes({ verticalAlign })}
								options={[
									{ value: 'top'   , label: __( 'Top'   , 'getwid' ) },
									{ value: 'center', label: __( 'Middle', 'getwid' ) },
									{ value: 'bottom', label: __( 'Bottom', 'getwid' ) }
								]}
							/>
							<SelectControl
								label={__( 'Content Area Horizontal Alignment', 'getwid' )}
								value={horizontalAlign !== undefined ? horizontalAlign : 'center'}
								onChange={horizontalAlign => setAttributes({ horizontalAlign })}
								options={[
									{ value: 'left'  , label: __( 'Left'  , 'getwid' ) },
									{ value: 'center', label: __( 'Center', 'getwid' ) },
									{ value: 'right' , label: __( 'Right' , 'getwid' ) }
								]}
							/>
						</PanelBody>
					</Fragment>
				)}
				{ tabName === 'style' && (
					<Fragment>
						<PanelBody>
							<RangeControl
								label={__( 'Overlay Opacity', 'getwid' )}
								value={overlayOpacity !== undefined ? overlayOpacity : 0}
								onChange={overlayOpacity => setAttributes({ overlayOpacity })}
								min={0}
								max={100}
								step={1}
							/>
							<GetwidCustomColorPalette
								colorSettings={[{
										title: __( 'Text Color', 'getwid' ),
										colors: { customColor: textColor },
										changeColor: textColor => setAttributes({ textColor })
									}, {
										title: __( 'Background Color', 'getwid' ),
										colors: { customColor: overlayColor },
										changeColor: overlayColor => setAttributes({ overlayColor })
									}
								]}
							/>
						</PanelBody>
						<PanelBody title={__( 'Padding', 'getwid' )} initialOpen={false}>
							{renderPaddingsPanel( this )}
						</PanelBody>
					</Fragment>
				)}
				{tabName === 'advanced' && (
					<Fragment>
						<PanelBody title={__( 'Text Animation', 'getwid' )} initialOpen={true}>
							{renderAnimationSettings()}
						</PanelBody>
						<PanelBody title={__( 'Slider Settings', 'getwid' )} initialOpen={false}>
							{renderSliderSettings()}
						</PanelBody>						
					</Fragment>
				)}
			</InspectorControls>
		);
	}
}

export default Inspector;
