/**
 * Inspector Controls
 */

import GetwidAnimationSelectControl from 'GetwidControls/animation-select-control';
import {
	pick,
	times
} from "lodash";

const { __ } = wp.i18n;
const {
	Component,
	Fragment,
} = wp.element;
const {
	InnerBlocks,
	InspectorControls,
	ColorPalette,
	RichText,
	BlockControls,
	AlignmentToolbar,
	BlockAlignmentToolbar,
	MediaUpload,
	MediaPlaceholder,
	PanelColorSettings
} = wp.editor;
const {
	Button,
	BaseControl,
	ButtonGroup,
	Tooltip,
	TabPanel,
	IconButton,
	Dashicon,
	PanelBody,
	RangeControl,
	ToggleControl,
	SelectControl,
	DropdownMenu,
	Toolbar,
	RadioControl,
	TextControl,
	CheckboxControl
} = wp.components;

/**
 * Create an Inspector Controls wrapper Component
 */
class Inspector extends Component {

	constructor( props ) {
		super( ...arguments );	
	}

	getImageCropHelp( checked ) {
		return checked ? __( 'Thumbnails are cropped to align.' ) : __( 'Thumbnails are not cropped.' );
	}		

	render() {
		const {
			attributes:{
				align,
				images,
				ids,
				imageSize,
				imageCrop,
				linkTo,
				imageAlignment,
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
			setAttributes,
			isSelected,
			className,
			noticeOperations,
			noticeUI
		} = this.props;

		return (
			<InspectorControls>
				<PanelBody title={ __( 'Image Settings', 'getwid' ) } initialOpen={false}>
					<SelectControl
						label={__('Image Size', 'getwid')}
						value={imageSize}
						onChange={imageSize => {
							setAttributes({imageSize});						
						}}
						options={[
							{value: 'thumbnail', label: __('Thumbnail', 'getwid')},
							{value: 'medium', label: __('Medium', 'getwid')},
							{value: 'large', label: __('Large', 'getwid')},
							{value: 'full', label: __('Full Size', 'getwid')},
						]}
					/>
			
					<ToggleControl
						label={ __( 'Crop Images', 'getwid' ) }
						checked={ imageCrop }
						onChange={ () => {
							setAttributes( { imageCrop: !imageCrop } );
						}}						
						help={ this.getImageCropHelp }
					/>
					<SelectControl
						label={__('Link to', 'getwid')}
						value={linkTo}
						onChange={linkTo => setAttributes({linkTo})}
						options={[
							{ value: 'attachment', label: __( 'Attachment Page', 'getwid' ) },
							{ value: 'media', label: __( 'Media File', 'getwid' ) },
							{ value: 'none', label: __( 'None', 'getwid' ) },
						]}
					/>
					{(imageCrop == false && images.length > 1) && 
						(
							<SelectControl
								label={__('Image Alignment', 'getwid')}
								value={imageAlignment}
								onChange={imageAlignment => setAttributes({imageAlignment})}
								options={[
									{ value: 'top', label: __( 'Align Top', 'getwid' ) },
									{ value: 'center', label: __( 'Align Center', 'getwid' ) },
									{ value: 'bottom', label: __( 'Align Bottom', 'getwid' ) },
								]}
							/>
						)
					}
				</PanelBody>

				<PanelBody title={ __( 'Slider Settings', 'getwid' ) } initialOpen={false}>
					{(sliderSlidesToShow < 2) &&
						(
							<RadioControl
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
					<RangeControl
						label={__('Slides to Show', 'getwid')}
						value={sliderSlidesToShow}
						onChange={sliderSlidesToShow => setAttributes({sliderSlidesToShow})}
						min={1}
						max={10}
						step={1}
					/>
					{(sliderSlidesToShow > 1) &&
						(
							<Fragment>
								<RangeControl
									label={__('Slides to Show (Laptop)', 'getwid')}
									value={sliderSlidesToShowLaptop}
									onChange={sliderSlidesToShowLaptop => setAttributes({sliderSlidesToShowLaptop})}
									min={1}
									max={10}
									step={1}
								/>
								<RangeControl
									label={__('Slides to Show (Tablet)', 'getwid')}
									value={sliderSlidesToShowTablet}
									onChange={sliderSlidesToShowTablet => setAttributes({sliderSlidesToShowTablet})}
									min={1}
									max={10}
									step={1}
								/>
								<RangeControl
									label={__('Slides to Show (Mobile)', 'getwid')}
									value={sliderSlidesToShowMobile}
									onChange={sliderSlidesToShowMobile => setAttributes({sliderSlidesToShowMobile})}
									min={1}
									max={10}
									step={1}
								/>
							</Fragment>
						)
					}				
					{(sliderSlidesToShow > 1) &&
						(
							<RangeControl
								label={__('Slides to Scroll', 'getwid')}
								value={sliderSlidesToScroll}
								onChange={sliderSlidesToScroll => setAttributes({sliderSlidesToScroll})}
								min={1}
								max={10}
								step={1}
							/>
						)
					}
					<ToggleControl
						label={ __( 'Autoplay', 'getwid' ) }
						checked={ sliderAutoplay }
						onChange={ () => {
							setAttributes( { sliderAutoplay: !sliderAutoplay } );
						}}
					/>
					{!!sliderAutoplay &&
						(
							<TextControl
								label={__('Autoplay Speed', 'getwid')}
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
						label={ __( 'Variable width', 'getwid' ) }
						checked={ sliderVariableWidth }
						onChange={ () => {
							setAttributes( { sliderVariableWidth: !sliderVariableWidth } );
						}}
					/>			
					{(sliderSlidesToShow > 1) &&
						(
							<SelectControl
								label={__('Spacing', 'getwid')}
								value={sliderSpacing}
								onChange={sliderSpacing => setAttributes({sliderSpacing})}
								options={[
									{ value: 'none', label: __( 'None', 'getwid' ) },
									{ value: 'small', label: __( 'Small', 'getwid' ) },
									{ value: 'normal', label: __( 'Normal', 'getwid' ) },
									{ value: 'large', label: __( 'Large', 'getwid' ) },
									{ value: 'huge', label: __( 'Huge', 'getwid' ) },
								]}
							/>
						)
					}	
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

export default ( Inspector );