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
		icon: {	
			src: 'format-gallery',
		},
		keywords: [
			__('Getwid', 'getwid')
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


console.log(props);
console.error('FROM SAVE ++++++++++++');

			const className = 'wp-block-getwid-images-slider';

			const containerClasses = classnames(
				className,
				`${className}--arrows-${sliderArrows}`,
				`${className}--dots-${sliderDots}`,
				{
					[ `${className}--carousel` ]: sliderSlidesToShow > 1,
					[ `${className}--slides-gap-${sliderSpacing}` ]: sliderSlidesToShow > 1,
					[ `${className}--images-${imageAlignment}` ]: imageAlignment != 'center',
				},			
				imageCrop ? `${ className }--crop-images` : null,
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
										{ image.caption && image.caption.length > 0 && (
											<RichText.Content tagName="figcaption" value={ image.caption } />
										) }
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