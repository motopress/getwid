import type { BlockEditProps } from '@wordpress/blocks';

export type PersonAttributes = {
	imageSize: string;
	imageCrop: boolean;
	title?: string;
	subtitle?: string;
	content?: string;
	imgId?: number;
	imgUrl?: string;
	imgAlt?: string;
	className?: string;
};

export type MediaSize = {
	source_url?: string;
	url?: string;
};

export type MediaObject = {
	id?: number;
	alt?: string;
	alt_text?: string;
	url?: string;
	media_details?: {
		sizes?: Record< string, MediaSize >;
	};
	sizes?: Record< string, MediaSize >;
};

export type PersonEditProps = BlockEditProps< PersonAttributes > & {
	className?: string;
	imgObj?: MediaObject | null;
};
