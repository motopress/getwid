/**
 * Block dependencies
 */
import { default as edit } from './edit';
import attributes from './attributes';

import './style.scss';
import { noop } from 'lodash';
import classnames from "classnames";

const { __ } = wp.i18n;
const {
	registerBlockType,
} = wp.blocks;
const {
	BlockControls,
	AlignmentToolbar,
	InnerBlocks,
	getColorClassName
} = wp.editor;

const {
	Toolbar
} = wp.components;

const { Fragment } = wp.element;

const validAlignments = [ 'center', 'wide', 'full' ];

/**
 * Register static block example block
 */
export default registerBlockType(
	'getwid/images-slider',
	{
		title: __('Image Slider', 'getwid'),
		category: 'getwid-blocks',
		icon: <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24"><g><circle cx="5.5" cy="6.5" r="1.5"/></g><g><path d="M0,0v8.4v0.2V16h16V5.3V0H0z M8,11.8l-2.1-1.6l-2.1,1.6L2,10.4V2h12v5.2L8,11.8z"/></g><path d="M20,8V4h-4v2h2v1v1v2v1v7h-7h-1H8H7H6v-2H4v4h4v4h16V8H20z M22,22H10v-2h10V10h2V22z"/></svg>,
		keywords: [
			__('gallery', 'getwid'),
			__('carousel', 'getwid'),
			__('photo', 'getwid')
		],		
		supports: {
			html: false,
		},
		attributes,

		getEditWrapperProps( attributes ) {
			const { align } = attributes;
			if ( -1 !== validAlignments.indexOf( align ) ) {
				return { 'data-align': align };
			}
		},

		edit,

		save( props ) {
			const {
				attributes:{
					align,
					images,
					ids,
					imageSize,
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
				},
			} = props;

			const className = 'wp-block-getwid-images-slider';

			const containerClasses = classnames(
				className,
				`has-arrows-${sliderArrows}`,
				`has-dots-${sliderDots}`,
				{
					[ `is-carousel` ]: sliderSlidesToShow > 1,
					[ `has-slides-gap-${sliderSpacing}` ]: sliderSlidesToShow > 1,
					[ `has-images-${imageAlignment}` ]: imageAlignment,
				},			
				imageCrop ? `has-cropped-images` : null,
				align ? `align${ align }` : null,
			);

			const sliderData = {
				'data-effect' : sliderAnimationEffect,
				'data-slides-show' : sliderSlidesToShow,
				'data-slides-show-laptop' : sliderSlidesToShowLaptop,
				'data-slides-show-tablet' : sliderSlidesToShowTablet,
				'data-slides-show-mobile' : sliderSlidesToShowMobile,
				'data-slides-scroll' : sliderSlidesToScroll,
				'data-autoplay' : sliderAutoplay,
				'data-autoplay-speed' : sliderAutoplaySpeed,
				'data-infinite' : sliderInfinite,
				'data-animation-speed' : sliderAnimationSpeed,
				'data-center-mode' : sliderCenterMode,
				'data-variable-width' : sliderVariableWidth,
				'data-arrows' : sliderArrows,
				'data-dots' : sliderDots,
				'data-spacing' : sliderSpacing,
			};

			return (
				<div className={ containerClasses }>
					<div className={`${className}__wrapper`} {...sliderData}>
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

							const img = <img src={ image.url } alt={ image.alt } data-id={ image.id } data-link={ image.link } className={ image.id ? `wp-image-${ image.id }` : null } />;

							return (
								<div key={ image.id || image.url } className={`${className}__item`}>
									<Fragment>
										{ href ? <a href={ href }>{ img }</a> : img }
									</Fragment>
								</div>
							);
						} ) }
					</div>
				</div>
			);
		},

	},
);