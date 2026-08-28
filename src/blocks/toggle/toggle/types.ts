import type { BlockEditProps } from '@wordpress/blocks';

export type ToggleHeaderTag = 'span' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type ToggleAttributes = {
	align?: 'wide' | 'full' | string;
	iconPosition: 'left' | 'right';
	iconOpen: string;
	iconClose: string;
	headerTag: ToggleHeaderTag;
};

export type ToggleEditProps = BlockEditProps< ToggleAttributes >;

export type ToggleDeprecatedAttributes = ToggleAttributes & {
	titles: Array< { content: string } >;
	items: Array< { content: string } >;
	active?: string;
	className?: string;
};
