import type { BlockEditProps } from '@wordpress/blocks';

export type TabsHeaderTag = 'span' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type TabsLayout =
	| ''
	| 'horizontal-center'
	| 'horizontal-right'
	| 'vertical-left'
	| 'vertical-right';

export type TabsAttributes = {
	align?: 'wide' | 'full' | string;
	active?: string;
	type: TabsLayout;
	headerTag: TabsHeaderTag;
};

export type TabsEditProps = BlockEditProps< TabsAttributes >;

export type TabsDeprecatedAttributes = {
	align?: string;
	titles: Array< { content: string } >;
	items: Array< { content: string } >;
	active?: string;
	type?: string;
	iconPosition?: string;
	headerTag?: TabsHeaderTag;
};
