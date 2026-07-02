export const contactFormClass = 'wp-block-getwid-contact-form';

export const allowedBlocks = [
	'getwid/field-name',
	'getwid/field-email',
	'getwid/field-textarea',
	'getwid/captcha',
	'core/group',
	'core/columns',
	'core/paragraph',
	'core/spacer',
];

export const allowedFormats = [
	'core/bold',
	'core/italic',
	'core/link',
	'core/image',
	'core/strikethrough',
	'core/text-color',
];

export const contactFormTemplate: [ string, Record< string, unknown > ][] = [
	[ 'getwid/field-name', { required: true } ],
	[ 'getwid/field-email', { required: true } ],
	[ 'getwid/field-textarea', { required: true } ],
];
