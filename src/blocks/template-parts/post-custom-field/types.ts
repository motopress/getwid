import type { BlockEditProps } from '@wordpress/blocks';

export type TemplatePostCustomFieldAttributes = {
	textColor?: string;
	customTextColor?: string;
	fontSize?: string;
	customFontSize?: string;
	customField?: string;
	bold: boolean;
	italic: boolean;
	textAlignment?: string;
	className?: string;
};

export type ColorValue = {
	color?: string;
	class?: string;
};

export type FontSizeValue = {
	class?: string;
	size?: number | string;
};

export type TemplatePostCustomFieldEditProps =
	BlockEditProps< TemplatePostCustomFieldAttributes > & {
		textColor: ColorValue;
		setTextColor: ( value?: string ) => void;
		fontSize: FontSizeValue;
	};

export type ServerSideRenderProps = {
	block: string;
	attributes: TemplatePostCustomFieldAttributes;
};
