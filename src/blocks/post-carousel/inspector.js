/**
* External dependencies
*/
import attributes from './attributes';
import GetwidCustomQueryControl from 'GetwidControls/custom-query-control'; //Custom Post Type
import GetwidCustomPostTemplateControl from 'GetwidControls/custom-post-template-control'; //Custom Post Template


/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {
	Component,
	Fragment,
} = wp.element;
const {
	InspectorControls,
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
				sliderSlidesToShowDesktop,
				sliderSlidesToShowLaptop,
				sliderSlidesToShowTablet,
				sliderSlidesToShowMobile,
				sliderSlidesToScroll,
				sliderAutoplay,
				sliderAutoplaySpeed,
				sliderInfinite,
				sliderAnimationSpeed,
				sliderCenterMode,
				sliderSpacing,
			}
		} = this.props;

		return sliderSlidesToShowDesktop != attributes.sliderSlidesToShowDesktop.default ||
			sliderSlidesToShowLaptop != attributes.sliderSlidesToShowLaptop.default ||
			sliderSlidesToShowTablet != attributes.sliderSlidesToShowTablet.default ||
			sliderSlidesToShowMobile != attributes.sliderSlidesToShowMobile.default ||
			sliderSlidesToScroll != attributes.sliderSlidesToScroll.default ||
			sliderAutoplay != attributes.sliderAutoplay.default ||
			sliderAutoplaySpeed != attributes.sliderAutoplaySpeed.default ||
			sliderInfinite != attributes.sliderInfinite.default ||
			sliderAnimationSpeed != attributes.sliderAnimationSpeed.default ||
			sliderCenterMode != attributes.sliderCenterMode.default ||
			sliderSpacing != attributes.sliderSpacing.default;
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

				imageSize,
				titleTag,
				showContent,
				showTitle,
				showDate,
				showCategories,
				showCommentsCount,
				showFeaturedImage,
				align,
				contentLength,
				cropImages,

				//Slider
				sliderSlidesToShowDesktop,
				sliderSlidesToShowLaptop,
				sliderSlidesToShowTablet,
				sliderSlidesToShowMobile,
				sliderSlidesToScroll,
				sliderAutoplay,
				sliderAutoplaySpeed,
				sliderInfinite,
				sliderAnimationSpeed,
				sliderCenterMode,
				sliderSpacing,
				sliderArrows,
				sliderDots,
			},
			setAttributes,

			changeState,
			getState,
		} = this.props;

		const resetSliderSettings = () => {
			setAttributes({
				sliderSlidesToShowDesktop: attributes.sliderSlidesToShowDesktop.default,
				sliderSlidesToShowLaptop: attributes.sliderSlidesToShowLaptop.default,
				sliderSlidesToShowTablet: attributes.sliderSlidesToShowTablet.default,
				sliderSlidesToShowMobile: attributes.sliderSlidesToShowMobile.default,
				sliderSlidesToScroll: attributes.sliderSlidesToScroll.default,
				sliderAutoplay: attributes.sliderAutoplay.default,
				sliderAutoplaySpeed: attributes.sliderAutoplaySpeed.default,
				sliderInfinite: attributes.sliderInfinite.default,
				sliderAnimationSpeed: attributes.sliderAnimationSpeed.default,
				sliderCenterMode: attributes.sliderCenterMode.default,
				sliderSpacing: attributes.sliderSpacing.default,
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
							filterById,
							postType,
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
					<PanelBody title={ __('Post Settings', 'getwid') }
						initialOpen={false}>
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
								{value: 'span', label: __('Paragraph', 'getwid')},
								{value: 'h2', label: __('Heading 2', 'getwid')},
								{value: 'h3', label: __('Heading 3', 'getwid')},
								{value: 'h4', label: __('Heading 4', 'getwid')},
								{value: 'h5', label: __('Heading 5', 'getwid')},
								{value: 'h6', label: __('Heading 6', 'getwid')},
							]}
							onChange={titleTag => setAttributes({titleTag})}
						/>
						)}
						<ToggleControl
							label={ __( 'Display Featured Image', 'getwid' ) }
							checked={ showFeaturedImage }
							onChange={ () => {
								setAttributes( { showFeaturedImage: !showFeaturedImage } );
							}}
						/>
						{showFeaturedImage && (
							<Fragment>
								<SelectControl
									label={__('Image Size', 'getwid')}
									help={__('For images from Media Library only.', 'getwid')}
									value={imageSize}
									onChange={ (value) => {
										setAttributes( { imageSize: value } );
									}}
									options={Getwid.settings.image_sizes}
								/>
								<ToggleControl
									label={ __( 'Crop Images', 'getwid' ) }
									checked={ cropImages }
									onChange={ () => {
										setAttributes( { cropImages: !cropImages } );
									}}
								/>
							</Fragment>
						)}
						<ToggleControl
							label={ __( 'Display Except', 'getwid' ) }
							checked={ showContent }
							onChange={ () => {
								setAttributes( { showContent: !showContent } );
							}}
						/>
						{ showContent &&
							<RangeControl
								label={ __( 'Number of words', 'getwid' ) }
								value={ contentLength }
								onChange={ ( contentLength ) => setAttributes( { contentLength } ) }
								min={ 5 }
								max={ Getwid.settings.excerpt_length }
							/>
						}

						<ToggleControl
							label={ __( 'Display Date', 'getwid' ) }
							checked={ showDate }
							onChange={ () => {
								setAttributes( { showDate: !showDate } );
							}}
						/>

						{postType == 'post' && (
							<ToggleControl
								label={ __( 'Display Categories', 'getwid' ) }
								checked={ showCategories }
								onChange={ () => {
									setAttributes( { showCategories: !showCategories } );
								}}
							/>
						)}

						<ToggleControl
							label={ __( 'Display Comments', 'getwid' ) }
							checked={ showCommentsCount }
							onChange={ () => {
								setAttributes( { showCommentsCount: !showCommentsCount } );
							}}
						/>
					</PanelBody>
				)}
				
				<PanelBody title={ __( 'Slider Settings', 'getwid' ) } initialOpen={false}>			
					<TextControl
						label={__('Slides on Desktop', 'getwid')}
						type={'number'}
						value={parseInt(sliderSlidesToShowDesktop, 10)}
						min={1}
						max={10}
						step={1}
						onChange={sliderSlidesToShowDesktop => setAttributes({sliderSlidesToShowDesktop: sliderSlidesToShowDesktop.toString()})}
					/>

					<TextControl
						disabled={(parseInt(sliderSlidesToShowDesktop, 10) > 1 ? null : true)}
						label={__('Slides on Laptop', 'getwid')}
						type={'number'}
						value={parseInt(sliderSlidesToShowLaptop, 10)}
						min={1}
						max={10}
						step={1}
						onChange={sliderSlidesToShowLaptop => setAttributes({sliderSlidesToShowLaptop: sliderSlidesToShowLaptop.toString()})}
					/>
					<TextControl
						disabled={(parseInt(sliderSlidesToShowDesktop, 10) > 1 ? null : true)}
						label={__('Slides on Tablet', 'getwid')}
						type={'number'}
						value={parseInt(sliderSlidesToShowTablet, 10)}
						min={1}
						max={10}
						step={1}
						onChange={sliderSlidesToShowTablet => setAttributes({sliderSlidesToShowTablet: sliderSlidesToShowTablet.toString()})}
					/>
					<TextControl
						disabled={(parseInt(sliderSlidesToShowDesktop, 10) > 1 ? null : true)}
						label={__('Slides on Mobile', 'getwid')}
						type={'number'}
						value={parseInt(sliderSlidesToShowMobile, 10)}
						min={1}
						max={10}
						step={1}
						onChange={sliderSlidesToShowMobile => setAttributes({sliderSlidesToShowMobile: sliderSlidesToShowMobile.toString()})}
					/>
					<TextControl
						disabled={(parseInt(sliderSlidesToShowDesktop, 10) > 1 ? null : true)}
						label={__('Slides to Scroll', 'getwid')}
						type={'number'}
						value={parseInt(sliderSlidesToScroll, 10)}
						min={1}
						max={10}
						step={1}
						onChange={sliderSlidesToScroll => setAttributes({sliderSlidesToScroll: sliderSlidesToScroll.toString()})}
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
					<ToggleControl
						label={ __( 'Center Mode', 'getwid' ) }
						checked={ sliderCenterMode }
						onChange={ () => {
							setAttributes( { sliderCenterMode: !sliderCenterMode } );
						}}
					/>		
					{(parseInt(sliderSlidesToShowDesktop, 10) > 1) &&
						(
							<SelectControl
								label={__('Spacing', 'getwid')}
								value={sliderSpacing}
								onChange={sliderSpacing => setAttributes({sliderSpacing})}
								options={[
									{ value: 'none', label: __( 'None', 'getwid' ) },
									{ value: 'small', label: __( 'Small', 'getwid' ) },
									{ value: 'normal', label: __( 'Medium', 'getwid' ) },
									{ value: 'large', label: __( 'Large', 'getwid' ) },
									{ value: 'huge', label: __( 'Huge', 'getwid' ) },
								]}
							/>
						)
					}	

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