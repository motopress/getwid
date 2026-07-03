import { InspectorControls } from '@wordpress/block-editor';
import {
	BaseControl,
	Button,
	PanelBody,
	RadioControl,
	RangeControl,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import {
	AnimationSelectControl,
	CustomColorPalette,
	Notice,
	PaddingsControl,
	StyleLengthControl,
	TabsControl,
} from 'getwid-components';
import { useState } from '@wordpress/element';

import type { MediaTextSliderEditProps } from './types';

type InspectorProps = MediaTextSliderEditProps & {
	addNewSlide: ( nextSlide: number ) => void;
	isLockedPaddings: boolean;
	onChangePaddingsLock: ( isLocked: boolean ) => void;
};

type TabName = 'general' | 'style' | 'advanced';

const imageSizeOptions =
	(
		window as Window & {
			Getwid?: {
				settings?: {
					image_sizes?: Array< { label: string; value: string } >;
				};
			};
		}
	 ).Getwid?.settings?.image_sizes ?? [];

export default function Inspector( {
	attributes,
	setAttributes,
	clientId,
	addNewSlide,
	isLockedPaddings,
	onChangePaddingsLock,
}: InspectorProps ) {
	const [ tabName, setTabName ] = useState< TabName >( 'general' );
	const block = useSelect(
		( select ) => select( 'core/block-editor' ).getBlock( clientId ),
		[ clientId ]
	);
	const {
		imageSize,
		slideCount,
		contentMaxWidth,
		minHeight,
		verticalAlign,
		horizontalAlign,
		textColor,
		overlayColor,
		overlayOpacity,
		contentAnimation,
		contentAnimationDuration,
		contentAnimationDelay,
		sliderAnimationEffect,
		sliderAutoplay,
		pauseOnHover,
		sliderAutoplaySpeed,
		sliderAnimationSpeed,
		sliderArrows,
		sliderDots,
	} = attributes;

	if ( ! block ) {
		return <InspectorControls />;
	}

	const hasSliderSettings =
		sliderAnimationEffect !== undefined ||
		sliderAutoplay !== false ||
		pauseOnHover !== true ||
		sliderAutoplaySpeed !== 5000 ||
		sliderAnimationSpeed !== 1000;
	const hasContentAnimation =
		contentAnimation !== 'fadeIn' ||
		contentAnimationDelay !== '0ms' ||
		contentAnimationDuration !== '1500ms';

	return (
		<InspectorControls>
			<TabsControl
				state={ tabName }
				onChangeTab={ ( nextTabName ) =>
					setTabName( nextTabName as TabName )
				}
				tabs={ [ 'general', 'style', 'advanced' ] }
			/>
			{ tabName === 'general' && (
				<>
					<PanelBody>
						<RangeControl
							label={ __( 'Number of slides', 'getwid' ) }
							value={ slideCount }
							onChange={ ( nextSlide ) =>
								addNewSlide( nextSlide ?? 1 )
							}
							min={ 1 }
							max={ 50 }
						/>
						<SelectControl
							label={ __( 'Image Size', 'getwid' ) }
							help={ __(
								'For images from Media Library only.',
								'getwid'
							) }
							value={ imageSize }
							onChange={ ( nextImageSize ) =>
								setAttributes( { imageSize: nextImageSize } )
							}
							options={ imageSizeOptions }
						/>
						<BaseControl
							label={ __( 'Slider Minimum Height', 'getwid' ) }
							__nextHasNoMarginBottom
						>
							<StyleLengthControl
								value={ minHeight }
								units={ [
									{ label: 'px', value: 'px' },
									{ label: 'vh', value: 'vh' },
									{ label: 'vw', value: 'vw' },
									{ label: '%', value: '%' },
								] }
								onChange={ ( nextMinHeight ) =>
									setAttributes( {
										minHeight: nextMinHeight,
									} )
								}
							/>
						</BaseControl>
						<RangeControl
							label={ __( 'Content Area Width', 'getwid' ) }
							value={ contentMaxWidth ?? 0 }
							onChange={ ( nextContentMaxWidth ) =>
								setAttributes( {
									contentMaxWidth:
										nextContentMaxWidth ?? undefined,
								} )
							}
							allowReset
							min={ 0 }
							max={ 2000 }
							step={ 1 }
						/>
						<SelectControl
							label={ __(
								'Content Area Vertical Alignment',
								'getwid'
							) }
							value={ verticalAlign ?? 'center' }
							onChange={ ( nextVerticalAlign ) =>
								setAttributes( {
									verticalAlign: nextVerticalAlign,
								} )
							}
							options={ [
								{ value: 'top', label: __( 'Top', 'getwid' ) },
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
						<SelectControl
							label={ __(
								'Content Area Horizontal Alignment',
								'getwid'
							) }
							value={ horizontalAlign ?? 'center' }
							onChange={ ( nextHorizontalAlign ) =>
								setAttributes( {
									horizontalAlign: nextHorizontalAlign,
								} )
							}
							options={ [
								{
									value: 'left',
									label: __( 'Left', 'getwid' ),
								},
								{
									value: 'center',
									label: __( 'Center', 'getwid' ),
								},
								{
									value: 'right',
									label: __( 'Right', 'getwid' ),
								},
							] }
						/>
					</PanelBody>
					<PanelBody
						title={ __( 'Slider Settings', 'getwid' ) }
						initialOpen={ false }
					>
						<Notice>
							{ __(
								'These options are applied on frontend only.',
								'getwid'
							) }
						</Notice>
						<RadioControl
							label={ __( 'Animation Effect', 'getwid' ) }
							selected={ sliderAnimationEffect ?? '' }
							options={ [
								{ value: '', label: __( 'Slide', 'getwid' ) },
								{
									value: 'fade',
									label: __( 'Fade', 'getwid' ),
								},
							] }
							onChange={ ( nextSliderAnimationEffect ) =>
								setAttributes( {
									sliderAnimationEffect:
										nextSliderAnimationEffect,
								} )
							}
						/>
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
								<ToggleControl
									label={ __( 'Pause On Hover', 'getwid' ) }
									help={ __(
										'Pause the slideshow when the mouse cursor is over a slider.',
										'getwid'
									) }
									checked={ pauseOnHover }
									onChange={ () =>
										setAttributes( {
											pauseOnHover: ! pauseOnHover,
										} )
									}
								/>
								<TextControl
									label={ __( 'Slideshow Speed', 'getwid' ) }
									type="number"
									value={ String(
										sliderAutoplaySpeed ?? ''
									) }
									min={ 0 }
									onChange={ ( nextSliderAutoplaySpeed ) =>
										setAttributes( {
											sliderAutoplaySpeed:
												nextSliderAutoplaySpeed,
										} )
									}
								/>
							</>
						) }
						<TextControl
							label={ __( 'Animation Speed', 'getwid' ) }
							type="number"
							value={ String( sliderAnimationSpeed ?? '' ) }
							min={ 0 }
							onChange={ ( nextSliderAnimationSpeed ) =>
								setAttributes( {
									sliderAnimationSpeed:
										nextSliderAnimationSpeed,
								} )
							}
						/>
						<BaseControl __nextHasNoMarginBottom>
							<Button
								variant="link"
								onClick={ () =>
									setAttributes( {
										sliderAnimationEffect: undefined,
										sliderAutoplay: false,
										pauseOnHover: true,
										sliderAutoplaySpeed: 5000,
										sliderAnimationSpeed: 1000,
									} )
								}
								disabled={ ! hasSliderSettings }
							>
								{ __( 'Reset', 'getwid' ) }
							</Button>
						</BaseControl>
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
			{ tabName === 'style' && (
				<>
					<PanelBody>
						<CustomColorPalette
							colorSettings={ [
								{
									title: __( 'Text Color', 'getwid' ),
									colors: { customColor: textColor },
									changeColor: ( nextTextColor ) =>
										setAttributes( {
											textColor: nextTextColor,
										} ),
								},
								{
									title: __( 'Overlay Color', 'getwid' ),
									colors: { customColor: overlayColor },
									changeColor: ( nextOverlayColor ) =>
										setAttributes( {
											overlayColor: nextOverlayColor,
										} ),
								},
							] }
						/>
						<RangeControl
							label={ __( 'Overlay Opacity', 'getwid' ) }
							value={ overlayOpacity ?? 0 }
							onChange={ ( nextOverlayOpacity ) =>
								setAttributes( {
									overlayOpacity: nextOverlayOpacity ?? 0,
								} )
							}
							min={ 0 }
							max={ 100 }
							step={ 1 }
						/>
					</PanelBody>
					<PanelBody
						title={ __( 'Padding', 'getwid' ) }
						initialOpen={ false }
					>
						<PaddingsControl
							attributes={ attributes }
							setAttributes={ setAttributes }
							isLocked={ isLockedPaddings }
							onChangeLock={ onChangePaddingsLock }
						/>
					</PanelBody>
				</>
			) }
			{ tabName === 'advanced' && (
				<PanelBody
					title={ __( 'Text Animation', 'getwid' ) }
					initialOpen
				>
					<AnimationSelectControl
						label={ __( 'Animation Effect', 'getwid' ) }
						allowAnimation={ [ 'Entrance', 'Seeker' ] }
						value={ contentAnimation ?? '' }
						onChange={ ( nextContentAnimation ) =>
							setAttributes( {
								contentAnimation: nextContentAnimation,
							} )
						}
					/>
					<SelectControl
						label={ __( 'Duration', 'getwid' ) }
						value={ contentAnimationDuration ?? '' }
						onChange={ ( nextContentAnimationDuration ) =>
							setAttributes( {
								contentAnimationDuration:
									nextContentAnimationDuration,
							} )
						}
						options={ [
							{
								value: '3000ms',
								label: __( 'Very Slow', 'getwid' ),
							},
							{ value: '2000ms', label: __( 'Slow', 'getwid' ) },
							{
								value: '1500ms',
								label: __( 'Normal', 'getwid' ),
							},
							{ value: '800ms', label: __( 'Fast', 'getwid' ) },
							{
								value: '400ms',
								label: __( 'Very Fast', 'getwid' ),
							},
						] }
					/>
					<TextControl
						label={ __( 'Delay, ms', 'getwid' ) }
						value={
							contentAnimationDelay?.replace( 'ms', '' ) ?? ''
						}
						type="number"
						min={ 0 }
						onChange={ ( nextContentAnimationDelay ) => {
							const parsed = parseInt(
								nextContentAnimationDelay,
								10
							);

							setAttributes( {
								contentAnimationDelay: Number.isNaN( parsed )
									? undefined
									: `${ parsed }ms`,
							} );
						} }
					/>
					<BaseControl __nextHasNoMarginBottom>
						<Button
							variant="link"
							onClick={ () =>
								setAttributes( {
									contentAnimation: 'fadeIn',
									contentAnimationDelay: '0ms',
									contentAnimationDuration: '1500ms',
								} )
							}
							disabled={ ! hasContentAnimation }
						>
							{ __( 'Reset', 'getwid' ) }
						</Button>
					</BaseControl>
				</PanelBody>
			) }
		</InspectorControls>
	);
}
