import type { BlockEditProps } from '@wordpress/blocks';

export type TemplatePostContentDisplay =
	| 'excerpt'
	| 'content'
	| 'full'
	| string;

export type TemplatePostContentAttributes = {
	textColor?: string;
	customTextColor?: string;
	fontSize?: string;
	customFontSize?: string;
	textAlignment?: string;
	showContent: TemplatePostContentDisplay;
	contentLength: number;
	className?: string;
};

export type ColorValue = {
	color?: string;
	class?: string;
};

export type TemplatePostContentEditProps =
	BlockEditProps< TemplatePostContentAttributes > & {
		textColor: ColorValue;
		setTextColor: ( value?: string ) => void;
		fontSize: {
			class?: string;
			size?: number | string;
		};
	};

export type ServerSideRenderProps = {
	block: string;
	attributes: TemplatePostContentAttributes;
};
