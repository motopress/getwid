/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
import classnames from 'classnames';

const { Component, Fragment } = wp.element;

/**
* Create an Component
*/
class Save extends Component {

	render() {
		const {
			attributes:{
				showCaption,
				captionStyle,
				captionPosition,

				align,
				images,
				imageFit,
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
				slideHeight,
				resetHeightOnTablet,
				resetHeightOnMobile
			},
			className,
			baseClass
		} = this.props;

		const containerClasses = classnames( className,
			`has-arrows-${sliderArrows}`,
			`has-dots-${sliderDots}`,
			{
				[ `has-captions` ]: showCaption == true,
				[ `captions-style-${captionStyle}` ]: showCaption == true && captionPosition !== 'underneath',
				[ `captions-${captionPosition}` ]: showCaption == true,

				[ `is-carousel` ]: sliderSlidesToShow > 1,
				[ `has-slides-gap-${sliderSpacing}` ]: sliderSlidesToShow > 1,
				[ `has-images-${imageAlignment}`    ]: imageAlignment,

				[ `has-cropped-images` ]: imageFit === 'fill',
				[ `has-fitted-images` ]: imageFit === 'fit',
			},
			slideHeight ? 'has-fixed-height' : null,
			align ? `align${align}` : null
		);

		const itemClasses = {
			className: classnames( `${baseClass}__item`, {
					[ 'getwid-reset-height-tablet' ]: resetHeightOnTablet,
					[ 'getwid-reset-height-mobile' ]: resetHeightOnMobile
				}
			),
			style: {
				height: slideHeight ? slideHeight : undefined
			}
		};

		const sliderData = {
			'data-effect'      : sliderAnimationEffect,
			'data-slides-show' : sliderSlidesToShow,

			'data-slides-show-laptop': sliderSlidesToShowLaptop,
			'data-slides-show-tablet': sliderSlidesToShowTablet,
			'data-slides-show-mobile': sliderSlidesToShowMobile,

			'data-slides-scroll' : sliderSlidesToScroll,
			'data-autoplay'      : sliderAutoplay,
			'data-pause-hover'      : sliderPauseOnHover,
			'data-autoplay-speed': sliderAutoplaySpeed,
			'data-infinite'      : sliderInfinite,

			'data-animation-speed': sliderAnimationSpeed,
			'data-center-mode'    : sliderCenterMode,
			'data-variable-width' : sliderVariableWidth,

			'data-arrows' : sliderArrows,
			'data-dots'   : sliderDots,
			'data-spacing': sliderSpacing
		};

		return (
			<div className={containerClasses}>
				<div className={`${baseClass}__wrapper`} {...sliderData}>
					{ images.map( image => {
						let href;

						switch ( linkTo ) {
							case 'media':
								href = image.original_url;
								break;
							case 'attachment':
								href = image.link;
								break;
							case 'custom':
								href = image.custom_link;
								break;
						}

						const img = (
							<Fragment>
								<figure>
									<img
										src={image.url}
										alt={image.alt}
										data-id={image.id}
										data-link={image.link}
										data-link-target={image.custom_link_target ? image.custom_link_target : undefined}
										data-link-rel={image.custom_link_rel ? image.custom_link_rel : undefined}
										data-original-link={image.original_url ? image.original_url : undefined}
										data-custom-link={image.custom_link ? image.custom_link : undefined}
										className={ `${baseClass}__image ` + (image.id ? `wp-image-${ image.id }` : '') }
									/>
									{ image.caption && (
										<figcaption className={classnames(
											`${baseClass}__caption`,
										)}>
											{image.caption}
										</figcaption>
									)}
								</figure>
							</Fragment>
						);

						return (
							<div key={image.id || image.url} {...itemClasses}>
								<Fragment>
									{href ? <a href={href} target={image.custom_link_target ? image.custom_link_target : undefined} rel={image.custom_link_rel ? image.custom_link_rel : undefined}>{img}</a> : img}
								</Fragment>
							</div>
						);
					} ) }
				</div>
			</div>
		);
	}
}
export default Save;
