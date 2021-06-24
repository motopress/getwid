/**
* External dependencies
*/
import attributes from './attributes';
import GetwidStyleLengthControl from 'GetwidControls/style-length-control';
import GetwidCustomQueryControl from 'GetwidControls/custom-query-control'; //Custom Post Type
import GetwidCustomPostTemplateControl from 'GetwidControls/custom-post-template-control'; //Custom Post Template

/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
const {
	Component,
	Fragment
} = wp.element;
const {
	InspectorControls,
	PanelColorSettings
} = wp.blockEditor || wp.editor;
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
				offset,
				ignoreSticky,
				filterById,
				excludeById,
				excludeCurrentPost,
				childPagesCurrentPage,
				parentPageId,
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

				//Meta Query
				customField,
				metaItemCount,
				metaRelation,
				metaArray,
				//Meta Query

				//Slider
				sliderAnimationEffect,
				sliderAutoplay,
				sliderAutoplaySpeed,
				sliderInfinite,
				sliderAnimationSpeed,
				sliderArrows,
				sliderDots,

				//Modal
				metaQuery
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
				<PanelBody title={ __('Content Settings', 'getwid') } initialOpen={true}>
					{/* Custom Post Type */}
					<GetwidCustomQueryControl
						setValues={ setAttributes }
						options={['sticky', 'parentFilter']}
						values={{
							postsToShow,
							offset,
							ignoreSticky,
							postType,
							filterById,
							excludeById,
							excludeCurrentPost,
							childPagesCurrentPage,
							parentPageId,
							taxonomy,
							terms,
							relation,
							order,
							orderBy,
							customField,
							metaItemCount,
							metaRelation,
							metaArray,
							metaQuery
						}}
						onChangeCallback={ (value, element) => {} }
					/>
					{/* Custom Post Type */}
				</PanelBody>
				<PanelBody title={ __('Display Settings', 'getwid') } initialOpen={false}>

					<GetwidStyleLengthControl
						label={__('Slider Minimum Height', 'getwid')}
						value={minHeight}
						units={[
							{label: 'px', value: 'px'},
							{label: 'vh', value: 'vh'},
							{label: 'vw', value: 'vw'},
							{label: '%', value: '%'}
						]}
						onChange={minHeight => setAttributes({minHeight})}
					/>

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

					<PanelBody title={ __( 'Controls Settings', 'getwid' ) } initialOpen={false}>
						<RadioControl
							label={__('Arrows', 'getwid')}
							selected={ sliderArrows }
							options={ [
								{value: 'outside', label: __('Outside', 'getwid')},
								{value: 'inside', label: __('Inside', 'getwid')},
								{value: 'none', label: __('None', 'getwid')},
							] }
							onChange={sliderArrows => setAttributes({sliderArrows}) }
						/>
						<RadioControl
							label={__('Dots', 'getwid')}
							selected={ sliderDots }
							options={ [
								{value: 'outside', label: __('Outside', 'getwid')},
								{value: 'inside', label: __('Inside', 'getwid')},
								{value: 'none', label: __('None', 'getwid')},
							] }
							onChange={sliderDots => setAttributes({sliderDots}) }
						/>
					</PanelBody>
				</PanelBody>
			</InspectorControls>
		);
	}
}
