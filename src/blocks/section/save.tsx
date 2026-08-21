import {
	getColorClassName,
	InnerBlocks,
	useBlockProps,
} from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import clsx from 'clsx';
import type { CSSProperties } from 'react';

import { baseClass } from './constants';
import Dividers from './dividers';
import {
	prepareBackgroundImageStyles,
	prepareGradientStyle,
} from './style-utils';
import type { SectionAttributes } from './types';

export default function Save( {
	attributes,
}: BlockSaveProps< SectionAttributes > ) {
	const {
		align,
		paddingTopValue,
		paddingBottomValue,
		paddingLeftValue,
		paddingRightValue,
		marginTopValue,
		marginBottomValue,
		marginLeftValue,
		marginRightValue,
		backgroundImage,
		sliderImages,
		backgroundVideoType,
		backgroundVideoAutoplay,
		backgroundVideoLoop,
		backgroundVideoMute,
		backgroundVideoPoster,
		youTubeVideoScale,
		youTubeVideoUrl,
		youTubeVideoMute,
		youTubeVideoLoop,
		youTubeVideoAutoplay,
		backgroundVideoUrl,
		backgroundVideoControlsPosition,
		foregroundOpacity,
		foregroundColor,
		foregroundFilter,
		dividersBringTop,
		contentMaxWidth,
		contentMaxWidthPreset,
		minHeight,
		gapSize,
		entranceAnimation,
		entranceAnimationDuration,
		entranceAnimationDelay,
		backgroundColor,
		customBackgroundColor,
		resetMinHeightTablet,
		resetMinHeightMobile,
		verticalAlign,
		verticalAlignTablet,
		verticalAlignMobile,
		horizontalAlign,
		horizontalAlignTablet,
		horizontalAlignMobile,
		paddingTop,
		paddingRight,
		paddingBottom,
		paddingLeft,
		paddingTopTablet,
		paddingRightTablet,
		paddingBottomTablet,
		paddingLeftTablet,
		paddingTopMobile,
		paddingRightMobile,
		paddingBottomMobile,
		paddingLeftMobile,
		marginTop,
		marginRight,
		marginBottom,
		marginLeft,
		marginTopTablet,
		marginRightTablet,
		marginBottomTablet,
		marginLeftTablet,
		marginTopMobile,
		marginRightMobile,
		marginBottomMobile,
		marginLeftMobile,
		anchor,
	} = attributes;
	const sectionStyle: CSSProperties = {
		...( marginTop === 'custom' ? { marginTop: marginTopValue } : {} ),
		...( marginBottom === 'custom'
			? { marginBottom: marginBottomValue }
			: {} ),
	};
	const wrapperStyle: CSSProperties = {
		minHeight,
		...( marginLeft === 'custom' ? { marginLeft: marginLeftValue } : {} ),
		...( marginRight === 'custom'
			? { marginRight: marginRightValue }
			: {} ),
		...( paddingTop === 'custom' ? { paddingTop: paddingTopValue } : {} ),
		...( paddingBottom === 'custom'
			? { paddingBottom: paddingBottomValue }
			: {} ),
		...( paddingLeft === 'custom'
			? { paddingLeft: paddingLeftValue }
			: {} ),
		...( paddingRight === 'custom'
			? { paddingRight: paddingRightValue }
			: {} ),
	};
	const wrapperClasses = clsx( `${ baseClass }__wrapper`, {
		[ `getwid-padding-top-${ paddingTop }` ]:
			paddingTop !== 'custom' && paddingTop !== '',
		[ `getwid-padding-bottom-${ paddingBottom }` ]:
			paddingBottom !== 'custom' && paddingBottom !== '',
		[ `getwid-padding-left-${ paddingLeft }` ]:
			paddingLeft !== 'custom' && paddingLeft !== '',
		[ `getwid-padding-right-${ paddingRight }` ]:
			paddingRight !== 'custom' && paddingRight !== '',
		[ `getwid-padding-tablet-top-${ paddingTopTablet }` ]:
			paddingTopTablet !== '',
		[ `getwid-padding-tablet-bottom-${ paddingBottomTablet }` ]:
			paddingBottomTablet !== '',
		[ `getwid-padding-tablet-left-${ paddingLeftTablet }` ]:
			paddingLeftTablet !== '',
		[ `getwid-padding-tablet-right-${ paddingRightTablet }` ]:
			paddingRightTablet !== '',
		[ `getwid-padding-mobile-top-${ paddingTopMobile }` ]:
			paddingTopMobile !== '',
		[ `getwid-padding-mobile-bottom-${ paddingBottomMobile }` ]:
			paddingBottomMobile !== '',
		[ `getwid-padding-mobile-left-${ paddingLeftMobile }` ]:
			paddingLeftMobile !== '',
		[ `getwid-padding-mobile-right-${ paddingRightMobile }` ]:
			paddingRightMobile !== '',
		[ `getwid-margin-left-${ marginLeft }` ]:
			marginLeft !== 'custom' && marginLeft !== '',
		[ `getwid-margin-right-${ marginRight }` ]:
			marginRight !== 'custom' && marginRight !== '',
		[ `getwid-margin-tablet-left-${ marginLeftTablet }` ]:
			marginLeftTablet !== '',
		[ `getwid-margin-tablet-right-${ marginRightTablet }` ]:
			marginRightTablet !== '',
		[ `getwid-margin-mobile-left-${ marginLeftMobile }` ]:
			marginLeftMobile !== '',
		[ `getwid-margin-mobile-right-${ marginRightMobile }` ]:
			marginRightMobile !== '',
		[ `getwid-align-items-${ verticalAlign }` ]: verticalAlign !== 'center',
		[ `getwid-align-items-tablet-${ verticalAlignTablet }` ]:
			verticalAlignTablet !== '',
		[ `getwid-align-items-mobile-${ verticalAlignMobile }` ]:
			verticalAlignMobile !== '',
		[ `getwid-justify-content-${ horizontalAlign }` ]:
			horizontalAlign !== 'center',
		[ `getwid-justify-content-tablet-${ horizontalAlignTablet }` ]:
			horizontalAlignTablet !== '',
		[ `getwid-justify-content-mobile-${ horizontalAlignMobile }` ]:
			horizontalAlignMobile !== '',
		'getwid-reset-min-height-tablet': resetMinHeightTablet !== false,
		'getwid-reset-min-height-mobile': resetMinHeightMobile !== false,
	} );
	const backgroundClassName = getColorClassName(
		'background-color',
		backgroundColor
	);
	const backgroundClass = clsx( `${ baseClass }__background`, {
		'has-background': backgroundColor || customBackgroundColor,
		[ backgroundClassName ?? '' ]: backgroundClassName,
	} );
	const backgroundStyle: CSSProperties = {
		backgroundColor: backgroundColor ? undefined : customBackgroundColor,
		backgroundImage: prepareGradientStyle( 'background', attributes ),
		...prepareBackgroundImageStyles( 'background', attributes ),
	};
	const foregroundStyle: CSSProperties = {
		opacity:
			foregroundOpacity !== undefined
				? foregroundOpacity / 100
				: undefined,
		backgroundColor: foregroundColor,
		backgroundImage: prepareGradientStyle( 'foreground', attributes ),
		...prepareBackgroundImageStyles( 'foreground', attributes ),
		mixBlendMode: foregroundFilter,
	};
	const innerWrapperStyle: CSSProperties = {
		maxWidth:
			contentMaxWidth && contentMaxWidthPreset === 'custom'
				? `${ contentMaxWidth }px`
				: undefined,
	};
	const wowData = entranceAnimation
		? {
				'data-wow-duration': entranceAnimationDuration || '2000ms',
				'data-wow-delay': entranceAnimationDelay || '500ms',
		  }
		: {};
	const blockProps = useBlockProps.save( {
		id: anchor || undefined,
		className: clsx( align ? `align${ align }` : null, {
			[ `has-inner-blocks-gap-${ gapSize }` ]:
				gapSize !== undefined && gapSize !== '',
			[ `getwid-anim ${ entranceAnimation }` ]: !! entranceAnimation,
			[ `getwid-margin-top-${ marginTop }` ]:
				marginTop !== 'custom' && marginTop !== '',
			[ `getwid-margin-bottom-${ marginBottom }` ]:
				marginBottom !== 'custom' && marginBottom !== '',
			[ `getwid-margin-tablet-top-${ marginTopTablet }` ]:
				marginTopTablet !== 'custom' && marginTopTablet !== '',
			[ `getwid-margin-tablet-bottom-${ marginBottomTablet }` ]:
				marginBottomTablet !== 'custom' && marginBottomTablet !== '',
			[ `getwid-margin-mobile-top-${ marginTopMobile }` ]:
				marginTopMobile !== 'custom' && marginTopMobile !== '',
			[ `getwid-margin-mobile-bottom-${ marginBottomMobile }` ]:
				marginBottomMobile !== 'custom' && marginBottomMobile !== '',
			'getwid-section-content-full-width':
				contentMaxWidthPreset === 'full',
			'getwid-section-content-custom-width':
				contentMaxWidthPreset === 'custom',
		} ),
		style: sectionStyle,
		...wowData,
	} );
	const youTubeVideoProps = {
		'youtube-video-url': youTubeVideoUrl || '',
		'youtube-video-muted': youTubeVideoMute,
		'youtube-video-loop': youTubeVideoLoop,
		'youtube-video-autoplay': youTubeVideoAutoplay,
	};

	return (
		<div { ...blockProps }>
			<div className={ wrapperClasses } style={ wrapperStyle }>
				<Dividers attributes={ attributes } baseClass={ baseClass } />
				{ ( !! backgroundVideoUrl || !! youTubeVideoUrl ) &&
					backgroundVideoControlsPosition !== 'none' && (
						<div
							className={ clsx(
								'getwid-background-video-controls',
								{
									[ `is-position-${ backgroundVideoControlsPosition }` ]:
										backgroundVideoControlsPosition !==
										'top-right',
								}
							) }
						>
							<button className="getwid-background-video-play">
								<i className="getwid-icon getwid-icon-pause" />
							</button>
							<button className="getwid-background-video-mute">
								<i className="getwid-icon getwid-icon-mute" />
							</button>
						</div>
					) }
				<div
					className={ clsx( `${ baseClass }__inner-wrapper`, {
						'has-dividers-over': dividersBringTop,
					} ) }
					style={ innerWrapperStyle }
				>
					<div className={ `${ baseClass }__background-holder` }>
						<div
							className={ backgroundClass }
							style={ backgroundStyle }
						>
							{ !! backgroundImage && (
								<div
									className={ `${ baseClass }__background-image-wrapper` }
								>
									<img
										className={ `${ baseClass }__background-image` }
										src={ backgroundImage.url }
										alt={ backgroundImage.alt }
									/>
								</div>
							) }
							{ !! sliderImages?.length && (
								<div
									className={ `${ baseClass }__background-slider-wrapper` }
								>
									<div
										className={ `${ baseClass }__background-slider` }
										data-autoplay="true"
										data-autoplay-speed={
											attributes.sliderAnimationSpeed
										}
										data-slide-effect={
											attributes.sliderAnimationEffect
										}
										data-slide-speed={
											attributes.sliderAnimationDuration
										}
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
														image.id
															? `wp-image-${ image.id }`
															: undefined
													}
													alt={ image.alt }
													data-id={ image.id }
												/>
											</div>
										) ) }
									</div>
								</div>
							) }
							{ ( !! backgroundVideoUrl ||
								!! youTubeVideoUrl ) && (
								<div
									className={ `${ baseClass }__background-video-wrapper` }
								>
									{ youTubeVideoUrl &&
										backgroundVideoType === 'youtube' && (
											<div
												className={ clsx(
													`${ baseClass }__background-video`,
													'source-youtube',
													{
														[ `scale-youtube-${ youTubeVideoScale }` ]:
															!! youTubeVideoScale,
													}
												) }
												{ ...youTubeVideoProps }
											>
												<div
													className={ `${ baseClass }__background-video-youtube` }
												/>
											</div>
										) }
									{ !! backgroundVideoUrl &&
										backgroundVideoType === 'self' && (
											<video
												className={ `${ baseClass }__background-video source-media-library` }
												playsInline
												autoPlay={
													backgroundVideoAutoplay
												}
												muted={ backgroundVideoMute }
												loop={ backgroundVideoLoop }
												poster={
													backgroundVideoPoster ||
													undefined
												}
											>
												<source
													src={
														backgroundVideoUrl.url
													}
													type="video/mp4"
												/>
											</video>
										) }
								</div>
							) }
						</div>
						<div
							className={ `${ baseClass }__foreground` }
							style={ foregroundStyle }
						/>
					</div>
					<div className={ `${ baseClass }__content` }>
						<div className={ `${ baseClass }__inner-content` }>
							<InnerBlocks.Content />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
