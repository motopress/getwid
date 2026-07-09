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
import { Fragment } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { CustomQueryControl, TemplateSelectControl } from 'getwid-components';

import type { PostCarouselEditProps } from './types';
import { ServerSideRender } from '@wordpress/server-side-render';

const defaults = {
	sliderSlidesToShowDesktop: '2',
	sliderSlidesToShowLaptop: '1',
	sliderSlidesToShowTablet: '1',
	sliderSlidesToShowMobile: '1',
	sliderSlidesToScroll: '1',
	sliderAutoplay: false,
	sliderAutoplaySpeed: '6000',
	sliderInfinite: true,
	sliderAnimationSpeed: '800',
	sliderCenterMode: false,
	sliderSpacing: 'small',
};

export default function Inspector( {
	attributes,
	setAttributes,
}: PostCarouselEditProps ) {
	const {
		postTemplate,
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
		metaQuery,
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
	} = attributes;
	const hasSliderSettings =
		sliderSlidesToShowDesktop !== defaults.sliderSlidesToShowDesktop ||
		sliderSlidesToShowLaptop !== defaults.sliderSlidesToShowLaptop ||
		sliderSlidesToShowTablet !== defaults.sliderSlidesToShowTablet ||
		sliderSlidesToShowMobile !== defaults.sliderSlidesToShowMobile ||
		sliderSlidesToScroll !== defaults.sliderSlidesToScroll ||
		sliderAutoplay !== defaults.sliderAutoplay ||
		sliderAutoplaySpeed !== defaults.sliderAutoplaySpeed ||
		sliderInfinite !== defaults.sliderInfinite ||
		sliderAnimationSpeed !== defaults.sliderAnimationSpeed ||
		sliderCenterMode !== defaults.sliderCenterMode ||
		sliderSpacing !== defaults.sliderSpacing;
	const desktopSlides = parseInt( sliderSlidesToShowDesktop, 10 );
	const hasMultipleDesktopSlides = desktopSlides > 1;

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Content Settings', 'getwid' ) } initialOpen>
				<CustomQueryControl
					setValues={ setAttributes }
					options={ [ 'sticky', 'parentFilter' ] }
					values={ {
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
						metaQuery,
					} }
					onChangeCallback={ () => undefined }
				/>
			</PanelBody>
			<PanelBody
				title={ __( 'Display Settings', 'getwid' ) }
				initialOpen={ false }
			>
				<TemplateSelectControl
					selectedTemplate={ postTemplate }
					onSelect={ ( templateID ) =>
						setAttributes( { postTemplate: templateID } )
					}
					previewRender={ ( templateID ) => (
						<ServerSideRender
							block="getwid/post-carousel"
							attributes={ {
								...attributes,
								postTemplate: String( templateID ),
							} }
						/>
					) }
				/>
				<TextControl
					label={ __( 'Slides on Desktop', 'getwid' ) }
					help={ __(
						'Works with the Slide effect only. Specifies the number of slides displayed at once. Applies to screens wider than 991 pixels.',
						'getwid'
					) }
					type="number"
					value={ sliderSlidesToShowDesktop }
					onChange={ ( value ) =>
						setAttributes( {
							sliderSlidesToShowDesktop: value.toString(),
						} )
					}
					min={ 1 }
					max={ 10 }
					step={ 1 }
				/>
				<TextControl
					disabled={ ! hasMultipleDesktopSlides }
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
					disabled={ ! hasMultipleDesktopSlides }
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
					disabled={ ! hasMultipleDesktopSlides }
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
					disabled={ ! hasMultipleDesktopSlides }
					label={ __( 'Slides to Scroll', 'getwid' ) }
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
				<ToggleControl
					label={ __( 'Enable Slideshow', 'getwid' ) }
					help={ __( 'Slideshow plays automatically.', 'getwid' ) }
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
							value={ String( sliderAutoplaySpeed ) }
							min={ 0 }
							onChange={ ( value ) =>
								setAttributes( {
									sliderAutoplaySpeed: value,
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
									sliderPauseOnHover: ! sliderPauseOnHover,
								} )
							}
						/>
					</>
				) }
				<ToggleControl
					label={ __( 'Infinite', 'getwid' ) }
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
					value={ String( sliderAnimationSpeed ) }
					min={ 0 }
					onChange={ ( value ) =>
						setAttributes( {
							sliderAnimationSpeed: value,
						} )
					}
				/>
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
				{ hasMultipleDesktopSlides && (
					<SelectControl
						label={ __( 'Spacing', 'getwid' ) }
						value={ sliderSpacing }
						onChange={ ( value ) =>
							setAttributes( { sliderSpacing: value } )
						}
						options={ [
							{ value: 'none', label: __( 'None', 'getwid' ) },
							{ value: 'small', label: __( 'Small', 'getwid' ) },
							{
								value: 'normal',
								label: __( 'Medium', 'getwid' ),
							},
							{ value: 'large', label: __( 'Large', 'getwid' ) },
							{ value: 'huge', label: __( 'Huge', 'getwid' ) },
						] }
					/>
				) }
				<BaseControl __nextHasNoMarginBottom>
					<Button
						variant="link"
						onClick={ () => setAttributes( defaults ) }
						disabled={ ! hasSliderSettings }
					>
						{ __( 'Reset', 'getwid' ) }
					</Button>
				</BaseControl>
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
							{ value: 'none', label: __( 'None', 'getwid' ) },
						] }
						onChange={ ( value ) =>
							setAttributes( { sliderArrows: value } )
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
							{ value: 'none', label: __( 'None', 'getwid' ) },
						] }
						onChange={ ( value ) =>
							setAttributes( { sliderDots: value } )
						}
					/>
				</PanelBody>
			</PanelBody>
		</InspectorControls>
	);
}
