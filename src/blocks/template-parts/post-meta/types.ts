import type { BlockEditProps } from '@wordpress/blocks';

export type TemplatePostMetaAttributes = {
	blockDivider?: string;
	textColor?: string;
	customTextColor?: string;
	direction: 'row' | 'column' | string;
	textAlignment?: string;
	className?: string;
};

export type ColorValue = {
	color?: string;
	class?: string;
};

export type TemplatePostMetaEditProps =
	BlockEditProps< TemplatePostMetaAttributes > & {
		textColor: ColorValue;
		setTextColor: ( value?: string ) => void;
	};

export type ServerSideRenderProps = {
	block: string;
	attributes: TemplatePostMetaAttributes;
};
