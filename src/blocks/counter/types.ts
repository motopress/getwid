import type { BlockEditProps } from '@wordpress/blocks';

export type CounterAttributes = {
	align?: string;
	wrapperAlign?: string;
	textColor?: string;
	customTextColor?: string;
	start: string;
	duration: string;
	useEasing: string;
	useGrouping: string;
	separator: string;
	decimal: string;
	prefix?: string;
	suffix?: string;
	end: string;
	decimalPlaces: string;
	easing: string;
	numerals: string;
};

export type ColorValue = {
	color?: string;
	class?: string;
};

export type CounterEditProps = BlockEditProps< CounterAttributes > & {
	textColor: ColorValue;
	setTextColor: ( nextColor?: string ) => void;
};

export type CountUpOptions = {
	startVal: number;
	decimalPlaces: number;
	duration: number;
	useEasing: boolean;
	useGrouping: boolean;
	separator: string;
	decimal: string;
	easingFn:
		| ( ( t: number, b: number, c: number, d: number ) => number )
		| null;
	numerals: string[] | null;
};

export type CountUpConstructor = new (
	element: HTMLElement,
	endValue: number,
	options: CountUpOptions
) => {
	start: () => void;
};

export type WaypointOptions = {
	element: HTMLElement;
	handler: () => void;
	offset: string;
};

export type WaypointConstructor = new ( options: WaypointOptions ) => {
	destroy: () => void;
};

declare global {
	interface Window {
		CountUp?: CountUpConstructor;
		Waypoint?: WaypointConstructor;
		wp?: {
			dom?: {
				safeHTML?: ( value: string ) => string;
			};
			htmlEntities?: {
				decodeEntities?: ( value: string ) => string;
			};
		};
	}
}
