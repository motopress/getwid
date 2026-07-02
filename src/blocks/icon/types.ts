import type { BlockEditProps } from '@wordpress/blocks';

export type ColorValue = {
	color?: string;
	class?: string;
};

export type IconAttributes = {
	backgroundColor?: string;
	textColor?: string;
	customBackgroundColor?: string;
	customTextColor?: string;
	icon: string;
	iconStyle: string;
	iconSize?: string;
	padding?: number;
	marginTop?: string;
	marginBottom?: string;
	marginLeft?: string;
	marginRight?: string;
	borderWidth?: number;
	borderRadius: number;
	link?: string;
	align?: string;
	textAlignment?: string;
	hoverAnimation?: string;
	linkTarget?: string;
	rel?: string;
	className?: string;
};

export type IconEditProps = BlockEditProps< IconAttributes > & {
	className?: string;
	backgroundColor: ColorValue;
	textColor: ColorValue;
	setBackgroundColor: ( color?: string ) => void;
	setTextColor: ( color?: string ) => void;
};
