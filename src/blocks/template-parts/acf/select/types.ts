import type { BlockEditProps } from '@wordpress/blocks';

export type TemplateAcfSelectAttributes = {
	customField?: string;
	labelName?: string;
	separator: string;
	textColor?: string;
	customTextColor?: string;
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

export type TemplateAcfSelectEditProps =
	BlockEditProps< TemplateAcfSelectAttributes > & {
		textColor: ColorValue;
		setTextColor: ( value?: string ) => void;
		fontSize: FontSizeValue;
	};
