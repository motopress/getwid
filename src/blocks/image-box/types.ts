import type { BlockEditProps } from '@wordpress/blocks';

export type ImageBoxAttributes = {
	imageSize: string;
	id?: number;
	url?: string;
	alt?: string;
	textAlignment: string;
	layout?: string;
	imagePosition: string;
	marginTop?: string;
	marginBottom?: string;
	marginLeft?: string;
	marginRight?: string;
	link?: string;
	align?: string;
	hoverAnimation?: string;
	mobileLayout: string;
	mobileAlignment: string;
	linkTarget?: string;
	rel?: string;
	className?: string;
};

export type MediaSize = {
	source_url?: string;
	url?: string;
};

export type MediaObject = {
	id?: number;
	alt?: string;
	url?: string;
	media_details?: {
		sizes?: Record< string, MediaSize >;
	};
	sizes?: Record< string, MediaSize >;
};

export type ImageBoxEditProps = BlockEditProps< ImageBoxAttributes > & {
	className?: string;
	imgObj?: MediaObject | null;
};

export type InnerBlock = {
	name: string;
	attributes: {
		content?: string;
	};
};
