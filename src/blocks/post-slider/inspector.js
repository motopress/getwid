/**
* External dependencies
*/
import attributes from './attributes';
import GetwidStyleLengthControl from 'GetwidControls/style-length-control';
import GetwidCustomQueryControl from 'GetwidControls/custom-query-control'; //Custom Post Type

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
	PanelColorSettings
} = wp.editor;
const {
	SelectControl,
	PanelBody,
	TabPanel,
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

	hasPadding() {
		const {attributes: {
			paddingTopValue, paddingRightValue, paddingBottomValue, paddingLeftValue,
			paddingTop, paddingRight, paddingBottom, paddingLeft,
			paddingTopTablet, paddingRightTablet, paddingBottomTablet, paddingLeftTablet,
			paddingTopMobile, paddingRightMobile, paddingBottomMobile, paddingLeftMobile,
		}} = this.props;
		return paddingTopValue !== undefined ||
			paddingBottomValue !== undefined ||
			paddingRightValue !== undefined ||
			paddingLeftValue !== undefined ||
			paddingTop !== '' ||
			paddingRight !== '' ||
			paddingBottom !== '' ||
			paddingLeft !== '' ||
			paddingTopTablet !== '' ||
			paddingRightTablet !== '' ||
			paddingBottomTablet !== '' ||
			paddingLeftTablet !== '' ||
			paddingTopMobile !== '' ||
			paddingRightMobile !== '' ||
			paddingBottomMobile !== '' ||
			paddingLeftMobile !== '';
	}

	renderResponsivePaddingsTabs( tab ){

		const{
			attributes:{
				paddingTopValue, paddingRightValue, paddingBottomValue, paddingLeftValue,
				paddingTop, paddingRight, paddingBottom, paddingLeft,
				paddingTopTablet, paddingRightTablet, paddingBottomTablet, paddingLeftTablet,
				paddingTopMobile, paddingRightMobile, paddingBottomMobile, paddingLeftMobile,
			},
			setAttributes
		} = this.props;


		switch (tab.name){
			case 'desktop': {
				return(
					<Fragment>
						<SelectControl
							label={__('Padding Top', 'getwid')}
							value={paddingTop !== undefined ? paddingTop : ''}
							onChange={paddingTop => setAttributes({paddingTop})}
							options={[
								{value: '', label: __('Default', 'getwid')},
								{value: 'small', label: __('Small', 'getwid')},
								{value: 'medium', label: __('Medium', 'getwid')},
								{value: 'normal', label: __('Normal', 'getwid')},
								{value: 'large', label: __('Large', 'getwid')},
								{value: 'custom', label: __('Custom', 'getwid')},
								{value: 'none', label: __('None', 'getwid')},
							]}
						/>
						{
							paddingTop === 'custom' && (
								<GetwidStyleLengthControl
									// label={__('Custom Top', 'getwid')}
									value={paddingTopValue}
									onChange={paddingTopValue => {
										setAttributes({paddingTopValue});
									}}
								/>
							)
						}
						<SelectControl
							label={__('Padding Bottom', 'getwid')}
							value={paddingBottom !== undefined ? paddingBottom : ''}
							onChange={paddingBottom => setAttributes({paddingBottom})}
							options={[
								{value: '', label: __('Default', 'getwid')},
								{value: 'small', label: __('Small', 'getwid')},
								{value: 'medium', label: __('Medium', 'getwid')},
								{value: 'normal', label: __('Normal', 'getwid')},
								{value: 'large', label: __('Large', 'getwid')},
								{value: 'custom', label: __('Custom', 'getwid')},
								{value: 'none', label: __('None', 'getwid')},
							]}
						/>
						{
							paddingBottom === 'custom' && (
								<GetwidStyleLengthControl
									// label={__('Custom Bottom', 'getwid')}
									value={paddingBottomValue}
									onChange={paddingBottomValue => {
										setAttributes({paddingBottomValue});
									}}
								/>
							)
						}
						<SelectControl
							label={__('Padding Left', 'getwid')}
							value={paddingLeft !== undefined ? paddingLeft : ''}
							onChange={paddingLeft => setAttributes({paddingLeft})}
							options={[
								{value: '', label: __('Default', 'getwid')},
								{value: 'small', label: __('Small', 'getwid')},
								{value: 'medium', label: __('Medium', 'getwid')},
								{value: 'normal', label: __('Normal', 'getwid')},
								{value: 'large', label: __('Large', 'getwid')},
								{value: 'custom', label: __('Custom', 'getwid')},
								{value: 'none', label: __('None', 'getwid')},
							]}
						/>
						{
							paddingLeft === 'custom' && (
								<GetwidStyleLengthControl
									// label={__('Custom Left', 'getwid')}
									value={paddingLeftValue}
									onChange={paddingLeftValue => {
										setAttributes({paddingLeftValue});
									}}
								/>
							)
						}
						<SelectControl
							label={__('Padding Right', 'getwid')}
							value={paddingRight !== undefined ? paddingRight : ''}
							onChange={paddingRight => setAttributes({paddingRight})}
							options={[
								{value: '', label: __('Default', 'getwid')},
								{value: 'small', label: __('Small', 'getwid')},
								{value: 'medium', label: __('Medium', 'getwid')},
								{value: 'normal', label: __('Normal', 'getwid')},
								{value: 'large', label: __('Large', 'getwid')},
								{value: 'custom', label: __('Custom', 'getwid')},
								{value: 'none', label: __('None', 'getwid')},
							]}
						/>
						{
							paddingRight === 'custom' && (
								<GetwidStyleLengthControl
									// label={__('Custom Right', 'getwid')}
									value={paddingRightValue}
									onChange={paddingRightValue => {
										setAttributes({paddingRightValue});
									}}
								/>
							)
						}
					</Fragment>
				)
			}
			case 'tablet': {
				return(
					<Fragment>
						<SelectControl
							label={__('Padding Top', 'getwid')}
							value={paddingTopTablet !== undefined ? paddingTopTablet : ''}
							onChange={paddingTopTablet => setAttributes({paddingTopTablet})}
							options={[
								{value: '', label: __('Default', 'getwid')},
								{value: 'small', label: __('Small', 'getwid')},
								{value: 'medium', label: __('Medium', 'getwid')},
								{value: 'normal', label: __('Normal', 'getwid')},
								{value: 'large', label: __('Large', 'getwid')},
								{value: 'none', label: __('None', 'getwid')},
							]}
						/>
						<SelectControl
							label={__('Padding Bottom', 'getwid')}
							value={paddingBottomTablet !== undefined ? paddingBottomTablet : ''}
							onChange={paddingBottomTablet => setAttributes({paddingBottomTablet})}
							options={[
								{value: '', label: __('Default', 'getwid')},
								{value: 'small', label: __('Small', 'getwid')},
								{value: 'medium', label: __('Medium', 'getwid')},
								{value: 'normal', label: __('Normal', 'getwid')},
								{value: 'large', label: __('Large', 'getwid')},
								{value: 'none', label: __('None', 'getwid')},
							]}
						/>
						<SelectControl
							label={__('Padding Left', 'getwid')}
							value={paddingLeftTablet !== undefined ? paddingLeftTablet : ''}
							onChange={paddingLeftTablet => setAttributes({paddingLeftTablet})}
							options={[
								{value: '', label: __('Default', 'getwid')},
								{value: 'small', label: __('Small', 'getwid')},
								{value: 'medium', label: __('Medium', 'getwid')},
								{value: 'normal', label: __('Normal', 'getwid')},
								{value: 'large', label: __('Large', 'getwid')},
								{value: 'none', label: __('None', 'getwid')},
							]}
						/>

						<SelectControl
							label={__('Padding Right', 'getwid')}
							value={paddingRightTablet !== undefined ? paddingRightTablet : ''}
							onChange={paddingRightTablet => setAttributes({paddingRightTablet})}
							options={[
								{value: '', label: __('Default', 'getwid')},
								{value: 'small', label: __('Small', 'getwid')},
								{value: 'medium', label: __('Medium', 'getwid')},
								{value: 'normal', label: __('Normal', 'getwid')},
								{value: 'large', label: __('Large', 'getwid')},
								{value: 'none', label: __('None', 'getwid')},
							]}
						/>
					</Fragment>
				)
			}
			case 'mobile': {
				return(
					<Fragment>
						<SelectControl
							label={__('Padding Top', 'getwid')}
							value={paddingTopMobile !== undefined ? paddingTopMobile : ''}
							onChange={paddingTopMobile => setAttributes({paddingTopMobile})}
							options={[
								{value: '', label: __('Default', 'getwid')},
								{value: 'small', label: __('Small', 'getwid')},
								{value: 'medium', label: __('Medium', 'getwid')},
								{value: 'normal', label: __('Normal', 'getwid')},
								{value: 'large', label: __('Large', 'getwid')},
								{value: 'none', label: __('None', 'getwid')},
							]}
						/>
						<SelectControl
							label={__('Padding Bottom', 'getwid')}
							value={paddingBottomMobile !== undefined ? paddingBottomMobile : ''}
							onChange={paddingBottomMobile => setAttributes({paddingBottomMobile})}
							options={[
								{value: '', label: __('Default', 'getwid')},
								{value: 'small', label: __('Small', 'getwid')},
								{value: 'medium', label: __('Medium', 'getwid')},
								{value: 'normal', label: __('Normal', 'getwid')},
								{value: 'large', label: __('Large', 'getwid')},
								{value: 'none', label: __('None', 'getwid')},
							]}
						/>
						<SelectControl
							label={__('Padding Left', 'getwid')}
							value={paddingLeftMobile !== undefined ? paddingLeftMobile : ''}
							onChange={paddingLeftMobile => setAttributes({paddingLeftMobile})}
							options={[
								{value: '', label: __('Default', 'getwid')},
								{value: 'small', label: __('Small', 'getwid')},
								{value: 'medium', label: __('Medium', 'getwid')},
								{value: 'normal', label: __('Normal', 'getwid')},
								{value: 'large', label: __('Large', 'getwid')},
								{value: 'none', label: __('None', 'getwid')},
							]}
						/>

						<SelectControl
							label={__('Padding Right', 'getwid')}
							value={paddingRightMobile !== undefined ? paddingRightMobile : ''}
							onChange={paddingRightMobile => setAttributes({paddingRightMobile})}
							options={[
								{value: '', label: __('Default', 'getwid')},
								{value: 'small', label: __('Small', 'getwid')},
								{value: 'medium', label: __('Medium', 'getwid')},
								{value: 'normal', label: __('Normal', 'getwid')},
								{value: 'large', label: __('Large', 'getwid')},
								{value: 'none', label: __('None', 'getwid')},
							]}
						/>
					</Fragment>
				)
			}

		}
	}

	render() {
		const {
			attributes: {
				//Custom Post Type
				postsToShow,
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
				// textColor,
				// overlayColor,
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

		const resetPadding = () => {
			setAttributes({
				paddingTopValue: undefined,
				paddingBottomValue: undefined,
				paddingLeftValue: undefined,
				paddingRightValue: undefined,

				paddingTop: '',
				paddingBottom: '',
				paddingLeft: '',
				paddingRight: '',

				paddingTopTablet: '',
				paddingBottomTablet: '',
				paddingLeftTablet: '',
				paddingRightTablet: '',

				paddingTopMobile: '',
				paddingBottomMobile: '',
				paddingLeftMobile: '',
				paddingRightMobile: '',
			})
		};

		return (
			<InspectorControls>
				<PanelBody title={ __('Content Settings', 'getwid') }>
					{/* Custom Post Type */}
					<GetwidCustomQueryControl
						//PostsToShow
						postsToShow={ postsToShow }
						onChangePostsToShow={ (value) => setAttributes({postsToShow: value}) }

						//PostType
						postType={ postType }
						onChangePostType={ (value) => {
							if (value == ''){
								setAttributes({
									postType: undefined,
									taxonomy: undefined,
									terms: undefined,
								});
							} else {
								setAttributes({
									postType: value,
									taxonomy: undefined,
									terms: undefined,									
								});
							}
						} }

						//Taxonomy
						taxonomy={ taxonomy }
						onChangeTaxonomy={ (value) => {
							if (value == ''){
								setAttributes({
									taxonomy: undefined,
									terms: undefined,
								});
							} else {
								setAttributes({
									taxonomy: value,
									terms: undefined,
								});								
							}

						} }

						//Terms
						terms={ terms }
						onChangeTerms={ (value) => {
							if (!value.length){
								setAttributes({
									terms: undefined,
								});
							} else {
								setAttributes({
									terms: value,
								});
							}
						} }

						//Relation
						relation={ relation }
						onChangeRelation={ (value) => setAttributes({relation: value}) }

						//Order
						order={ order }
						onChangeOrder={ (value) => setAttributes({order: value}) }

						//Order by
						orderBy={ orderBy }
						onChangeOrderBy={ (value) => setAttributes({orderBy: value}) }						
					/>
					{/* Custom Post Type */}

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
				</PanelBody>

				<PanelBody title={__('Padding', 'getwid')} initialOpen={false}>

					<TabPanel className="getwid-editor-tabs"
							activeClass="is-active"
							tabs={ [
								{
									name: 'desktop',
									title: __('Desktop', 'getwid'),
									className: 'components-button is-link is-small',
								},
								{
									name: 'tablet',
									title: __('Tablet', 'getwid'),
									className: 'components-button is-link is-small',
								},
								{
									name: 'mobile',
									title: __('Mobile', 'getwid'),
									className: 'components-button is-link is-small',
								},
							] }>
						{
							(tab) => this.renderResponsivePaddingsTabs(tab)

						}
					</TabPanel>
					<BaseControl>
						<Button isLink
							onClick={resetPadding}
							disabled={ !this.hasPadding() }>
							{__('Reset All', 'getwid')}
						</Button>
					</BaseControl>
				</PanelBody>

				<PanelBody title={ __('Posts Settings', 'getwid') }>
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
							{value: 'excerpt', label: __('Except', 'getwid')},
							{value: 'content', label: __('Post Content', 'getwid')},
						]}
						onChange={showContent => setAttributes({showContent})}
					/>

					{ showContent !='none' &&
						<RangeControl
							label={ __( 'Number of words', 'getwid' ) }
							value={ contentLength }
							onChange={ ( contentLength ) => setAttributes( { contentLength } ) }
							min={ 5 }
							max={ Getwid.settings.excerpt_length }
						/>
					}
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