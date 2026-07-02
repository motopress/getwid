import {
	BlockAlignmentToolbar,
	BlockControls,
	BlockIcon,
	DropZone,
	MediaPlaceholder,
	MediaUpload,
	URLInput,
	store as blockEditorStore,
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
import { useEffect, useRef } from '@wordpress/element';
import { __, isRTL } from '@wordpress/i18n';
import clsx from 'clsx';
import jQuery from 'jquery';

import ImagesSliderIcon from './icon';
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

const alignmentsList = [ 'wide', 'full' ];
const allowedMediaTypes = [ 'image' ];
const newTabRel = 'noreferrer noopener';

type ImagesLoadedInstance = {
	elements: HTMLElement[];
};

type ImagesLoadedChain = {
	done: ( callback: ( instance: ImagesLoadedInstance ) => void ) => void;
};

type SliderElement = JQuery< HTMLElement > & {
	imagesLoaded?: () => ImagesLoadedChain;
	slick?: ( actionOrOptions?: string | SliderOptions ) => SliderElement;
};

type SliderOptions = {
	arrows: boolean;
	dots: boolean;
	fade: boolean;
	slidesToShow: number;
	slidesToScroll: number;
	autoplaySpeed: number;
	speed: number;
	infinite: boolean;
	autoplay: boolean;
	draggable: boolean;
	centerMode: boolean;
	variableWidth: boolean;
	pauseOnHover: boolean;
	rows: number;
	rtl: boolean;
};

type MediaUploadFunction = ( options: {
	allowedTypes: string[];
	filesList: FileList;
	onFileChange: ( images: SliderImage[] ) => void;
} ) => void;

type BlockEditorSelect = {
	getSettings: () => {
		mediaUpload?: MediaUploadFunction;
	};
};

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
		align,
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
	const uploadMedia = useSelect( ( select ) => {
		const { getSettings } = select( blockEditorStore ) as BlockEditorSelect;

		return getSettings().mediaUpload;
	}, [] );

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

	function addFiles( files: FileList ) {
		let nextImageSize = imageSize;
		const currentImages = images || [];

		if (
			! [ 'full', 'large', 'medium', 'thumbnail' ].includes(
				nextImageSize
			)
		) {
			nextImageSize = defaultAttributes.imageSize;
			setAttributes( { imageSize: nextImageSize } );
		}

		uploadMedia?.( {
			allowedTypes: allowedMediaTypes,
			filesList: files,
			onFileChange: ( nextImages: SliderImage[] ) => {
				updateImages(
					currentImages.concat(
						normalizeImages(
							nextImages,
							nextImageSize,
							currentImages
						)
					)
				);
			},
		} );
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
		const thisBlock = jQuery( sliderRef.current );
		const sliderSelector = jQuery(
			`.${ baseClass }__wrapper`,
			thisBlock
		) as SliderElement;

		if ( sliderSelector.hasClass( 'slick-initialized' ) ) {
			sliderSelector.slick?.( 'unslick' );
		}
	}

	function initSlider() {
		const thisBlock = jQuery( sliderRef.current );
		const sliderSelector = jQuery(
			`.${ baseClass }__wrapper`,
			thisBlock
		) as SliderElement;

		if ( sliderSelector.length && sliderSelector.imagesLoaded ) {
			sliderSelector.imagesLoaded().done( () => {
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
					jQuery( `.${ baseClass }__item`, thisBlock ).css(
						'height',
						slideHeight
					);
				}
			} );
		}
	}

	useEffect( () => {
		if ( images.length ) {
			initSlider();
		}

		return destroySlider;
	} );

	const blockProps = useBlockProps( {
		className: getContainerClassName( attributes, className, isSelected ),
	} );
	const hasImages = !! images.length;
	const hasImagesWithId = hasImages && images.some( ( image ) => image.id );

	if ( images.length === 0 ) {
		return (
			<>
				<BlockControls>
					<BlockAlignmentToolbar
						controls={ alignmentsList }
						value={ align }
						onChange={ ( nextAlign ) =>
							setAttributes( { align: nextAlign } )
						}
					/>
				</BlockControls>
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
			</>
		);
	}

	return (
		<>
			<div { ...blockProps } ref={ sliderRef }>
				<DropZone onFilesDrop={ addFiles } />
				<div className={ `${ baseClass }__wrapper` }>
					{ images.map( ( image, index ) => (
						<div
							key={ image.id || image.url }
							className={ `${ baseClass }__item` }
						>
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
						isAppender={ hasImages }
						className="components-form-file-upload"
						disableMediaButtons={ hasImages && ! isSelected }
						icon={
							! hasImages && (
								<BlockIcon icon={ <ImagesSliderIcon /> } />
							)
						}
						labels={ {
							title: ! hasImages
								? __( 'Gallery', 'getwid' )
								: undefined,
							instructions: ! hasImages
								? __(
										'Drag images, upload new ones or select files from your library.',
										'getwid'
								  )
								: undefined,
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
				<BlockAlignmentToolbar
					controls={ alignmentsList }
					value={ align }
					onChange={ ( nextAlign ) =>
						setAttributes( { align: nextAlign } )
					}
				/>
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
