import type { BlockEditProps } from '@wordpress/blocks';

export type ColorValue = {
	color?: string;
	class?: string;
};

export type ProgressBarAttributes = {
	align?: string;
	backgroundColor?: string;
	textColor?: string;
	customBackgroundColor?: string;
	customTextColor?: string;
	fillAmount: string;
	title?: string;
	isAnimated: string;
	className?: string;
};

export type ProgressBarEditProps = BlockEditProps< ProgressBarAttributes > & {
	className?: string;
	backgroundColor: ColorValue;
	textColor: ColorValue;
	setBackgroundColor: ( color?: string ) => void;
	setTextColor: ( color?: string ) => void;
};

export type WaypointOptions = {
	element: HTMLElement;
	handler: () => void;
	offset: string;
};

export type WaypointInstance = {
	destroy: () => void;
};

export type WaypointConstructor = new (
	options: WaypointOptions
) => WaypointInstance;
