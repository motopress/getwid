import type { BlockEditProps } from '@wordpress/blocks';

export type TemplateAcfImageAttributes = {
	align?: 'left' | 'center' | 'right' | string;
	linkTo: 'none' | 'post' | string;
	customField?: string;
	imageSize: string;
	className?: string;
};

export type TemplateAcfImageEditProps =
	BlockEditProps< TemplateAcfImageAttributes >;
