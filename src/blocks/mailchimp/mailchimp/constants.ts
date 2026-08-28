export const baseClass = 'wp-block-getwid-mailchimp';

export const allowedFormats = [
	'core/bold',
	'core/italic',
	'core/link',
	'core/image',
	'core/strikethrough',
	'core/text-color',
];

export const allowedBlocks = [
	'getwid/mailchimp-field-email',
	'getwid/mailchimp-field-first-name',
	'getwid/mailchimp-field-last-name',
	'core/paragraph',
];

export const mailchimpTemplate: Array< [ string, Record< string, unknown > ] > =
	[
		[ 'getwid/mailchimp-field-first-name', { required: false } ],
		[ 'getwid/mailchimp-field-last-name', { required: false } ],
		[ 'getwid/mailchimp-field-email', { required: true } ],
	];

export const mailchimpApiKeyHelpUrl =
	'https://mailchimp.com/help/about-api-keys/#Find_or_Generate_Your_API_Key';
