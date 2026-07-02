import type { BlockEditProps } from '@wordpress/blocks';

export type TemplatePostCategoriesAttributes = {
	blockDivider?: string;
	textColor?: string;
	customTextColor?: string;
	backgroundColor?: string;
	customBackgroundColor?: string;
	icon: string;
	iconColor?: string;
	customIconColor?: string;
	fontSize?: string;
	customFontSize?: string;
	divider: string;
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

export type TemplatePostCategoriesEditProps =
	BlockEditProps< TemplatePostCategoriesAttributes > & {
		backgroundColor: ColorValue;
		setBackgroundColor: ( value?: string ) => void;
		textColor: ColorValue;
		setTextColor: ( value?: string ) => void;
		iconColor: ColorValue;
		setIconColor: ( value?: string ) => void;
		fontSize: FontSizeValue;
	};

export type ServerSideRenderProps = {
	block: string;
	attributes: TemplatePostCategoriesAttributes;
};
