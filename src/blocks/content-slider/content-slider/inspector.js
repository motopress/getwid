/**
* External dependencies
*/
import GetwidIconPicker from 'GetwidControls/icon-picker';

import GetwidAnimationSelectControl from 'GetwidControls/animation-select-control';
import GetwidCustomTabsControl      from 'GetwidControls/custom-tabs-control';
import GetwidCustomColorPalette     from 'GetwidControls/custom-color-palette';

import { renderMediaControl as GetwidMediaControl } from 'GetwidUtils/render-inspector';
import { renderPointSettingsPanel } from 'GetwidUtils/render-inspector';

import { escape, unescape} from 'lodash';

/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';

const { Component, Fragment } = wp.element;
const { InspectorControls } = wp.blockEditor || wp.editor;
const { PanelBody, Panel, BaseControl, RangeControl, SelectControl, TextareaControl, ToggleControl, TextControl, Button, Modal, ButtonGroup, RadioControl, Dashicon, TabPanel } = wp.components;
const { withSelect } = wp.data;
const { compose } = wp.compose;

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
					<ToggleControl
						label={ __( 'Infinite', 'getwid' ) }
						checked={ infinite }
						onChange={ () => {
							setAttributes( { infinite: !infinite } );
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
					<ToggleControl
						label={ __( 'Center Mode', 'getwid' ) }
						checked={ centerMode }
						onChange={ () => {
							setAttributes( { centerMode: ! centerMode } );
						} }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Slides Settings', 'getwid' ) } initialOpen={ false }>
					<TabPanel
						className='getwid-editor-tabs'
						activeClass='is-active'
						tabs={ [

							{
								title: 'Desktop',
								name: 'desktop',
								slidesToShow: slidesToShow,
								slidesToScroll: slidesToScroll,
								suffix: '',
								className: 'components-button is-link is-small'
							},
							{
								title: 'Laptop',
								name: 'laptop',
								slidesToShow: slidesToShowLaptop,
								slidesToScroll: slidesToScrollLaptop,
								suffix: 'Laptop',
								className: 'components-button is-link is-small'
							},
							{
								title: 'Tablet',
								name: 'tablet',
								slidesToShow: slidesToShowTablet,
								slidesToScroll: slidesToScrollTablet,
								suffix: 'Tablet',
								className: 'components-button is-link is-small'
							},
							{
								title: 'Mobile',
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

export default compose( [
	withSelect( ( select, props ) => {
		const { getEditorSettings } = select( 'core/editor' );
		return {
			getEditorSettings
		};
	} )
] )( Inspector );
