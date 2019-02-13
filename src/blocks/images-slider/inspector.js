/**
 * Inspector Controls
 */

import GetwidAnimationSelectControl from 'GetwidControls/animation-select-control';
import {
	get,
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
	Notice,
	RangeControl,
	ToggleControl,
	SelectControl,
	DropdownMenu,
	Toolbar,
	RadioControl,
	TextControl,
	CheckboxControl
} = wp.components;

const {
	select
} = wp.data;

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
			pickRelevantMediaFiles,
			changeState,
			getState,
			isSelected,
			className,
		} = this.props;

		const onChangeImageSize = (imageSize) => {
			const { getMedia } = select( 'core' );
			const imgObj = ids.map((id) => getMedia( id ) );

			if (!imgObj.some((el) => typeof el == 'undefined')){
				setAttributes( {
					imageSize,
					images: imgObj.map( ( image ) => pickRelevantMediaFiles( image, imageSize ) ),
				} );
			} else {
				alert(__('For self-hosted images only', 'getwid'));
			}

		};

		return (
			<InspectorControls>
				<PanelBody title={ __( 'Image Settings', 'getwid' ) } initialOpen={true}>
					<SelectControl
						label={__('Image Size', 'getwid')}
						help={__('For self-hosted images only', 'getwid')}
						value={imageSize}
						onChange={onChangeImageSize}
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
					<TextControl
						label={__('Slides to Show', 'getwid')}
						type={'number'}
						value={parseInt(sliderSlidesToShow, 10)}
						min={1}
						max={10}
						step={1}
						onChange={sliderSlidesToShow => setAttributes({sliderSlidesToShow: sliderSlidesToShow.toString()})}
					/>

					<TextControl
						disabled={(parseInt(sliderSlidesToShow, 10) > 1 ? null : true)}			
						label={__('Slides to Show (Laptop)', 'getwid')}
						type={'number'}
						value={parseInt(sliderSlidesToShowLaptop, 10)}
						min={1}
						max={10}
						step={1}
						onChange={sliderSlidesToShowLaptop => setAttributes({sliderSlidesToShowLaptop: sliderSlidesToShowLaptop.toString()})}
					/>
					<TextControl
						disabled={(parseInt(sliderSlidesToShow, 10) > 1 ? null : true)}
						label={__('Slides to Show (Tablet)', 'getwid')}
						type={'number'}
						value={parseInt(sliderSlidesToShowTablet, 10)}
						min={1}
						max={10}
						step={1}
						onChange={sliderSlidesToShowTablet => setAttributes({sliderSlidesToShowTablet: sliderSlidesToShowTablet.toString()})}
					/>
					<TextControl
						disabled={(parseInt(sliderSlidesToShow, 10) > 1 ? null : true)}
						label={__('Slides to Show (Mobile)', 'getwid')}
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
						label={ __( 'Autoplay', 'getwid' ) }
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
					{(parseInt(sliderSlidesToShow, 10) > 1) &&
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