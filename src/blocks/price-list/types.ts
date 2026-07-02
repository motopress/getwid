import type { BlockEditProps } from '@wordpress/blocks';

export type ColorValue = {
	color?: string;
	class?: string;
};

export type MediaSize = {
	url?: string;
	source_url?: string;
};

export type MediaObject = {
	id?: number;
	url?: string;
	sizes?: Record< string, MediaSize >;
	media_details?: {
		sizes?: Record< string, MediaSize >;
	};
};

export type PriceListAttributes = {
	align?: string;
	textColor?: string;
	customTextColor?: string;
	title?: string;
	amount?: string;
	currency?: string;
	description?: string;
	dotted: boolean;
	id?: number;
	url?: string;
	titleTag: keyof JSX.IntrinsicElements;
	currencyPosition: string;
	className?: string;
};

export type PriceListEditProps = BlockEditProps< PriceListAttributes > & {
	className?: string;
	textColor: ColorValue;
	setTextColor: ( color?: string ) => void;
};
