import type { BlockEditProps } from '@wordpress/blocks';

export type CountdownAttributes = {
	dateTime?: string;
	years: boolean;
	months: boolean;
	weeks: boolean;
	days: boolean;
	hours: boolean;
	minutes: boolean;
	seconds: boolean;
	backgroundColor?: string;
	textColor?: string;
	customTextColor?: string;
	fontGroupID: string;
	fontFamily: string;
	fontSize?: string;
	fontSizeTablet: string;
	fontSizeMobile: string;
	fontWeight?: string;
	fontStyle?: string;
	textTransform?: string;
	lineHeight?: string;
	letterSpacing?: string;
	align?: string;
	textAlignment?: string;
	innerPadding: string;
	innerSpacings: string;
	className?: string;
};

export type CountdownEditProps = BlockEditProps< CountdownAttributes > & {
	textColor: {
		color?: string;
		class?: string;
	};
	setTextColor: ( color?: string ) => void;
};

export type GetwidCountdownGlobal = {
	settings: {
		date_time_utc: string;
	};
};
