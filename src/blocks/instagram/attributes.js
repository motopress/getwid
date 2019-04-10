const { __ } = wp.i18n;

const attributes = {
	photoCount: {
		type: 'number',
		default: 10,
	},
	displayStyle: {
		type: 'string',
		default: 'grid',
	},
	gridColumns: {
		type: 'number',
		default: 3,
	},	
	showLikes: {
		type: 'boolean',
		default: true,
	},
	showComments: {
		type: 'boolean',
		default: true,
	},
	align: {
		type: 'string',
	},

	sliderAnimationEffect: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-images-slider .wp-block-getwid-images-slider__wrapper',
		attribute: 'data-effect',
		default: 'slide'
	},
	sliderSlidesToShow: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-images-slider .wp-block-getwid-images-slider__wrapper',
		attribute: 'data-slides-show',
		default: '1'
	},
	sliderSlidesToShowLaptop: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-images-slider .wp-block-getwid-images-slider__wrapper',
		attribute: 'data-slides-show-laptop',
		default: '1'
	},
	sliderSlidesToShowTablet: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-images-slider .wp-block-getwid-images-slider__wrapper',
		attribute: 'data-slides-show-tablet',
		default: '1'
	},
	sliderSlidesToShowMobile: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-images-slider .wp-block-getwid-images-slider__wrapper',
		attribute: 'data-slides-show-mobile',
		default: '1'
	},		
	sliderSlidesToScroll: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-images-slider .wp-block-getwid-images-slider__wrapper',
		attribute: 'data-slides-scroll',
		default: '1'
	},
	sliderAutoplay: {
		type: 'boolean',
		default: false,
	},
	sliderAutoplaySpeed: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-images-slider .wp-block-getwid-images-slider__wrapper',
		attribute: 'data-autoplay-speed',
		default: 6000
	},
	sliderInfinite: {
		type: 'boolean',
		default: true
	},
	sliderAnimationSpeed: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-images-slider .wp-block-getwid-images-slider__wrapper',
		attribute: 'data-animation-speed',
		default: 800
	},
	sliderCenterMode: {
		type: 'boolean',	
		default: false
	},
	sliderVariableWidth: {
		type: 'boolean',
		default: false
	},
	sliderSpacing: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-images-slider .wp-block-getwid-images-slider__wrapper',
		attribute: 'data-spacing',
		default: 'none',
	},
	sliderArrows: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-images-slider .wp-block-getwid-images-slider__wrapper',
		attribute: 'data-arrows',
		default: 'inside'
	},
	sliderDots: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-images-slider .wp-block-getwid-images-slider__wrapper',
		attribute: 'data-dots',
		default: 'inside'
	},	
};
export default attributes;