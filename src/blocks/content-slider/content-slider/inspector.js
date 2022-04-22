/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';

const { Component, Fragment } = wp.element;
const { InspectorControls } = wp.blockEditor || wp.editor;
const { PanelBody, SelectControl, ToggleControl, TextControl, RadioControl, TabPanel } = wp.components;

/**
* Create an Inspector Controls
*/
class Inspector extends Component {

	constructor() {
		super(...arguments);
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
					<ToggleControl
						label={ __( 'Enable Slideshow', 'getwid' ) }
						checked={ autoplay }
						onChange={ () => {
							setAttributes( { autoplay: !autoplay } );
						} }
					/>
					{ autoplay && <ToggleControl
						label={ __( 'Pause On Hover', 'getwid' ) }
						checked={ pauseOnHover }
						onChange={ () => {
							setAttributes( { pauseOnHover: ! pauseOnHover } );
						} }
					/> }
					<ToggleControl
						label={ __( 'Infinite', 'getwid' ) }
						checked={ infinite }
						onChange={ () => {
							setAttributes( { infinite: !infinite } );
						} }
					/>
					<ToggleControl
						label={ __( 'Center Mode', 'getwid' ) }
						checked={ centerMode }
						onChange={ () => {
							setAttributes( { centerMode: ! centerMode } );
						} }
					/>
					<SelectControl
						label={ __( 'Animation Effect', 'getwid' ) }
						value={ animationEffect }
						onChange={ animationEffect => setAttributes( { animationEffect } )}
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
								className: 'components-button is-link is-small'
							},
							{
								title: __( 'Laptop', 'getwid' ),
								name: 'laptop',
								slidesToShow: slidesToShowLaptop,
								slidesToScroll: slidesToScrollLaptop,
								suffix: 'Laptop',
								className: 'components-button is-link is-small'
							},
							{
								title: __( 'Tablet', 'getwid' ),
								name: 'tablet',
								slidesToShow: slidesToShowTablet,
								slidesToScroll: slidesToScrollTablet,
								suffix: 'Tablet',
								className: 'components-button is-link is-small'
							},
							{
								title: __( 'Mobile', 'getwid' ),
								name: 'mobile',
								slidesToShow: slidesToShowMobile,
								slidesToScroll: slidesToScrollMobile,
								suffix: 'Mobile',
								className: 'components-button is-link is-small'
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
										/>
									</Fragment>
								)
							}
						}
					</TabPanel>
				</PanelBody>
				<PanelBody title={ __( 'Controls Settings', 'getwid' ) } initialOpen={ false }>
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
