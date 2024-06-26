/**
* External dependencies
*/
import attributes from './attributes';
import GetwidCustomQueryControl from 'GetwidControls/custom-query-control'; //Custom Post Type
import { TemplateSelectControl } from 'GetwidControls/post-template-select';


/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {
	Component,
} = wp.element;
const {
	InspectorControls,
} = wp.blockEditor || wp.editor;
const {
	SelectControl,
	PanelBody,
	ToggleControl,
	TextControl,
	RadioControl,
	BaseControl,
	Button
} = wp.components;
const { serverSideRender: ServerSideRender } = wp;

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

				align,

				//Slider
				sliderSlidesToShowDesktop,
				sliderSlidesToShowLaptop,
				sliderSlidesToShowTablet,
				sliderSlidesToShowMobile,
				sliderSlidesToScroll,
				sliderAutoplay,
				sliderAutoplaySpeed,
				sliderPauseOnHover,
				sliderInfinite,
				sliderAnimationSpeed,
				sliderCenterMode,
				sliderSpacing,
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
				<PanelBody title={__('Content Settings', 'getwid')} initialOpen={true}>
					{/* Custom Post Type */}
					<GetwidCustomQueryControl
						setValues={ setAttributes }
						options={['sticky', 'parentFilter']}
						values={{
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
							metaQuery
						}}
						onChangeCallback={ (value, element) => {} }
					/>
					{/* Custom Post Type */}
				</PanelBody>

				<PanelBody title={ __( 'Display Settings', 'getwid' ) } initialOpen={false}>

					<TemplateSelectControl
						selectedTemplate={ postTemplate }
						onSelect={ ( templateID ) => setAttributes( { postTemplate: templateID } ) }
						previewRender={
							( templateID ) => (
								<ServerSideRender
									block='getwid/post-carousel'
									attributes={ { ...this.props.attributes, postTemplate: templateID } }
								/>
							)
						}
					/>
					<TextControl
						label={__( 'Slides on Desktop', 'getwid' )}
						help={__( 'Works with the Slide effect only. Specifies the number of slides displayed at once. Applies to screens wider than 991 pixels.', 'getwid' )}
						type='number'
						value={sliderSlidesToShowDesktop}
						onChange={ value => setAttributes( { sliderSlidesToShowDesktop: value.toString() } )}
						min={1}
						max={10}
						step={1}
					/>
					<TextControl
						disabled={(parseInt(sliderSlidesToShowDesktop, 10) > 1 ? null : true)}
						label={__('Slides on Laptop', 'getwid')}
						help={__( 'Applies to screens between 768 and 991 pixels wide.', 'getwid' )}
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
						help={__( 'Applies to screens between 468 and 768 pixels wide.', 'getwid' )}
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
						help={__( 'Applies to screens up to 468 pixels wide.', 'getwid' )}
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
						help={__( 'Specifies the number of slides that will scroll at once. Applies to screens wider than 991 pixels.', 'getwid' )}
						type={'number'}
						value={parseInt(sliderSlidesToScroll, 10)}
						min={1}
						max={10}
						step={1}
						onChange={sliderSlidesToScroll => setAttributes({sliderSlidesToScroll: sliderSlidesToScroll.toString()})}
					/>

					<ToggleControl
						label={ __( 'Enable Slideshow', 'getwid' ) }
						help={ __( 'Slideshow plays automatically.', 'getwid' ) }
						checked={ sliderAutoplay }
						onChange={ () => {
							setAttributes( { sliderAutoplay: !sliderAutoplay } );
						}}
					/>
					{!!sliderAutoplay &&
						(
							<>
								<TextControl
									label={__('Slideshow Speed', 'getwid')}
									type={'number'}
									value={sliderAutoplaySpeed}
									min={0}
									onChange={sliderAutoplaySpeed => setAttributes({sliderAutoplaySpeed})}
								/>
								<ToggleControl
									label={__( 'Pause On Hover', 'getwid' )}
									help={__( 'Pause the slideshow when the mouse cursor is over a slider.', 'getwid' )}
									checked={sliderPauseOnHover}
									onChange={() => {
										setAttributes( { sliderPauseOnHover: ! sliderPauseOnHover } );
									}}
								/>
							</>
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
						help={__( 'Displays slides centered, with partial previews of the previous and next slides. Use with odd numbered "Slides on ..." slides.', 'getwid' )}
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
