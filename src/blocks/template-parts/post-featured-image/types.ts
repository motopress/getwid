import type { BlockEditProps } from '@wordpress/blocks';

export type TemplatePostFeaturedImageAttributes = {
	linkTo: 'none' | 'post' | string;
	align?: 'left' | 'center' | 'right' | string;
	imageSize: string;
	className?: string;
};

export type TemplatePostFeaturedImageEditProps =
	BlockEditProps< TemplatePostFeaturedImageAttributes >;

export type ServerSideRenderProps = {
	block: string;
	attributes: TemplatePostFeaturedImageAttributes;
};
