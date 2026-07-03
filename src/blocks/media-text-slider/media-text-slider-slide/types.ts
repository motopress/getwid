import type { BlockEditProps } from '@wordpress/blocks';

import type { ParentAttributesPayload } from '../media-text-slider/types';

export type MediaTextSliderSlideAttributes = {
	slideId: number;
	id?: number;
	outerParent?: ParentAttributesPayload;
	mediaId?: number;
	url?: string;
};

export type MediaTextSliderSlideEditProps =
	BlockEditProps< MediaTextSliderSlideAttributes > & {
		className?: string;
	};
