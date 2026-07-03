import type { BlockEditProps } from '@wordpress/blocks';

export type ContentTimelineAttributes = {
	align?: string;
	wrapperAlign?: string;
	backgroundColor?: string;
	customBackgroundColor?: string;
	fillColor?: string;
	customFillColor?: string;
	paddingTop?: string;
	paddingBottom?: string;
	paddingLeft?: string;
	paddingRight?: string;
	horizontalSpace?: string;
	marginBottom?: string;
	animation: string;
	filling: string;
};

export type OuterParentAttributes = Partial< ContentTimelineAttributes > & {
	pointColor?: string;
};

export type ContentTimelineItemAttributes = {
	outerParent?: {
		attributes?: OuterParentAttributes;
	};
	cardPosition: string;
	meta?: string;
	imageSize: string;
	id?: number;
	alt: string;
	url?: string;
};

export type ContentTimelineEditProps =
	BlockEditProps< ContentTimelineAttributes > & {
		backgroundColor: {
			color?: string;
			class?: string;
		};
		fillColor: {
			color?: string;
			class?: string;
		};
		setBackgroundColor: ( color?: string ) => void;
		setFillColor: ( color?: string ) => void;
		baseClass: string;
	};

export type ContentTimelineItemEditProps =
	BlockEditProps< ContentTimelineItemAttributes > & {
		baseClass: string;
	};

export type MediaObject = {
	id?: number;
	url?: string;
	source_url?: string;
	alt?: string;
	alt_text?: string;
	caption?: string;
	link?: string;
	media_details?: {
		sizes?: Record< string, { source_url?: string } >;
	};
	sizes?: Record< string, { url?: string } >;
};

export type ImageSizeOption = {
	value: string;
	label: string;
};
