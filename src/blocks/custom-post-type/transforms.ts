import { createBlock } from '@wordpress/blocks';

import type { CustomPostTypeAttributes } from './types';

const transforms = {
	to: [
		{
			type: 'block' as const,
			blocks: [ 'getwid/recent-posts' ],
			transform: ( attributes: CustomPostTypeAttributes ) =>
				createBlock( 'getwid/recent-posts', {
					postsToShow: attributes.postsToShow,
					postLayout: attributes.postLayout,
					columns: attributes.columns,
					order: attributes.order,
					orderBy: attributes.orderBy,
					showContent: true,
					align: attributes.align,
				} ),
		},
		{
			type: 'block' as const,
			blocks: [ 'getwid/post-carousel' ],
			transform: ( attributes: CustomPostTypeAttributes ) =>
				createBlock( 'getwid/post-carousel', {
					postType: 'post',
					postsToShow: attributes.postsToShow,
					ignoreSticky: attributes.ignoreSticky,
					filterById: attributes.filterById,
					taxonomy: attributes.taxonomy,
					terms: attributes.terms,
					relation: attributes.relation,
					order: attributes.order,
					orderBy: attributes.orderBy,
					align: attributes.align,
					metaQuery: attributes.metaQuery,
				} ),
		},
		{
			type: 'block' as const,
			blocks: [ 'getwid/post-slider' ],
			transform: ( attributes: CustomPostTypeAttributes ) =>
				createBlock( 'getwid/post-slider', {
					postType: 'post',
					postsToShow: attributes.postsToShow,
					ignoreSticky: attributes.ignoreSticky,
					filterById: attributes.filterById,
					taxonomy: attributes.taxonomy,
					terms: attributes.terms,
					relation: attributes.relation,
					order: attributes.order,
					orderBy: attributes.orderBy,
					align: attributes.align,
					metaQuery: attributes.metaQuery,
				} ),
		},
	],
};

export default transforms;
