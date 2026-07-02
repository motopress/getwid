import type { BlockEditProps } from '@wordpress/blocks';
import type { MetaQueryGroup, QueryValues } from 'getwid-components';

export type CustomPostTypeAttributes = QueryValues & {
	postTemplate?: string;
	postLayout: string;
	columns: number;
	spacing: string;
	align?: string;
	className?: string;
	metaQuery: MetaQueryGroup[];
};

export type CustomPostTypeEditProps =
	BlockEditProps< CustomPostTypeAttributes > & {
		recentPosts?: unknown[];
	};

export type ServerSideRenderProps = {
	block: string;
	attributes: CustomPostTypeAttributes;
};
