/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
import classnames from 'classnames';

const { Component, Fragment } = wp.element;


/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-images-slider';


/**
* Create an Component
*/
class Save extends Component {

	render() {
		const {
			attributes:{
				align,
				images,
				imageCrop,
				linkTo,
				imageAlignment,
				sliderAnimationEffect,
				sliderSlidesToShow,
				sliderSlidesToShowLaptop,
				sliderSlidesToShowTablet,
				sliderSlidesToShowMobile,
				sliderSlidesToScroll,
				sliderAutoplay,
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
				resetHeightOnMobile,
				className
			},
		} = this.props;

		const containerClasses = classnames( className,
			`has-arrows-${sliderArrows}`,
			`has-dots-${sliderDots}`,
			{
				[ `is-carousel` ]: sliderSlidesToShow > 1,
				[ `has-slides-gap-${sliderSpacing}` ]: sliderSlidesToShow > 1,
				[ `has-images-${imageAlignment}` ]: imageAlignment,
			},			
			imageCrop ? `has-cropped-images` : null,
			slideHeight ? 'has-fixed-height' : null,
			align ? `align${ align }` : null,
		);

		const itemClasses = {
			className: classnames( `${baseClass}__item`,
				{
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
			<div className={ containerClasses }>
				<div className={`${baseClass}__wrapper`} {...sliderData}>
					{ images.map( ( image ) => {
						let href;

						switch ( linkTo ) {
							case 'media':
								href = image.original_url;
								break;
							case 'attachment':
								href = image.link;
								break;
						}

						const img = <img src={ image.url } alt={ image.alt } data-id={ image.id } data-link={ image.link } className={ `${baseClass}__image` + (image.id ? ` wp-image-${ image.id }` : null) } />;

						return (
							<div key={ image.id || image.url } {...itemClasses}>
								<Fragment>
									{ href ? <a href={ href }>{ img }</a> : img }
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