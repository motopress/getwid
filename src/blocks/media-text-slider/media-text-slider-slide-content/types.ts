import type { BlockEditProps } from '@wordpress/blocks';

import type { ParentAttributesPayload } from '../media-text-slider/types';

export type MediaObject = {
	id?: number;
	alt?: string;
	url?: string;
	source_url?: string;
	type?: string;
	media_type?: string;
	media_details?: {
		sizes?: Record< string, { source_url?: string } >;
	};
	sizes?: Record< string, { url?: string } >;
};

export type MediaTextSliderSlideContentAttributes = {
	mediaAlt?: string;
	mediaId?: number;
	mediaUrl?: string;
	mediaType?: 'image' | 'video';
	innerParent?: ParentAttributesPayload;
};

export type MediaTextSliderSlideContentEditProps =
	BlockEditProps< MediaTextSliderSlideContentAttributes > & {
		className?: string;
		isSelected?: boolean;
	};
