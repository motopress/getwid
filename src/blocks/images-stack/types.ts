import type { BlockEditProps } from '@wordpress/blocks';

export type StackImage = {
	id?: number | string;
	url?: string;
	source_url?: string;
	original_url?: string;
	link?: string;
	alt?: string;
	alt_text?: string;
	caption?: string | { raw?: string };
	media_details?: {
		sizes?: Record< string, { source_url?: string } >;
	};
	sizes?: Record< string, { url?: string } >;
};

export type ImagesStackAttributes = {
	align?: string;
	images: StackImage[];
	ids: Array< number | string | undefined >;
	imageSize: string;
	linkTo: string;
	stackStyle: string;
	stackOverlap: string;
};

export type ImagesStackEditProps = BlockEditProps< ImagesStackAttributes > & {
	className?: string;
};

export type CoreSelect = {
	getMedia: ( id: number ) => StackImage | null;
};

export type RuntimeGlobal = Window & {
	Getwid?: {
		settings?: {
			image_sizes?: Array< { value: string; label: string } >;
		};
	};
};
