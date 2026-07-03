import type { BlockEditProps } from '@wordpress/blocks';

import type { TabsHeaderTag } from '../tabs/types';

export type TabsItemAttributes = {
	outerParent?: {
		attributes?: {
			headerTag?: TabsHeaderTag;
		};
	};
	title?: string;
};

export type TabsItemEditProps = BlockEditProps< TabsItemAttributes >;
