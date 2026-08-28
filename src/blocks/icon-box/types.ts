import type { BlockEditProps } from '@wordpress/blocks';

export type ColorValue = {
	color?: string;
	class?: string;
};

export type IconBoxAttributes = {
	backgroundColor?: string;
	textColor?: string;
	customBackgroundColor?: string;
	customTextColor?: string;
	textAlignment: string;
	icon: string;
	layout?: string;
	iconPosition: string;
	iconStyle: string;
	primaryColor?: string;
	secondaryColor?: string;
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
	hoverAnimation?: string;
	linkTarget?: string;
	rel?: string;
	className?: string;
};

export type IconBoxEditProps = BlockEditProps< IconBoxAttributes > & {
	className?: string;
	backgroundColor: ColorValue;
	textColor: ColorValue;
	setBackgroundColor: ( color?: string ) => void;
	setTextColor: ( color?: string ) => void;
};
