/**
* External dependencies
*/
import attributes from './attributes';
import GetwidStyleLengthControl from 'GetwidControls/style-length-control';
import GetwidCustomQueryControl from 'GetwidControls/custom-query-control'; //Custom Post Type
import GetwidCustomPostTemplateControl from 'GetwidControls/custom-post-template-control'; //Custom Post Template
import {renderPaddingsPanel} from 'GetwidUtils/render-inspector';

/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {
	Component,
	Fragment
} = wp.element;
const {
	InspectorControls,
	PanelColorSettings
} = wp.editor;
const {
	SelectControl,
	PanelBody,
	RangeControl,
	ToggleControl,
	TextControl,
	RadioControl,
	BaseControl,
	Button
} = wp.components;


/**
* Create an Inspector Controls
*/
export default class Inspector extends Component {

	constructor() {
		super(...arguments);
	}

	hasSliderSettings(){
		const {
			attributes: {
				sliderAnimationEffect,
				sliderAutoplay,
				sliderAutoplaySpeed,
				sliderInfinite,
				sliderAnimationSpeed,
			}
		} = this.props;

		return sliderAnimationEffect != attributes.sliderAnimationEffect.default ||
			sliderAutoplay != attributes.sliderAutoplay.default ||
			sliderAutoplaySpeed != attributes.sliderAutoplaySpeed.default ||
			sliderInfinite != attributes.sliderInfinite.default ||
			sliderAnimationSpeed != attributes.sliderAnimationSpeed.default;
	}

	render() {
		const {
			attributes: {
				postTemplate,
				//Custom Post Type
				postsToShow,
				ignoreSticky,
				filterById,
				postType,
				taxonomy,
				terms,
				relation,
				order,
				orderBy,				
				//Custom Post Type

				//Content
				minHeight,
				
				//Posts
				align,

				//Slider
				sliderAnimationEffect,
				sliderAutoplay,
				sliderAutoplaySpeed,
				sliderInfinite,
				sliderAnimationSpeed,
				sliderArrows,
				sliderDots,
			},
			setAttributes,

			changeState,
			getState,
		} = this.props;

		const resetSliderSettings = () => {
			setAttributes({
				sliderAnimationEffect: attributes.sliderAnimationEffect.default,
				sliderAutoplay: attributes.sliderAutoplay.default,
				sliderAutoplaySpeed: attributes.sliderAutoplaySpeed.default,
				sliderInfinite: attributes.sliderInfinite.default,
				sliderAnimationSpeed: attributes.sliderAnimationSpeed.default,
			})
		};

		return (
			<InspectorControls>
				<PanelBody title={ __('Settings', 'getwid') }>
					<PanelBody title={ __('Template', 'getwid') }>
						<GetwidCustomPostTemplateControl
							setValues={ setAttributes }
							values={{
								postTemplate,
							}}
							// callbackOn={['postTemplate']}
							onChangeCallback={ (value, element) => {
								// debugger;
							} }
						/>
					</PanelBody>
					
					{/* Custom Post Type */}
					<GetwidCustomQueryControl
						setValues={ setAttributes }
						options={['sticky']}
						values={{
							postsToShow,
							ignoreSticky,
							postType,
							filterById,
							taxonomy,
							terms,
							relation,
							order,
							orderBy,
						}}
						onChangeCallback={ (value, element) => {} }
					/>
					{/* Custom Post Type */}
				</PanelBody>
				
				<PanelBody title={ __('View Settings', 'getwid') } initialOpen={false}>
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
				</PanelBody>						
				
				<PanelBody title={ __( 'Slider Settings', 'getwid' ) } initialOpen={false}>			
					<RadioControl
						label={__('Animation Effect', 'getwid')}
						selected={ sliderAnimationEffect }
						options={ [
							{value: 'slide', label: __('Slide', 'getwid')},
							{value: 'fade', label: __('Fade', 'getwid')},
						] }
						onChange={sliderAnimationEffect => setAttributes({sliderAnimationEffect}) }
					/>

					<ToggleControl
						label={ __( 'Enable Slideshow', 'getwid' ) }
						checked={ sliderAutoplay }
						onChange={ () => {
							setAttributes( { sliderAutoplay: !sliderAutoplay } );
						}}
					/>
					{!!sliderAutoplay &&
						(
							<TextControl
								label={__('Slideshow Speed', 'getwid')}
								type={'number'}
								value={sliderAutoplaySpeed}
								min={0}
								onChange={sliderAutoplaySpeed => setAttributes({sliderAutoplaySpeed})}
							/>						
						)
					}
					<ToggleControl
						label={ __( 'Infinite', 'getwid' ) }
						checked={ sliderInfinite }
						onChange={ () => {
							setAttributes( { sliderInfinite: !sliderInfinite } );
						}}
					/>
					<TextControl
						label={__('Animation Speed', 'getwid')}
						type={'number'}
						value={sliderAnimationSpeed}
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

				</PanelBody>

				<PanelBody title={ __( 'Controls Settings', 'getwid' ) } initialOpen={false}>
					<RadioControl
						label={__('Arrows', 'getwid')}
						selected={ sliderArrows }
						options={ [
							{value: 'ouside', label: __('Ouside', 'getwid')},
							{value: 'inside', label: __('Inside', 'getwid')},
							{value: 'none', label: __('None', 'getwid')},
						] }
						onChange={sliderArrows => setAttributes({sliderArrows}) }
					/>
					<RadioControl
						label={__('Dots', 'getwid')}
						selected={ sliderDots }
						options={ [
							{value: 'ouside', label: __('Ouside', 'getwid')},
							{value: 'inside', label: __('Inside', 'getwid')},
							{value: 'none', label: __('None', 'getwid')},
						] }
						onChange={sliderDots => setAttributes({sliderDots}) }
					/>
				</PanelBody>
			</InspectorControls>
		);
	}
}