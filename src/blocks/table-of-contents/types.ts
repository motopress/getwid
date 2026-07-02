import type { BlockEditProps } from '@wordpress/blocks';

export type TableOfContentsListStyle =
	| 'default'
	| 'none'
	| 'unordered'
	| 'ordered';

export type TableOfContentsHeading = {
	level: number;
	content: string;
	anchor: string;
	children?: TableOfContentsHeading[];
};

export type TableOfContentsAttributes = {
	headings: TableOfContentsHeading[];
	allowedTags: boolean[];
	align: 'none' | 'left' | 'right' | 'wide' | 'full';
	listStyle: TableOfContentsListStyle;
};

export type TableOfContentsEditProps =
	BlockEditProps< TableOfContentsAttributes >;
