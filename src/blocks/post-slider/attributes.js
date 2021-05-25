const attributes = {
	postTemplate: {
		type: 'string',
	},

	//Custom Post Type
	postsToShow: {
		type: 'number',
		default: 5,
	},
	offset: {
		type: 'number',
		default: 0,
	},
	ignoreSticky: {
		type: 'boolean',
		default: true,
	},
	filterById: {
		type: 'string',
	},
	excludeById: {
		type: 'string',
	},
	excludeCurrentPost: {
		type: 'boolean',
		default: false,
	},
	childPagesCurrentPage: {
		type: 'boolean',
		default: false,
	},
	parentPageId: {
		type: 'string',
	},
	postType: {
		type: 'string',
		default: 'post',
	},
	taxonomy: {
		type: 'array',
		items: {
			type: 'string',
		}
	},
	terms: {
		type: 'array',
		items: {
			type: 'string',
		}
	},
	relation: {
		type: 'string',
		default: 'AND',
	},
	order: {
		type: 'string',
		default: 'desc',
	},
	orderBy: {
		type: 'string',
		default: 'date',
	},
	//Custom Post Type

	//Content settings
	minHeight: {
		type: 'string',
	},

	//Posts settings
	align: {
		type: 'string',
	},
	textAlignment: {
		type: 'string',
		default: 'left',
	},

	//Meta quary
	customField: {
		type: 'boolean',
		default: false,
	},
	metaItemCount: {
		type: 'number',
		default: 1,
	},
	metaRelation: {
		type: 'string',
		default: 'AND',
	},
	metaArray: {
		type: 'array',
		default: [ {
			metaKey:     '',
			metaValue:   '',
			metaCompare: '',
			metaType:    '',
		} ]
	},
	//Meta quary

	//Slider settings
	sliderAnimationEffect: {
		type: 'string',
		default: 'slide'
	},
	sliderAutoplay: {
		type: 'boolean',
		default: false,
	},
	sliderAutoplaySpeed: {
		type: 'string',
		default: '6000'
	},
	sliderInfinite: {
		type: 'boolean',
		default: true
	},
	sliderAnimationSpeed: {
		type: 'string',
		default: '800'
	},
	sliderArrows: {
		type: 'string',
		default: 'inside'
	},
	sliderDots: {
		type: 'string',
		default: 'inside'
	},

	className: {
		type: 'string',
	},
};
export default attributes;
