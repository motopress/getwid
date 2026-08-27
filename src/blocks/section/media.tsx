import type { SectionAttributes } from './types';
import jQuery from 'jquery';
import { isRTL } from '@wordpress/i18n';
import { useRefEffect } from '@wordpress/compose';
import clsx from 'clsx';
import { forwardRef } from '@wordpress/element';

type SectionComponentProps = {
	attributes: SectionAttributes;
	baseClass: string;
};

export function BackgroundSlider( {
	attributes,
	baseClass,
}: SectionComponentProps ) {
	const {
		sliderImages = [],
		sliderAnimationEffect,
		sliderAnimationDuration,
		sliderAnimationSpeed,
	} = attributes;

	function destroySlider( slider: HTMLDivElement ) {
		const sliderEl = jQuery( slider );

		if ( sliderEl.length === 0 ) {
			return;
		}

		if ( sliderEl.hasClass( 'slick-initialized' ) ) {
			sliderEl.slick( 'unslick' );
		}
	}

	function initSlider( slider: HTMLDivElement ) {
		const sliderEl = jQuery( slider );

		if ( sliderEl.length === 0 ) {
			return;
		}

		sliderEl.slick( {
			rows: 0,
			slidesToShow: 1,
			slidesToScroll: 1,

			autoplay: true,
			infinite: true,

			arrows: false,
			dots: false,

			fade: sliderAnimationEffect === 'fade',

			autoplaySpeed: sliderAnimationSpeed
				? parseInt( sliderAnimationSpeed )
				: 100,
			speed: sliderAnimationDuration
				? parseInt( sliderAnimationDuration )
				: 100,

			rtl: isRTL(),
		} );
	}

	const sliderRef = useRefEffect(
		( node ) => {
			const sliderEl = node as HTMLDivElement;
			initSlider( sliderEl );
			return () => {
				destroySlider( sliderEl );
			};
		},
		[
			sliderAnimationEffect,
			sliderAnimationDuration,
			sliderAnimationSpeed,
			sliderImages,
		]
	);

	return (
		<div
			ref={ sliderRef }
			className={ `${ baseClass }__background-slider` }
			data-autoplay="true"
			data-autoplay-speed={ sliderAnimationSpeed }
			data-slide-effect={ sliderAnimationEffect }
			data-slide-speed={ sliderAnimationDuration }
			data-infinite="true"
		>
			{ sliderImages.map( ( image, index ) => (
				<div
					className={ `${ baseClass }__background-slider-item` }
					key={ index }
				>
					<img
						src={ image.url }
						className={
							image.id ? `wp-image-${ image.id }` : undefined
						}
						alt={ image.alt }
						data-id={ image.id }
					/>
				</div>
			) ) }
		</div>
	);
}

export const BackgroundVideo = forwardRef<
	HTMLVideoElement,
	SectionComponentProps & { onEnded: () => void }
>( function Video(
	{
		attributes,
		baseClass,
		onEnded,
	}: SectionComponentProps & { onEnded: () => void },
	ref
) {
	const { backgroundVideoUrl, backgroundVideoLoop, backgroundVideoPoster } =
		attributes;

	if ( ! backgroundVideoUrl?.url ) {
		return null;
	}

	return (
		<video
			ref={ ref }
			className={ `${ baseClass }__background-video source-media-library` }
			playsInline
			muted={ false }
			loop={ backgroundVideoLoop }
			poster={ backgroundVideoPoster || undefined }
			onEnded={ onEnded }
		>
			<source src={ backgroundVideoUrl.url } type="video/mp4" />
		</video>
	);
} );

export function BackgroundYouTubeVideo( {
	attributes,
	baseClass,
}: SectionComponentProps ) {
	const { youTubeVideoUrl, youTubeVideoScale } = attributes;

	const videoId = getYouTubeID( youTubeVideoUrl || '' );
	const thumbnailURL = `https://img.youtube.com/vi/${ videoId }/maxresdefault.jpg`;

	function getYouTubeID( url: string ) {
		const expr =
			/(?:https?:\/\/)?(?:www\.)?(?:youtube(?:-nocookie)?\.com\/\S*(?:(?:\/e(?:mbed))?\/v?|(?:watch\?)?(?:\S*?&?vi?\=))|youtu\.be\/)([a-zA-Z0-9_-]{6,11})/;
		return url.match( expr ) ? RegExp.$1 : false;
	}

	return (
		<div
			className={ clsx(
				`${ baseClass }__background-video`,
				'source-youtube',
				{
					[ `scale-youtube-${ youTubeVideoScale }` ]:
						!! youTubeVideoScale,
				}
			) }
		>
			<div className={ `${ baseClass }__background-video-youtube` }>
				<img src={ thumbnailURL } alt="" />
			</div>
		</div>
	);
}
