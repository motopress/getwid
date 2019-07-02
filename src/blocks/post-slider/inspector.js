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
* Module Constants
*/
const MAX_POSTS_COLUMNS = 6;


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
				contentMaxWidth,
				verticalAlign,
				horizontalAlign,
				overlayOpacity,
				
				//Posts
				imageSize,
				titleTag,
				showTitle,
				align,
				showContent,
				contentLength,

				//Slider
				sliderAnimationEffect,
				sliderAutoplay,
				sliderAutoplaySpeed,
				sliderInfinite,
				sliderAnimationSpeed,
				sliderArrows,
				sliderDots,
			},
			backgroundColor,
			setBackgroundColor,
			
			textColor,
			setTextColor,

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
				{(!postTemplate || postTemplate == '') && (
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
						<PanelColorSettings
							title={__('Colors', 'getwid')}
							colorSettings={[
								{
									value: textColor.color,
									onChange: setTextColor,
									label: __('Text Color', 'getwid')
								},
								{
									value: backgroundColor.color,
									onChange: setBackgroundColor,
									label: __('Overlay Color', 'getwid')
								},
							]}
						/>
						<RangeControl
							label={__('Overlay Opacity', 'getwid')}
							value={overlayOpacity !== undefined ? overlayOpacity : 0}
							onChange={overlayOpacity => setAttributes({overlayOpacity})}
							min={0}
							max={100}
							step={1}
						/>

						{renderPaddingsPanel(this)}

					</PanelBody>
				)}
				
				{(!postTemplate || postTemplate == '') && (
					<PanelBody title={ __('Post Settings', 'getwid') } initialOpen={false}>
						<ToggleControl
							label={ __( 'Display Title', 'getwid' ) }
							checked={ showTitle }
							onChange={ () => {
								setAttributes( { showTitle: !showTitle } );
							}}
						/>

						{showTitle && (
							<SelectControl
								label={__('Title Tag', 'getwid')}
								value={titleTag}
								options={[
									{value: 'p', label: __('Paragraph', 'getwid')},
									{value: 'h2', label: __('Heading 2', 'getwid')},
									{value: 'h3', label: __('Heading 3', 'getwid')},
									{value: 'h4', label: __('Heading 4', 'getwid')},
									{value: 'h5', label: __('Heading 5', 'getwid')},
									{value: 'h6', label: __('Heading 6', 'getwid')},
								]}
								onChange={titleTag => setAttributes({titleTag})}
							/>
						)}
		
						<SelectControl
							label={__('Image Size', 'getwid')}
							help={__('For images from Media Library only.', 'getwid')}
							value={imageSize}
							onChange={ (value) => {
								setAttributes( { imageSize: value } );
							}}
							options={Getwid.settings.image_sizes}
						/>	

						<SelectControl
							label={__('Display Content', 'getwid')}
							value={showContent}
							options={[
								{value: 'none', label: __('None', 'getwid')},
								{value: 'excerpt', label: __('Excerpt', 'getwid')},
								{value: 'content', label: __('Post Content', 'getwid')},
							]}
							onChange={showContent => setAttributes({showContent})}
						/>

						{ showContent == 'excerpt' &&
							<RangeControl
								label={ __( 'Number of words', 'getwid' ) }
								value={ contentLength }
								onChange={ ( contentLength ) => setAttributes( { contentLength } ) }
								min={ 5 }
								max={ Getwid.settings.excerpt_length }
							/>
						}
					</PanelBody>
				)}
				
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