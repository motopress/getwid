import type { BlockEditProps } from '@wordpress/blocks';

import type { ToggleAttributes } from '../toggle/types';

export type ToggleItemAttributes = {
	outerParent?: {
		attributes?: ToggleAttributes;
	};
	title?: string;
	active?: boolean;
};

export type ToggleItemEditProps = BlockEditProps< ToggleItemAttributes >;
