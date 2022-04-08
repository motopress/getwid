const attributes = {
	align: {
		type: 'string',
	},
	images: {
		type: 'array',
		default: [],
		source: 'query',
		selector: '.wp-block-getwid-images-slider .wp-block-getwid-images-slider__item',
		query:{
			url:{
				source: 'attribute',
				selector: 'img',
				attribute: 'src',
			},
			original_url:{
				source: 'attribute',
				selector: 'img',
				attribute: 'data-original-link',
			},
			link:{
				source: 'attribute',
				selector: 'img',
				attribute: 'data-link',
			},
			custom_link:{
				source: 'attribute',
				selector: 'img',
				attribute: 'data-custom-link',
			},
			custom_link_target:{
				source: 'attribute',
				selector: 'img',
				attribute: 'data-link-target',
			},
			custom_link_rel:{
				source: 'attribute',
				selector: 'img',
				attribute: 'data-link-rel',
			},
			alt:{
				source: 'attribute',
				selector: 'img',
				attribute: 'alt',
				default: '',
			},
			id:{
				source: 'attribute',
				selector: 'img',
				attribute: 'data-id',
			},
			caption:{
				type: 'string',
				source: 'html',
				selector: 'figcaption',
			},
		},
	},
	ids: {
		type: 'array',
		default: [],
	},
	imageSize: {
		type: 'string',
		default: 'full',
	},
	imageFit: {
		type: 'string',
		default: 'fill',
	},
	showCaption: {
		type: 'boolean',
		default: false,
	},
	captionStyle: {
		type: 'string',
		default: 'light',
	},
	captionPosition: {
		type: 'string',
		default: 'bottom-center',
	},
	linkTo: {
		type: 'string',
		default: 'none',
	},
	imageAlignment: {
		type: 'string',
		default: 'center',
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
	slideHeight: {
		type: 'string'
	},
	resetHeightOnTablet: {
		type: 'bool'
	},
	resetHeightOnMobile: {
		type: 'bool'
	}
};

export default attributes;
