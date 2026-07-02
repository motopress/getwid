import { createBlock } from '@wordpress/blocks';

import type { PostCarouselAttributes } from './types';

const transforms = {
	to: [
		{
			type: 'block' as const,
			blocks: [ 'getwid/custom-post-type' ],
			transform: ( attributes: PostCarouselAttributes ) =>
				createBlock( 'getwid/custom-post-type', {
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
			transform: ( attributes: PostCarouselAttributes ) =>
				createBlock( 'getwid/post-slider', attributes ),
		},
		{
			type: 'block' as const,
			blocks: [ 'getwid/recent-posts' ],
			transform: ( attributes: PostCarouselAttributes ) =>
				createBlock( 'getwid/recent-posts', {
					titleTag: attributes.titleTag,
					imageSize: attributes.imageSize,
					cropImages: attributes.cropImages,
					postsToShow: attributes.postsToShow,
					showTitle: attributes.showTitle,
					showDate: attributes.showDate,
					showCategories: attributes.showCategories,
					showCommentsCount: attributes.showCommentsCount,
					showContent: attributes.showContent !== 'none',
					contentLength: attributes.contentLength,
					showFeaturedImage: attributes.showFeaturedImage,
					order: attributes.order,
					orderBy: attributes.orderBy,
				} ),
		},
	],
};

export default transforms;
