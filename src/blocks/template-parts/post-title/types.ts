import type { BlockEditProps } from '@wordpress/blocks';

export type TemplatePostTitleHeaderTag = 'p' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type TemplatePostTitleAttributes = {
	textColor?: string;
	customTextColor?: string;
	linkTo: 'none' | 'post' | string;
	fontSize?: string;
	customFontSize?: string;
	bold?: boolean;
	italic: boolean;
	textAlignment?: string;
	headerTag: TemplatePostTitleHeaderTag;
	className?: string;
};

export type ColorValue = {
	color?: string;
	class?: string;
};

export type TemplatePostTitleEditProps =
	BlockEditProps< TemplatePostTitleAttributes > & {
		textColor: ColorValue;
		setTextColor: ( value?: string ) => void;
		fontSize: {
			class?: string;
			size?: number | string;
		};
	};

export type ServerSideRenderProps = {
	block: string;
	attributes: TemplatePostTitleAttributes;
};
