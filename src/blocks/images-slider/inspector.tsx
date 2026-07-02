import { InspectorControls } from '@wordpress/block-editor';
import {
	BaseControl,
	Button,
	PanelBody,
	RadioControl,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { TabsControl } from 'getwid-components';

import SlideHeightControl from './slide-height-control';
import type { ImagesSliderEditProps, SliderImage } from './types';
import { defaultAttributes, pickRelevantMediaFile } from './utils';

type TabName = 'general' | 'advanced';

type InspectorProps = ImagesSliderEditProps & {
	imgObj: SliderImage[];
};

const imageSizeOptions =
	(
		window as unknown as {
			Getwid?: {
				settings?: {
					image_sizes?: Array< { value: string; label: string } >;
				};
			};
		}
	 ).Getwid?.settings?.image_sizes || [];

export default function Inspector( props: InspectorProps ) {
	const { attributes, setAttributes, imgObj } = props;
	const {
		images,
		imageSize,
		imageFit,
		showCaption,
		captionStyle,
		captionPosition,
		linkTo,
		imageAlignment,
		sliderAnimationEffect,
		sliderSlidesToShow,
		sliderSlidesToShowLaptop,
		sliderSlidesToShowTablet,
		sliderSlidesToShowMobile,
		sliderSlidesToScroll,
		sliderAutoplay,
		sliderPauseOnHover,
		sliderAutoplaySpeed,
		sliderInfinite,
		sliderAnimationSpeed,
		sliderCenterMode,
		sliderVariableWidth,
		sliderSpacing,
		sliderArrows,
		sliderDots,
	} = attributes;
	const [ tabName, setTabName ] = useState< TabName >( 'general' );
	const hasValidMediaItems = ! imgObj.some(
		( item ) => typeof item === 'undefined'
	);

	function updateImages( nextImages: SliderImage[] ) {
		setAttributes( {
			images: nextImages,
			ids: nextImages.map( ( image ) => image.id ),
		} );
	}

	function onChangeImageSize( nextImageSize: string ) {
		if ( hasValidMediaItems ) {
			setAttributes( {
				imageSize: nextImageSize,
				images: imgObj.map( ( image ) =>
					pickRelevantMediaFile( image, nextImageSize, images )
				),
				ids: imgObj.map( ( image ) => image.id ),
			} );
		}
	}

	function hasSliderSettings() {
		return (
			sliderSlidesToShow !== defaultAttributes.sliderSlidesToShow ||
			sliderSlidesToShowLaptop !==
				defaultAttributes.sliderSlidesToShowLaptop ||
			sliderSlidesToShowTablet !==
				defaultAttributes.sliderSlidesToShowTablet ||
			sliderSlidesToShowMobile !==
				defaultAttributes.sliderSlidesToShowMobile ||
			sliderSlidesToScroll !== defaultAttributes.sliderSlidesToScroll ||
			sliderAutoplay !== defaultAttributes.sliderAutoplay ||
			sliderAnimationEffect !== defaultAttributes.sliderAnimationEffect ||
			sliderAutoplaySpeed !== defaultAttributes.sliderAutoplaySpeed ||
			sliderInfinite !== defaultAttributes.sliderInfinite ||
			sliderAnimationSpeed !== defaultAttributes.sliderAnimationSpeed ||
			sliderCenterMode !== defaultAttributes.sliderCenterMode ||
			sliderVariableWidth !== defaultAttributes.sliderVariableWidth ||
			sliderSpacing !== defaultAttributes.sliderSpacing
		);
	}

	function resetSliderSettings() {
		setAttributes( {
			sliderSlidesToShow: defaultAttributes.sliderSlidesToShow,
			sliderSlidesToShowLaptop:
				defaultAttributes.sliderSlidesToShowLaptop,
			sliderSlidesToShowTablet:
				defaultAttributes.sliderSlidesToShowTablet,
			sliderSlidesToShowMobile:
				defaultAttributes.sliderSlidesToShowMobile,
			sliderSlidesToScroll: defaultAttributes.sliderSlidesToScroll,
			sliderAutoplay: defaultAttributes.sliderAutoplay,
			sliderAnimationEffect: defaultAttributes.sliderAnimationEffect,
			sliderAutoplaySpeed: defaultAttributes.sliderAutoplaySpeed,
			sliderInfinite: defaultAttributes.sliderInfinite,
			sliderAnimationSpeed: defaultAttributes.sliderAnimationSpeed,
			sliderCenterMode: defaultAttributes.sliderCenterMode,
			sliderVariableWidth: defaultAttributes.sliderVariableWidth,
			sliderSpacing: defaultAttributes.sliderSpacing,
		} );
	}

	return (
		<InspectorControls>
			<TabsControl
				state={ tabName }
				onChangeTab={ ( nextTabName ) =>
					setTabName( nextTabName as TabName )
				}
				tabs={ [ 'general', 'advanced' ] }
			/>

			{ tabName === 'general' && (
				<PanelBody initialOpen>
					{ imgObj.length !== 0 && (
						<SelectControl
							label={ __( 'Image Size', 'getwid' ) }
							help={ __(
								'For images from Media Library only.',
								'getwid'
							) }
							value={ imageSize }
							onChange={ onChangeImageSize }
							options={ imageSizeOptions }
						/>
					) }
					<SelectControl
						label={ __( 'Image Fit', 'getwid' ) }
						value={ imageFit }
						onChange={ ( nextImageFit ) => {
							setAttributes( { imageFit: nextImageFit } );

							if (
								nextImageFit !== 'default' &&
								captionPosition === 'underneath'
							) {
								setAttributes( {
									captionPosition: 'bottom-center',
								} );
							}
						} }
						options={ [
							{
								value: 'default',
								label: __( 'Default', 'getwid' ),
							},
							{ value: 'fill', label: __( 'Fill', 'getwid' ) },
							{ value: 'fit', label: __( 'Fit', 'getwid' ) },
						] }
					/>
					<ToggleControl
						label={ __( 'Show Caption', 'getwid' ) }
						checked={ showCaption }
						onChange={ () => {
							if ( hasValidMediaItems ) {
								updateImages(
									imgObj.map( ( image ) =>
										pickRelevantMediaFile(
											image,
											imageSize,
											images
										)
									)
								);
								setAttributes( {
									showCaption: ! showCaption,
								} );
							}
						} }
					/>
					{ showCaption && (
						<>
							{ captionPosition !== 'underneath' && (
								<SelectControl
									label={ __( 'Caption Style', 'getwid' ) }
									value={ captionStyle }
									onChange={ ( nextCaptionStyle ) =>
										setAttributes( {
											captionStyle: nextCaptionStyle,
										} )
									}
									options={ [
										{
											value: 'light',
											label: __( 'Light', 'getwid' ),
										},
										{
											value: 'dark',
											label: __( 'Dark', 'getwid' ),
										},
									] }
								/>
							) }
							<SelectControl
								label={ __( 'Caption Position', 'getwid' ) }
								value={ captionPosition || '' }
								onChange={ ( nextCaptionPosition ) =>
									setAttributes( {
										captionPosition: nextCaptionPosition,
									} )
								}
								options={ [
									{
										value: 'top-left',
										label: __( 'Top Left', 'getwid' ),
									},
									{
										value: 'top-center',
										label: __( 'Top Center', 'getwid' ),
									},
									{
										value: 'top-right',
										label: __( 'Top Right', 'getwid' ),
									},
									{
										value: 'bottom-left',
										label: __( 'Bottom Left', 'getwid' ),
									},
									{
										value: 'bottom-center',
										label: __( 'Bottom Center', 'getwid' ),
									},
									{
										value: 'bottom-right',
										label: __( 'Bottom Right', 'getwid' ),
									},
									{
										value: 'underneath',
										label: __( 'Underneath', 'getwid' ),
										disabled: imageFit !== 'default',
									},
								] }
							/>
						</>
					) }
					<SelectControl
						label={ __( 'Link to', 'getwid' ) }
						value={ linkTo }
						onChange={ ( nextLinkTo ) =>
							setAttributes( { linkTo: nextLinkTo } )
						}
						options={ [
							{ value: 'none', label: __( 'None', 'getwid' ) },
							{
								value: 'attachment',
								label: __( 'Attachment Page', 'getwid' ),
							},
							{
								value: 'media',
								label: __( 'Media File', 'getwid' ),
							},
							{
								value: 'custom',
								label: __( 'Custom link per slide', 'getwid' ),
							},
						] }
					/>
					<SlideHeightControl { ...props } />
					<ToggleControl
						label={ __( 'Enable Slideshow', 'getwid' ) }
						help={ __(
							'Slideshow plays automatically.',
							'getwid'
						) }
						checked={ sliderAutoplay }
						onChange={ () =>
							setAttributes( {
								sliderAutoplay: ! sliderAutoplay,
							} )
						}
					/>
					{ sliderAutoplay && (
						<>
							<TextControl
								label={ __( 'Slideshow Speed', 'getwid' ) }
								type="number"
								value={ sliderAutoplaySpeed }
								min={ 0 }
								onChange={ ( nextSliderAutoplaySpeed ) =>
									setAttributes( {
										sliderAutoplaySpeed:
											nextSliderAutoplaySpeed,
									} )
								}
							/>
							<ToggleControl
								label={ __( 'Pause On Hover', 'getwid' ) }
								help={ __(
									'Pause the slideshow when the mouse cursor is over a slider.',
									'getwid'
								) }
								checked={ sliderPauseOnHover }
								onChange={ () =>
									setAttributes( {
										sliderPauseOnHover:
											! sliderPauseOnHover,
									} )
								}
							/>
						</>
					) }
					<RadioControl
						label={ __( 'Animation Effect', 'getwid' ) }
						selected={ sliderAnimationEffect }
						options={ [
							{ value: 'slide', label: __( 'Slide', 'getwid' ) },
							{ value: 'fade', label: __( 'Fade', 'getwid' ) },
						] }
						onChange={ ( nextSliderAnimationEffect ) => {
							if ( nextSliderAnimationEffect === 'fade' ) {
								setAttributes( {
									sliderAnimationEffect: 'fade',
									sliderSlidesToShow: '1',
									sliderSlidesToShowLaptop: '1',
									sliderSlidesToShowTablet: '1',
									sliderSlidesToShowMobile: '1',
								} );
							} else {
								setAttributes( {
									sliderAnimationEffect:
										nextSliderAnimationEffect,
								} );
							}
						} }
					/>
					<ToggleControl
						label={ __( 'Infinite', 'getwid' ) }
						help={ __( 'Slideshow plays on repeat.', 'getwid' ) }
						checked={ sliderInfinite }
						onChange={ () =>
							setAttributes( {
								sliderInfinite: ! sliderInfinite,
							} )
						}
					/>
					<TextControl
						label={ __( 'Animation Speed', 'getwid' ) }
						type="number"
						value={ sliderAnimationSpeed }
						min={ 0 }
						onChange={ ( nextSliderAnimationSpeed ) =>
							setAttributes( {
								sliderAnimationSpeed: nextSliderAnimationSpeed,
							} )
						}
					/>
				</PanelBody>
			) }

			{ tabName === 'advanced' && (
				<>
					<PanelBody
						title={ __( 'Slider Settings', 'getwid' ) }
						initialOpen
					>
						<TextControl
							disabled={ sliderAnimationEffect === 'fade' }
							label={ __( 'Slides on Desktop', 'getwid' ) }
							help={ __(
								'Works with the Slide effect only. Specifies the number of slides displayed at once. Applies to screens wider than 991 pixels.',
								'getwid'
							) }
							type="number"
							value={ parseInt( sliderSlidesToShow, 10 ) }
							min={ 1 }
							max={ 10 }
							step={ 1 }
							onChange={ ( value ) =>
								setAttributes( {
									sliderSlidesToShow: value.toString(),
								} )
							}
						/>
						<TextControl
							disabled={ parseInt( sliderSlidesToShow, 10 ) <= 1 }
							label={ __( 'Slides on Laptop', 'getwid' ) }
							help={ __(
								'Applies to screens between 768 and 991 pixels wide.',
								'getwid'
							) }
							type="number"
							value={ parseInt( sliderSlidesToShowLaptop, 10 ) }
							min={ 1 }
							max={ 10 }
							step={ 1 }
							onChange={ ( value ) =>
								setAttributes( {
									sliderSlidesToShowLaptop: value.toString(),
								} )
							}
						/>
						<TextControl
							disabled={ parseInt( sliderSlidesToShow, 10 ) <= 1 }
							label={ __( 'Slides on Tablet', 'getwid' ) }
							help={ __(
								'Applies to screens between 468 and 768 pixels wide.',
								'getwid'
							) }
							type="number"
							value={ parseInt( sliderSlidesToShowTablet, 10 ) }
							min={ 1 }
							max={ 10 }
							step={ 1 }
							onChange={ ( value ) =>
								setAttributes( {
									sliderSlidesToShowTablet: value.toString(),
								} )
							}
						/>
						<TextControl
							disabled={ parseInt( sliderSlidesToShow, 10 ) <= 1 }
							label={ __( 'Slides on Mobile', 'getwid' ) }
							help={ __(
								'Applies to screens up to 468 pixels wide.',
								'getwid'
							) }
							type="number"
							value={ parseInt( sliderSlidesToShowMobile, 10 ) }
							min={ 1 }
							max={ 10 }
							step={ 1 }
							onChange={ ( value ) =>
								setAttributes( {
									sliderSlidesToShowMobile: value.toString(),
								} )
							}
						/>
						<TextControl
							disabled={ parseInt( sliderSlidesToShow, 10 ) <= 1 }
							label={ __(
								'Slides to Scroll on Desktop',
								'getwid'
							) }
							help={ __(
								'Specifies the number of slides that will scroll at once. Applies to screens wider than 991 pixels.',
								'getwid'
							) }
							type="number"
							value={ parseInt( sliderSlidesToScroll, 10 ) }
							min={ 1 }
							max={ 10 }
							step={ 1 }
							onChange={ ( value ) =>
								setAttributes( {
									sliderSlidesToScroll: value.toString(),
								} )
							}
						/>
						{ imageFit === 'default' && images.length > 1 && (
							<SelectControl
								label={ __( 'Image Alignment', 'getwid' ) }
								value={ imageAlignment }
								onChange={ ( nextImageAlignment ) =>
									setAttributes( {
										imageAlignment: nextImageAlignment,
									} )
								}
								options={ [
									{
										value: 'top',
										label: __( 'Top', 'getwid' ),
									},
									{
										value: 'center',
										label: __( 'Middle', 'getwid' ),
									},
									{
										value: 'bottom',
										label: __( 'Bottom', 'getwid' ),
									},
								] }
							/>
						) }
						<ToggleControl
							label={ __( 'Center Mode', 'getwid' ) }
							help={ __(
								'Displays slides centered, with partial previews of the previous and next slides. Use with odd numbered "Slides on …" slides.',
								'getwid'
							) }
							checked={ sliderCenterMode }
							onChange={ () =>
								setAttributes( {
									sliderCenterMode: ! sliderCenterMode,
								} )
							}
						/>
						<ToggleControl
							label={ __( 'Variable Width', 'getwid' ) }
							help={ __(
								'Allows slides to have different widths.',
								'getwid'
							) }
							checked={ sliderVariableWidth }
							onChange={ () =>
								setAttributes( {
									sliderVariableWidth: ! sliderVariableWidth,
								} )
							}
						/>
						{ parseInt( sliderSlidesToShow, 10 ) > 1 && (
							<SelectControl
								label={ __( 'Spacing', 'getwid' ) }
								value={ sliderSpacing }
								onChange={ ( nextSliderSpacing ) =>
									setAttributes( {
										sliderSpacing: nextSliderSpacing,
									} )
								}
								options={ [
									{
										value: 'none',
										label: __( 'None', 'getwid' ),
									},
									{
										value: 'small',
										label: __( 'Small', 'getwid' ),
									},
									{
										value: 'normal',
										label: __( 'Medium', 'getwid' ),
									},
									{
										value: 'large',
										label: __( 'Large', 'getwid' ),
									},
									{
										value: 'huge',
										label: __( 'Huge', 'getwid' ),
									},
								] }
							/>
						) }
						<BaseControl>
							<Button
								variant="link"
								onClick={ resetSliderSettings }
								disabled={ ! hasSliderSettings() }
							>
								{ __( 'Reset All', 'getwid' ) }
							</Button>
						</BaseControl>
					</PanelBody>
					<PanelBody
						title={ __( 'Controls Settings', 'getwid' ) }
						initialOpen={ false }
					>
						<RadioControl
							label={ __( 'Arrows', 'getwid' ) }
							selected={ sliderArrows }
							options={ [
								{
									value: 'outside',
									label: __( 'Outside', 'getwid' ),
								},
								{
									value: 'inside',
									label: __( 'Inside', 'getwid' ),
								},
								{
									value: 'none',
									label: __( 'None', 'getwid' ),
								},
							] }
							onChange={ ( nextSliderArrows ) =>
								setAttributes( {
									sliderArrows: nextSliderArrows,
								} )
							}
						/>
						<RadioControl
							label={ __( 'Dots', 'getwid' ) }
							selected={ sliderDots }
							options={ [
								{
									value: 'outside',
									label: __( 'Outside', 'getwid' ),
								},
								{
									value: 'inside',
									label: __( 'Inside', 'getwid' ),
								},
								{
									value: 'none',
									label: __( 'None', 'getwid' ),
								},
							] }
							onChange={ ( nextSliderDots ) =>
								setAttributes( { sliderDots: nextSliderDots } )
							}
						/>
					</PanelBody>
				</>
			) }
		</InspectorControls>
	);
}
