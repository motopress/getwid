import type { BlockEditProps } from '@wordpress/blocks';

export type RecentPostsAttributes = {
	titleTag: string;
	imageSize: string;
	cropImages: boolean;
	categories?: string;
	postsToShow: number;
	showTitle: boolean;
	showDate: boolean;
	showCategories: boolean;
	showCommentsCount: boolean;
	showContent: boolean;
	contentLength: number;
	showFeaturedImage: boolean;
	postLayout: string;
	columns: number;
	align?: string;
	order: string;
	orderBy: string;
	className?: string;
};

export type RecentPostsEditProps = BlockEditProps< RecentPostsAttributes > & {
	recentPosts?: unknown[];
	categoriesList?: unknown[];
};

export type ServerSideRenderProps = {
	block: string;
	attributes: RecentPostsAttributes;
};
