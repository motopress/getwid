import {
	BlockControls,
	MediaPlaceholder,
	MediaUpload,
	URLInput,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Dashicon,
	TextControl,
	ToggleControl,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { useEffect, useMemo, useRef } from '@wordpress/element';
import { __, isRTL } from '@wordpress/i18n';
import clsx from 'clsx';
import jQuery from 'jquery';

import Inspector from './inspector';
import MediaContainer from './media-container';
import type { CoreSelect, ImagesSliderEditProps, SliderImage } from './types';
import {
	baseClass,
	defaultAttributes,
	getContainerClassName,
	pickRelevantMediaFile,
} from './utils';

import './editor.scss';
import './style.scss';
import { useMergeRefs, useRefEffect } from '@wordpress/compose';

const allowedMediaTypes = [ 'image' ];
const newTabRel = 'noreferrer noopener';

function normalizeImages(
	images: SliderImage[],
	imageSize: string,
	currentImages: SliderImage[]
) {
	return images.map( ( image ) =>
		pickRelevantMediaFile( image, imageSize, currentImages )
	);
}

export default function Edit( props: ImagesSliderEditProps ) {
	const { attributes, setAttributes, isSelected, className } = props;
	const {
		images,
		ids,
		imageSize,
		linkTo,
		sliderAnimationEffect,
		sliderSlidesToShow,
		sliderSlidesToScroll,
		sliderAutoplay,
		sliderAutoplaySpeed,
		sliderInfinite,
		sliderAnimationSpeed,
		sliderCenterMode,
		sliderVariableWidth,
		sliderArrows,
		sliderDots,
		slideHeight,
	} = attributes;
	const sliderRef = useRef< HTMLDivElement >( null );
	const imgObj = useSelect(
		( select ) => {
			const { getMediaItems } = select( 'core' ) as CoreSelect;

			if ( ids && ids.length > 0 ) {
				return (
					getMediaItems( {
						include: ids.join( ',' ),
						per_page: ids.length,
					} ) || []
				);
			}

			return [];
		},
		[ ids ]
	);

	function updateImages( nextImages: SliderImage[] ) {
		setAttributes( {
			images: nextImages,
			ids: nextImages.map( ( image ) => image.id ),
		} );
	}

	function onSelectImages( nextImages: SliderImage[] ) {
		let nextImageSize = imageSize;

		if (
			! [ 'full', 'large', 'medium', 'thumbnail' ].includes(
				nextImageSize
			)
		) {
			nextImageSize = defaultAttributes.imageSize;
			setAttributes( { imageSize: nextImageSize } );
		}

		updateImages( normalizeImages( nextImages, nextImageSize, images ) );
	}

	function setImageAttributes(
		index: number,
		nextAttributes: Partial< SliderImage >
	) {
		if ( ! images[ index ] ) {
			return;
		}

		updateImages( [
			...images.slice( 0, index ),
			{
				...images[ index ],
				...nextAttributes,
			},
			...images.slice( index + 1 ),
		] );
	}

	function onSetNewTab( value: boolean, index: number ) {
		const linkTarget = value ? '_blank' : undefined;
		let updatedRel = images[ index ].custom_link_rel;

		if ( linkTarget && ! images[ index ].custom_link_rel ) {
			updatedRel = newTabRel;
		} else if (
			! linkTarget &&
			images[ index ].custom_link_rel === newTabRel
		) {
			updatedRel = undefined;
		}

		setImageAttributes( index, {
			custom_link_target: linkTarget,
			custom_link_rel: updatedRel,
		} );
	}

	function destroySlider() {
		if ( ! sliderRef.current ) {
			return;
		}

		const sliderSelector = jQuery( sliderRef.current );

		if ( sliderSelector.hasClass( 'slick-initialized' ) ) {
			sliderSelector.slick( 'unslick' );
		}
	}

	function initSlider() {
		if ( ! sliderRef.current ) {
			return;
		}

		const sliderSelector = jQuery( sliderRef.current );

		if ( sliderSelector.length > 0 ) {
			sliderSelector.not( '.slick-initialized' ).slick?.( {
				arrows: sliderArrows !== 'none',
				dots: sliderDots !== 'none',
				fade: sliderAnimationEffect === 'fade',
				slidesToShow:
					sliderAnimationEffect === 'fade'
						? 1
						: parseInt( sliderSlidesToShow, 10 ),
				slidesToScroll: parseInt( sliderSlidesToScroll, 10 ),
				autoplaySpeed: parseInt( sliderAutoplaySpeed, 10 ),
				speed: parseInt( sliderAnimationSpeed, 10 ),
				infinite: linkTo !== 'custom' ? sliderInfinite : false,
				autoplay: sliderAutoplay,
				draggable: linkTo === 'custom' ? false : true,
				centerMode: sliderCenterMode,
				variableWidth: sliderVariableWidth,
				pauseOnHover: true,
				rows: 0,
				rtl: isRTL(),
			} );

			if ( slideHeight ) {
				jQuery( `.${ baseClass }__item`, sliderSelector ).css(
					'height',
					slideHeight
				);
			}
		}
	}

	useEffect( () => {
		initSlider();

		return destroySlider;
	}, [
		ids.join( ',' ),
		sliderArrows,
		sliderDots,
		sliderAnimationEffect,
		sliderSlidesToShow,
		sliderSlidesToScroll,
		sliderAutoplaySpeed,
		sliderAnimationSpeed,
		sliderInfinite,
		linkTo,
		sliderAutoplay,
		sliderCenterMode,
		sliderVariableWidth,
		slideHeight,
	] );

	const blockProps = useBlockProps( {
		className: getContainerClassName( attributes, className, isSelected ),
	} );
	const hasImages = !! images.length;
	const hasImagesWithId = hasImages && images.some( ( image ) => image.id );

	if ( ! hasImages ) {
		return (
			<>
				<div { ...blockProps }>
					<MediaPlaceholder
						icon="format-gallery"
						className={ baseClass }
						labels={ {
							title: __( 'Image Slider', 'getwid' ),
							instructions: __(
								'Drag images, upload new ones or select files from your library.',
								'getwid'
							),
						} }
						onSelect={ onSelectImages }
						accept="image/*"
						allowedTypes={ allowedMediaTypes }
						multiple
					/>
				</div>
			</>
		);
	}

	return (
		<>
			<div { ...blockProps }>
				<div ref={ sliderRef } className={ `${ baseClass }__wrapper` }>
					{ images.map( ( image, index ) => (
						<div key={ index } className={ `${ baseClass }__item` }>
							<MediaContainer image={ image } />
							{ linkTo === 'custom' && (
								<div
									className={ `${ baseClass }__url-field-wrapper` }
								>
									<div
										className={ `${ baseClass }__url-field-container` }
									>
										<Dashicon icon="admin-links" />
										<URLInput
											className={ clsx(
												`${ baseClass }__url-field`,
												'has-border'
											) }
											autoFocus
											value={ image.custom_link || '' }
											onChange={ ( customLink ) =>
												setImageAttributes( index, {
													custom_link: customLink,
												} )
											}
											disableSuggestions
											__nextHasNoMarginBottom
										/>
									</div>
									<div
										className={ `${ baseClass }__url-rel-container` }
									>
										<ToggleControl
											className={ `${ baseClass }__url-toggle` }
											label={ __( 'New Tab', 'getwid' ) }
											onChange={ ( value ) =>
												onSetNewTab( value, index )
											}
											checked={
												image.custom_link_target ===
												'_blank'
											}
										/>
										<TextControl
											className={ `${ baseClass }__url-rel` }
											placeholder={ __(
												'Link Rel',
												'getwid'
											) }
											value={
												image.custom_link_rel || ''
											}
											onChange={ ( customLinkRel ) =>
												setImageAttributes( index, {
													custom_link_rel:
														customLinkRel,
												} )
											}
										/>
									</div>
								</div>
							) }
						</div>
					) ) }
				</div>

				{ isSelected && (
					<MediaPlaceholder
						addToGallery={ hasImagesWithId }
						isAppender={ true }
						labels={ {
							title: '',
							instructions: '',
						} }
						onSelect={ onSelectImages }
						accept="image/*"
						allowedTypes={ allowedMediaTypes }
						multiple
						value={ hasImagesWithId ? images : undefined }
					/>
				) }
			</div>
			<BlockControls>
				{ !! images.length && (
					<ToolbarGroup>
						<MediaUpload
							onSelect={ onSelectImages }
							allowedTypes={ allowedMediaTypes }
							multiple
							gallery
							value={ images.map(
								( image ) => image.id || false
							) }
							render={ ( { open } ) => (
								<ToolbarButton
									label={ __( 'Edit Slider', 'getwid' ) }
									icon="edit"
									onClick={ open }
								/>
							) }
						/>
					</ToolbarGroup>
				) }
			</BlockControls>
			<Inspector { ...props } imgObj={ imgObj } />
		</>
	);
}
