export const baseClass = 'wp-block-getwid-banner';
export const imageBackgroundType = 'image';
export const videoBackgroundType = 'video';
export const allowedMediaTypes = [ 'image', 'video' ];
export const newTabRel = 'noreferrer noopener';

export const allowedFormats = [
	'core/bold',
	'core/italic',
	'core/link',
	'core/image',
	'core/strikethrough',
	'core/text-color',
];

export const imageSizeOptions = () =>
	Getwid.settings?.image_sizes || [
		{ label: 'Full Size', value: 'full' },
		{ label: 'Large', value: 'large' },
		{ label: 'Medium', value: 'medium' },
		{ label: 'Thumbnail', value: 'thumbnail' },
	];
