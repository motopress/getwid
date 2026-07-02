import type { BlockEditProps } from '@wordpress/blocks';

export type TemplatePostDateAttributes = {
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

export type TemplatePostDateEditProps =
	BlockEditProps< TemplatePostDateAttributes > & {
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
	attributes: TemplatePostDateAttributes;
};
