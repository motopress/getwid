import type { BlockEditProps } from '@wordpress/blocks';

export type ColorValue = {
	color?: string;
	class?: string;
};

export type PriceBoxAttributes = {
	align?: string;
	backgroundColor?: string;
	textColor?: string;
	customBackgroundColor?: string;
	customTextColor?: string;
	title?: string;
	currency?: string;
	amount?: string;
	period?: string;
	features?: string;
	headerTag: keyof JSX.IntrinsicElements;
	className?: string;
};

export type PriceBoxEditProps = BlockEditProps< PriceBoxAttributes > & {
	className?: string;
	backgroundColor: ColorValue;
	textColor: ColorValue;
	setBackgroundColor: ( color?: string ) => void;
	setTextColor: ( color?: string ) => void;
};
