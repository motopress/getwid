import type { BlockEditProps } from '@wordpress/blocks';

export type TemplatePostLinkAttributes = {
	textColor?: string;
	customTextColor?: string;
	buttonText: string;
	align?: string;
	textAlignment?: string;
	className?: string;
};

export type ColorValue = {
	color?: string;
	class?: string;
};

export type TemplatePostLinkEditProps =
	BlockEditProps< TemplatePostLinkAttributes > & {
		textColor: ColorValue;
		setTextColor: ( value?: string ) => void;
	};

export type ServerSideRenderProps = {
	block: string;
	attributes: TemplatePostLinkAttributes;
};
