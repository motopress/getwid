const attributes = {
	align: {
		type: 'string'
	},
	to: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-contact-form__to',
		attribute: 'value'
	},
	subject: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-contact-form__subject',
		attribute: 'value'
	},
	align: {
		type: 'string'
	},
	// nameIsRequired: {
	// 	type: 'string'
	// },
	// emailIsRequired: {
	// 	type: 'string'
	// },
};

export default attributes;