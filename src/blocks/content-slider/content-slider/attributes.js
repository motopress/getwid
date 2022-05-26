const attributes = {
	align: {
		type: 'string'
	},
	autoplay: {
		type: 'boolean',
		source: 'attribute',
		selector: '.wp-block-getwid-content-slider',
		attribute: 'data-autoplay',
		default: false,
	},
	autoplaySpeed: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-content-slider',
		attribute: 'data-autoplay-speed',
		default: 3000,
	},
	animationSpeed: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-content-slider',
		attribute: 'data-animation-speed',
		default: 800
	},
	infinite: {
		type: 'boolean',
		source: 'attribute',
		selector: '.wp-block-getwid-content-slider',
		attribute: 'data-infinite',
		default: false
	},
	animationEffect: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-content-slider',
		attribute: 'data-effect',
		default: 'slide'
	},
	centerMode: {
		type: 'boolean',
		source: 'attribute',
		selector: '.wp-block-getwid-content-slider',
		attribute: 'data-center-mode',
		default: false
	},
	adaptiveHeight: {
		type: 'boolean',
		source: 'attribute',
		selector: '.wp-block-getwid-content-slider',
		attribute: 'data-adaptive-height',
		default: false
	},
	draggable: {
		type: 'boolean',
		source: 'attribute',
		selector: '.wp-block-getwid-content-slider',
		attribute: 'data-draggable',
		default: true
	},
	pauseOnHover: {
		type: 'boolean',
		source: 'attribute',
		selector: '.wp-block-getwid-content-slider',
		attribute: 'data-pause-hover',
		default: false
	},
	arrows: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-content-slider',
		attribute: 'data-arrows',
		default: 'inside'
	},
	dots: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-content-slider',
		attribute: 'data-dots',
		default: 'inside'
	},
	slidesToShow: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-content-slider',
		attribute: 'data-slides-show',
		default: '1'
	},
	slidesToShowLaptop: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-content-slider',
		attribute: 'data-slides-show-laptop',
		default: '1'
	},
	slidesToShowTablet: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-content-slider',
		attribute: 'data-slides-show-tablet',
		default: '1'
	},
	slidesToShowMobile: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-content-slider',
		attribute: 'data-slides-show-mobile',
		default: '1'
	},
	slidesToScroll: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-content-slider',
		attribute: 'data-slides-scroll',
		default: '1'
	},
	slidesToScrollLaptop: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-content-slider',
		attribute: 'data-slides-scroll-laptop',
		default: '1'
	},
	slidesToScrollTablet: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-content-slider',
		attribute: 'data-slides-scroll-tablet',
		default: '1'
	},
	slidesToScrollMobile: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-content-slider',
		attribute: 'data-slides-scroll-mobile',
		default: '1'
	},
};

export default attributes;
