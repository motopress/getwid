import type { BlockEditProps } from '@wordpress/blocks';

export type TemplatePostButtonAttributes = {
	backgroundColor?: string;
	textColor?: string;
	customBackgroundColor?: string;
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

export type TemplatePostButtonEditProps =
	BlockEditProps< TemplatePostButtonAttributes > & {
		backgroundColor: ColorValue;
		setBackgroundColor: ( value?: string ) => void;
		textColor: ColorValue;
		setTextColor: ( value?: string ) => void;
	};

export type ServerSideRenderProps = {
	block: string;
	attributes: TemplatePostButtonAttributes;
};
