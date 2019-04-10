/**
* External dependencies
*/
import attributes from './attributes';

/**
* WordPress dependencies
*/
const { __ } = wp.i18n;
const {
	Component,
	Fragment,
} = wp.element;
const {
	InspectorControls,
} = wp.editor;
const {
	Button,
	BaseControl,
	ButtonGroup,
	PanelBody,
	RangeControl,
	ToggleControl,
	SelectControl,
	Modal,
	TextControl,
	TextareaControl,
	ExternalLink,
	RadioControl,
	Notice
} = wp.components;


/**
* Create an Inspector Controls
*/
class Inspector extends Component {

	constructor( props ) {
		super( ...arguments );	
	}

	hasSliderSettings(){
		const {
			attributes: {
				sliderSlidesToShow,
				sliderSlidesToShowLaptop,
				sliderSlidesToShowTablet,
				sliderSlidesToShowMobile,
				sliderSlidesToScroll,
				sliderAutoplay,
				sliderAnimationEffect,
				sliderAutoplaySpeed,
				sliderInfinite,
				sliderAnimationSpeed,
				sliderCenterMode,
				sliderVariableWidth,
				sliderSpacing,
			}
		} = this.props;

		return sliderSlidesToShow != attributes.sliderSlidesToShow.default ||
			sliderSlidesToShowLaptop != attributes.sliderSlidesToShowLaptop.default ||
			sliderSlidesToShowTablet != attributes.sliderSlidesToShowTablet.default ||
			sliderSlidesToShowMobile != attributes.sliderSlidesToShowMobile.default ||
			sliderSlidesToScroll != attributes.sliderSlidesToScroll.default ||
			sliderAutoplay != attributes.sliderAutoplay.default ||
			sliderAnimationEffect != attributes.sliderAnimationEffect.default ||
			sliderAutoplaySpeed != attributes.sliderAutoplaySpeed.default ||
			sliderInfinite != attributes.sliderInfinite.default ||
			sliderAnimationSpeed != attributes.sliderAnimationSpeed.default ||
			sliderCenterMode != attributes.sliderCenterMode.default ||
			sliderVariableWidth != attributes.sliderVariableWidth.default ||
			sliderSpacing != attributes.sliderSpacing.default;
	}

	render() {
		const {
			attributes: {
				photoCount,
				displayStyle,
				gridColumns,
				showLikes,
				showComments,

				sliderAnimationEffect,
				sliderSlidesToShow,
				sliderSlidesToShowLaptop,
				sliderSlidesToShowTablet,
				sliderSlidesToShowMobile,
				sliderSlidesToScroll,
				sliderAutoplay,
				sliderAutoplaySpeed,
				sliderInfinite,
				sliderAnimationSpeed,
				sliderCenterMode,
				sliderVariableWidth,
				sliderSpacing,
				sliderArrows,
				sliderDots,				
			},
			//Functions
			changeState,
			getState,
			manageInstagramToken,
			
			setAttributes,
			className
		} = this.props;

		const resetSliderSettings = () => {
			setAttributes({
				sliderSlidesToShow: attributes.sliderSlidesToShow.default,
				sliderSlidesToShowLaptop: attributes.sliderSlidesToShowLaptop.default,
				sliderSlidesToShowTablet: attributes.sliderSlidesToShowTablet.default,
				sliderSlidesToShowMobile: attributes.sliderSlidesToShowMobile.default,
				sliderSlidesToScroll: attributes.sliderSlidesToScroll.default,
				sliderAutoplay: attributes.sliderAutoplay.default,
				sliderAnimationEffect: attributes.sliderAnimationEffect.default,
				sliderAutoplaySpeed: attributes.sliderAutoplaySpeed.default,
				sliderInfinite: attributes.sliderInfinite.default,
				sliderAnimationSpeed: attributes.sliderAnimationSpeed.default,
				sliderCenterMode: attributes.sliderCenterMode.default,
				sliderVariableWidth: attributes.sliderVariableWidth.default,
				sliderSpacing: attributes.sliderSpacing.default,
			})
		};

		return (
			<InspectorControls key="inspector">
				<PanelBody title={ __( 'Settings', 'getwid' ) } initialOpen={true}>

					<RangeControl
						label={__('Photo to show', 'getwid')}
						value={photoCount}
						onChange={photoCount => {
							if (typeof photoCount == 'undefined'){
								photoCount = 10;
							}
							setAttributes({photoCount});
						}}
						allowReset
						min={1}
						max={100}
						step={1}
					/>

					<SelectControl
						label={__('Display style', 'getwid')}
						value={displayStyle}
						onChange={displayStyle => setAttributes({displayStyle})}
						options={[
							{value: 'grid', label: __('Grid', 'getwid'), },
							{value: 'carousel', label: __('Carousel', 'getwid'), },
						]}
					/>

					{displayStyle == 'grid' && (
						<RangeControl
							label={__('Grid Columns', 'getwid')}
							value={gridColumns}
							onChange={gridColumns => {
								if (typeof gridColumns == 'undefined'){
									gridColumns = 3;
								}
								setAttributes({gridColumns});
							}}
							allowReset
							min={1}
							max={6}
							step={1}
						/>
					)}

					<ToggleControl
						label={ __( 'Show Likes Count', 'getwid' ) }
						checked={ showLikes }
						onChange={ showLikes => {
							setAttributes({showLikes});
						} }
					/>

					<ToggleControl
						label={ __( 'Show Comments Count', 'getwid' ) }
						checked={ showComments }
						onChange={ showComments => {
							setAttributes({showComments});
						} }
					/>				

				</PanelBody>

				{displayStyle == 'carousel' && (
					<Fragment>
						<PanelBody title={ __( 'Slider Settings', 'getwid' ) } initialOpen={false}>			
							<TextControl
								label={__('Slides on Desktop', 'getwid')}
								type={'number'}
								value={parseInt(sliderSlidesToShow, 10)}
								min={1}
								max={10}
								step={1}
								onChange={sliderSlidesToShow => setAttributes({sliderSlidesToShow: sliderSlidesToShow.toString()})}
							/>

							<TextControl
								disabled={(parseInt(sliderSlidesToShow, 10) > 1 ? null : true)}
								label={__('Slides on Laptop', 'getwid')}
								type={'number'}
								value={parseInt(sliderSlidesToShowLaptop, 10)}
								min={1}
								max={10}
								step={1}
								onChange={sliderSlidesToShowLaptop => setAttributes({sliderSlidesToShowLaptop: sliderSlidesToShowLaptop.toString()})}
							/>
							<TextControl
								disabled={(parseInt(sliderSlidesToShow, 10) > 1 ? null : true)}
								label={__('Slides on Tablet', 'getwid')}
								type={'number'}
								value={parseInt(sliderSlidesToShowTablet, 10)}
								min={1}
								max={10}
								step={1}
								onChange={sliderSlidesToShowTablet => setAttributes({sliderSlidesToShowTablet: sliderSlidesToShowTablet.toString()})}
							/>
							<TextControl
								disabled={(parseInt(sliderSlidesToShow, 10) > 1 ? null : true)}
								label={__('Slides on Mobile', 'getwid')}
								type={'number'}
								value={parseInt(sliderSlidesToShowMobile, 10)}
								min={1}
								max={10}
								step={1}
								onChange={sliderSlidesToShowMobile => setAttributes({sliderSlidesToShowMobile: sliderSlidesToShowMobile.toString()})}
							/>
							<TextControl
								disabled={(parseInt(sliderSlidesToShow, 10) > 1 ? null : true)}
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
							{(parseInt(sliderSlidesToShow, 10) < 2) &&
								(
									<RadioControl
										disabled={(parseInt(sliderSlidesToShow, 10) < 2 ? null : true)}
										label={__('Animation Effect', 'getwid')}
										selected={ sliderAnimationEffect }
										options={ [
											{value: 'slide', label: __('Slide', 'getwid')},
											{value: 'fade', label: __('Fade', 'getwid')},
										] }
										onChange={sliderAnimationEffect => setAttributes({sliderAnimationEffect}) }
									/>
								)
							}
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
							<ToggleControl
								label={ __( 'Variable Width', 'getwid' ) }
								checked={ sliderVariableWidth }
								onChange={ () => {
									setAttributes( { sliderVariableWidth: !sliderVariableWidth } );
								}}
							/>			
							{(parseInt(sliderSlidesToShow, 10) > 1) &&
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
					</Fragment>
				)}

				<PanelBody title={ __( 'Instagram Access token', 'getwid' ) } initialOpen={false}>

						<TextControl
							label={__('Instagram Access token', 'getwid')}
							value={ getState('checkToken') }
							onChange={ value => changeState('checkToken', value) }
						/>
						<BaseControl>
							<ButtonGroup>
								<Button
								isPrimary
								disabled={((getState('checkToken') != '') ? null : true)}
								onClick={ 
									(event) => {
										manageInstagramToken(event, 'set');
									}
								}>
									{ __( 'Update', 'getwid' ) }
								</Button>

								<Button isDefault onClick={
									(event) => {
										changeState('checkToken', '');
										changeState('instagramToken', '');
										manageInstagramToken(event, 'delete');
									}
								}>
									{ __( 'Delete', 'getwid' ) }
								</Button>
							</ButtonGroup>
						</BaseControl>
						<BaseControl>
							<ExternalLink href="https://www.instagram.com/developer/authentication/">{__('Get your key.', 'getwid')}</ExternalLink>
						</BaseControl>

				</PanelBody>

			</InspectorControls>
		);
	}

}

export default ( Inspector );