const attributes = {
	align: {
		type: 'string'
	},
	backgroundColor: {
		type: 'string'
	},
	textColor: {
		type: 'string'
	},
	customBackgroundColor: {
		type: 'string'
	},
	customTextColor: {
		type: 'string'
	},
	to: {
		type: 'string',
		source: 'attribute',
		selector: 'input[name=\'to\']',
		attribute: 'value'
	},
	subject: {
		type: 'string',
		source: 'attribute',
		selector: 'input[name=\'subject\']',
		attribute: 'value'
	},
	text: {
		type: 'string',
		source: 'html',
		selector: 'button',
		default: 'Submit'
	},
	captcha: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-contact-form',
		attribute: 'data-use-captcha',
		default: 'false'
	},
	nameIsRequired: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-contact-form-name',
		attribute: 'data-name-is-required',
		default: 'true'
	},
	emailIsRequired: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-contact-form-email',
		attribute: 'data-email-is-required',
		default: 'true'
	}
};

export default attributes;