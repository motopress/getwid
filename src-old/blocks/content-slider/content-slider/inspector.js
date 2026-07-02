/**
 * External dependencies
 */
import { __ } from 'wp.i18n';

/**
 * WordPress dependencies
 */
const { Component, Fragment } = wp.element;
const { InspectorControls } = wp.blockEditor || wp.editor;
const { PanelBody, SelectControl, ToggleControl, TextControl, RadioControl, TabPanel } = wp.components;

import Notice from 'GetwidControls/notice';

/**
* Create an Inspector Controls
*/
class Inspector extends Component {

	constructor() {
		super(...arguments);

		this.onAnimationEffectChange = this.onAnimationEffectChange.bind(this);
	}

	shouldDisableSlidesNumberControl() {
		return this.props.attributes.animationEffect === 'fade';
	}

	onAnimationEffectChange(animationEffect) {
		this.props.setAttributes( {
			animationEffect,
			slidesToShow: '1',
			slidesToScroll: '1',
			slidesToShowMobile: '1',
			slidesToScrollMobile: '1',
			slidesToShowTablet: '1',
			slidesToScrollTablet: '1',
			slidesToShowLaptop: '1',
			slidesToScrollLaptop: '1',
		} );
	}

	render() {
		const {
			attributes: {
				autoplay,
				infinite,
				animationEffect,
				animationSpeed,
				autoplaySpeed,
				centerMode,
				adaptiveHeight,
				draggable,
				pauseOnHover,
				arrows,
				dots,
				slidesToShow,
				slidesToScroll,
				slidesToShowMobile,
				slidesToScrollMobile,
				slidesToShowTablet,
				slidesToScrollTablet,
				slidesToShowLaptop,
				slidesToScrollLaptop,
			},
			setAttributes
		} = this.props;

 		return (
			<InspectorControls>
				<PanelBody initialOpen={true}>
					<Notice>{ __( 'These options are applied on frontend only.', 'getwid' ) }</Notice>
					<ToggleControl
						label={ __( 'Enable Slideshow', 'getwid' ) }
						help={ __( 'Slideshow plays automatically.', 'getwid' ) }
						checked={ autoplay }
						onChange={ () => {
							setAttributes( { autoplay: !autoplay } );
						} }
					/>
					{ autoplay && <ToggleControl
						label={ __( 'Pause On Hover', 'getwid' ) }
						help={__( 'Pause the slideshow when the mouse cursor is over a slider.', 'getwid' )}
						checked={ pauseOnHover }
						onChange={ () => {
							setAttributes( { pauseOnHover: !pauseOnHover } );
						} }
					/> }
					<ToggleControl
						label={ __( 'Infinite', 'getwid' ) }
						help={ __( 'Slideshow plays on repeat.', 'getwid' ) }
						checked={ infinite }
						onChange={ () => {
							setAttributes( { infinite: !infinite } );
						} }
					/>
					<ToggleControl
						label={ __( 'Center Mode', 'getwid' ) }
						help={ __( 'Displays slides centered, with partial previews of the previous and next slides. Use with odd numbered "Slides to show" slides.', 'getwid' ) }
						checked={ centerMode }
						onChange={ () => {
							setAttributes( { centerMode: !centerMode } );
						} }
					/>
					<ToggleControl
						label={ __( 'Adaptive Height', 'getwid' ) }
						help={ __( 'Automatically adjusts height for single-slide horizontal carousels.', 'getwid' ) }
						checked={ adaptiveHeight }
						onChange={ () => {
							setAttributes( { adaptiveHeight: !adaptiveHeight } );
						} }
					/>
					<ToggleControl
						label={ __( 'Draggable', 'getwid' ) }
						help={ __( 'Enable mouse dragging.', 'getwid' ) }
						checked={ draggable }
						onChange={ () => {
							setAttributes( { draggable: !draggable } );
						} }
					/>
					<SelectControl
						label={ __( 'Animation Effect', 'getwid' ) }
						value={ animationEffect }
						onChange={ this.onAnimationEffectChange }
						options={ [
							{ value: 'slide'   , label: __( 'Slide'   , 'getwid' ) },
							{ value: 'fade', label: __( 'Fade', 'getwid' ) },
						] }
					/>
					<TextControl
						label={ __( 'Animation Speed', 'getwid' ) }
						type={ 'number' }
						value={ animationSpeed }
						min={ 0 }
						onChange={ animationSpeed => setAttributes( { animationSpeed } ) }
					/>

					<TextControl
						label={ __( 'Slideshow Speed', 'getwid' ) }
						type={ 'number' }
						value={ autoplaySpeed }
						min={ 0 }
						onChange={ autoplaySpeed => setAttributes( { autoplaySpeed } ) }
					/>
					<TabPanel
						className="getwid-editor-tabs"
						activeClass="is-active"
						tabs={ [

							{
								title: __( 'Desktop', 'getwid' ),
								name: 'desktop',
								slidesToShow: slidesToShow,
								slidesToScroll: slidesToScroll,
								suffix: '',
								className: 'components-button is-link is-small',
								notice: __( 'Applies to screens wider than 991 pixels.', 'getwid' )
							},
							{
								title: __( 'Laptop', 'getwid' ),
								name: 'laptop',
								slidesToShow: slidesToShowLaptop,
								slidesToScroll: slidesToScrollLaptop,
								suffix: 'Laptop',
								className: 'components-button is-link is-small',
								notice: __( 'Applies to screens between 768 and 991 pixels wide.', 'getwid' )
							},
							{
								title: __( 'Tablet', 'getwid' ),
								name: 'tablet',
								slidesToShow: slidesToShowTablet,
								slidesToScroll: slidesToScrollTablet,
								suffix: 'Tablet',
								className: 'components-button is-link is-small',
								notice: __( 'Applies to screens between 468 and 768 pixels wide.', 'getwid' )
							},
							{
								title: __( 'Mobile', 'getwid' ),
								name: 'mobile',
								slidesToShow: slidesToShowMobile,
								slidesToScroll: slidesToScrollMobile,
								suffix: 'Mobile',
								className: 'components-button is-link is-small',
								notice: __( 'Applies to screens up to 468 pixels wide.', 'getwid' )
							}
						] }
					>
						{ ( tab ) =>
							{
								return (
									<Fragment>
										<TextControl
											label={ __( 'Slides to Show', 'getwid' ) }
											value={ tab.slidesToShow }
											onChange={ ( value ) => {
												setAttributes( { [`slidesToShow${tab.suffix}`] : value} );
											} }
											type={ 'number' }
											min={ 1 }
											max={ 10 }
											step={ 1 }
											disabled={ this.shouldDisableSlidesNumberControl() }
											help={ __( 'Specifies the number of slides displayed at once.', 'getwid' ) }
										/>
										<TextControl
											label={ __( 'Slides to Scroll', 'getwid' ) }
											value={ tab.slidesToScroll }
											onChange={ ( value ) => {
												setAttributes( { [`slidesToScroll${tab.suffix}`] : value} );
											} }
											type={ 'number' }
											min={ 1 }
											max={ 10 }
											step={ 1 }
											disabled={ this.shouldDisableSlidesNumberControl() }
											help={ __( 'Specifies the number of slides that will scroll at once.', 'getwid' ) }
										/>
										<Notice>{ tab.notice }</Notice>
									</Fragment>
								)
							}
						}
					</TabPanel>
				</PanelBody>
				<PanelBody title={ __( 'Controls Settings', 'getwid' ) } initialOpen={ false }>
					<Notice>{ __( 'These options are applied on frontend only.', 'getwid' ) }</Notice>
					<RadioControl
						label={ __('Arrows', 'getwid') }
						selected={ arrows }
						options={ [
							{ value: 'outside', label: __( 'Outside', 'getwid') },
							{ value: 'inside', label: __( 'Inside', 'getwid') },
							{ value: 'none', label: __( 'None', 'getwid') }
						] }
						onChange={ arrows => setAttributes( { arrows } ) }
					/>
					<RadioControl
						label={ __('Dots', 'getwid') }
						selected={ dots }
						options={ [
							{ value: 'outside', label: __( 'Outside', 'getwid' ) },
							{ value: 'inside', label: __( 'Inside', 'getwid' ) },
							{ value: 'none', label: __( 'None', 'getwid' ) }
						] }
						onChange={ dots => setAttributes( { dots } ) }
					/>
				</PanelBody>
			</InspectorControls>
		);
	}
}

export default Inspector;
