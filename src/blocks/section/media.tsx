import type { SectionAttributes } from './types';

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

	return (
		<div
			className={ `${ baseClass }__background-slider` }
			data-autoplay="true"
			data-autoplay-speed={ sliderAnimationSpeed }
			data-slide-effect={ sliderAnimationEffect }
			data-slide-speed={ sliderAnimationDuration }
			data-infinite="true"
		>
			{ sliderImages.map( ( image ) => (
				<div
					className={ `${ baseClass }__background-slider-item` }
					key={ image.id || image.url }
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

export function BackgroundVideo( {
	attributes,
	baseClass,
}: SectionComponentProps ) {
	const {
		backgroundVideoUrl,
		backgroundVideoMute,
		backgroundVideoLoop,
		backgroundVideoAutoplay,
		backgroundVideoPoster,
	} = attributes;

	if ( ! backgroundVideoUrl?.url ) {
		return null;
	}

	return (
		<video
			className={ `${ baseClass }__background-video source-media-library` }
			playsInline
			autoPlay={ backgroundVideoAutoplay }
			muted={ backgroundVideoMute }
			loop={ backgroundVideoLoop }
			poster={ backgroundVideoPoster || undefined }
		>
			<source src={ backgroundVideoUrl.url } type="video/mp4" />
		</video>
	);
}
