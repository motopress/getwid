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
				<PanelBody title={__('Content Settings', 'getwid')} initialOpen={true}>
					{/* Custom Post Type */}
					<GetwidCustomQueryControl
						setValues={ setAttributes }
						options={['sticky', 'parentFilter']}
						values={{
							postsToShow,
							ignoreSticky,
							filterById,
							parentPageId,
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
				
				<PanelBody title={ __( 'Display Settings', 'getwid' ) } initialOpen={false}>			
				
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
				</PanelBody>
			</InspectorControls>
		);
	}
}