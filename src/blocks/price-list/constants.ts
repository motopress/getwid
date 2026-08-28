export const baseClass = 'wp-block-getwid-price-list';

export const allowedFormats = [
	'core/bold',
	'core/italic',
	'core/link',
	'core/image',
	'core/strikethrough',
	'core/text-color',
];

export const titleTagOptions = [ 'p', 'h2', 'h3', 'h4', 'h5', 'h6' ] as const;

export const currencyPositionOptions = [
	'currency-before',
	'currency-before-space',
	'currency-after',
	'currency-after-space',
] as const;
