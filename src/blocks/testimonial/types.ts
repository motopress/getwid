import type { BlockEditProps } from '@wordpress/blocks';

export type TestimonialAttributes = {
	title?: string;
	subtitle?: string;
	content?: string;
	imgId?: number;
	imgUrl?: string;
	imgAlt?: string;
};

export type TestimonialEditProps = BlockEditProps< TestimonialAttributes >;

export type TestimonialMedia = {
	id: number;
	url: string;
	alt?: string;
	sizes?: {
		thumbnail?: { url?: string };
		full?: { url?: string };
	};
};
