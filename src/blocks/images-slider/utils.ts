import clsx from 'clsx';

import type { ImagesSliderAttributes, SliderImage } from './types';

export const baseClass = 'wp-block-getwid-images-slider';

export const defaultAttributes = {
	imageSize: 'full',
	imageFit: 'fill',
	showCaption: false,
	captionStyle: 'light',
	captionPosition: 'bottom-center',
	linkTo: 'none',
	imageAlignment: 'center',
	sliderAnimationEffect: 'slide',
	sliderSlidesToShow: '1',
	sliderSlidesToShowLaptop: '1',
	sliderSlidesToShowTablet: '1',
	sliderSlidesToShowMobile: '1',
	sliderSlidesToScroll: '1',
	sliderAutoplay: false,
	sliderAutoplaySpeed: '6000',
	sliderPauseOnHover: false,
	sliderInfinite: true,
	sliderAnimationSpeed: '800',
	sliderCenterMode: false,
	sliderVariableWidth: false,
	sliderSpacing: 'none',
	sliderArrows: 'inside',
	sliderDots: 'inside',
};

export function getContainerClassName(
	attributes: ImagesSliderAttributes,
	className?: string,
	includeActive = false
) {
	const {
		showCaption,
		captionStyle,
		captionPosition,
		align,
		imageFit,
		imageAlignment,
		sliderSlidesToShow,
		sliderSpacing,
		sliderArrows,
		sliderDots,
		slideHeight,
	} = attributes;

	return clsx(
		className,
		`has-arrows-${ sliderArrows }`,
		`has-dots-${ sliderDots }`,
		{
			'has-captions': showCaption === true,
			[ `captions-style-${ captionStyle }` ]:
				showCaption === true && captionPosition !== 'underneath',
			[ `captions-${ captionPosition }` ]: showCaption === true,
			'is-carousel': Number( sliderSlidesToShow ) > 1,
			[ `has-slides-gap-${ sliderSpacing }` ]:
				Number( sliderSlidesToShow ) > 1,
			[ `has-images-${ imageAlignment }` ]: !! imageAlignment,
			'has-cropped-images': imageFit === 'fill',
			'has-fitted-images': imageFit === 'fit',
			'is-active': includeActive,
			'has-fixed-height': !! slideHeight,
		},
		align ? `align${ align }` : null
	);
}

export function getItemProps( attributes: ImagesSliderAttributes ) {
	const { slideHeight, resetHeightOnTablet, resetHeightOnMobile } =
		attributes;

	return {
		className: clsx( `${ baseClass }__item`, {
			'getwid-reset-height-tablet': resetHeightOnTablet,
			'getwid-reset-height-mobile': resetHeightOnMobile,
		} ),
		style: {
			height: slideHeight || undefined,
		},
	};
}

export function getSliderData( attributes: ImagesSliderAttributes ) {
	const {
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
		sliderArrows,
		sliderDots,
		sliderSpacing,
	} = attributes;

	return {
		'data-effect': sliderAnimationEffect,
		'data-slides-show': sliderSlidesToShow,
		'data-slides-show-laptop': sliderSlidesToShowLaptop,
		'data-slides-show-tablet': sliderSlidesToShowTablet,
		'data-slides-show-mobile': sliderSlidesToShowMobile,
		'data-slides-scroll': sliderSlidesToScroll,
		'data-autoplay': sliderAutoplay,
		'data-pause-hover': sliderPauseOnHover,
		'data-autoplay-speed': sliderAutoplaySpeed,
		'data-infinite': sliderInfinite,
		'data-animation-speed': sliderAnimationSpeed,
		'data-center-mode': sliderCenterMode,
		'data-variable-width': sliderVariableWidth,
		'data-arrows': sliderArrows,
		'data-dots': sliderDots,
		'data-spacing': sliderSpacing,
	};
}

export function getImageUrl( image: SliderImage, imageSize: string ) {
	return (
		image.media_details?.sizes?.[ imageSize ]?.source_url ||
		image.media_details?.sizes?.large?.source_url ||
		image.media_details?.sizes?.full?.source_url ||
		image.sizes?.[ imageSize ]?.url ||
		image.url ||
		image.source_url
	);
}

export function pickRelevantMediaFile(
	image: SliderImage,
	imageSize: string,
	currentImages: SliderImage[]
) {
	const previousImage = currentImages.find(
		( item ) => item.id && item.id === image.id
	);

	return {
		id: image.id,
		link: image.link,
		original_url: image.url || image.source_url,
		alt: image.alt || image.alt_text,
		url: getImageUrl( image, imageSize ),
		custom_link: previousImage?.custom_link,
		custom_link_target: previousImage?.custom_link_target,
		custom_link_rel: previousImage?.custom_link_rel,
		caption:
			typeof image.caption === 'string' ||
			typeof image.caption === 'undefined'
				? image.caption
				: image.caption.raw,
	};
}

export function getImageHref( image: SliderImage, linkTo: string ) {
	switch ( linkTo ) {
		case 'media':
			return image.original_url;
		case 'attachment':
			return image.link;
		case 'custom':
			return image.custom_link;
		default:
			return undefined;
	}
}
