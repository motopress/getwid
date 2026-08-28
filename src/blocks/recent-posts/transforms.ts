import { createBlock } from '@wordpress/blocks';

import type { RecentPostsAttributes } from './types';

const transforms = {
	to: [
		{
			type: 'block',
			blocks: [ 'getwid/custom-post-type' ],
			transform: ( attributes: RecentPostsAttributes ) =>
				createBlock( 'getwid/custom-post-type', {
					postType: 'post',
					postsToShow: attributes.postsToShow,
					postLayout: attributes.postLayout,
					columns: attributes.columns,
					order: attributes.order,
					orderBy: attributes.orderBy,
					align: attributes.align,
				} ),
		},
		{
			type: 'block',
			blocks: [ 'getwid/post-carousel' ],
			transform: ( attributes: RecentPostsAttributes ) =>
				createBlock( 'getwid/post-carousel', {
					titleTag: attributes.titleTag,
					imageSize: attributes.imageSize,
					cropImages: attributes.cropImages,
					postsToShow: attributes.postsToShow,
					showTitle: attributes.showTitle,
					showDate: attributes.showDate,
					showCategories: attributes.showCategories,
					showCommentsCount: attributes.showCommentsCount,
					showContent:
						attributes.showContent === true ? 'excerpt' : 'none',
					contentLength: attributes.contentLength,
					showFeaturedImage: attributes.showFeaturedImage,
					order: attributes.order,
					orderBy: attributes.orderBy,
				} ),
		},
		{
			type: 'block',
			blocks: [ 'getwid/post-slider' ],
			transform: ( attributes: RecentPostsAttributes ) =>
				createBlock( 'getwid/post-slider', {
					titleTag: attributes.titleTag,
					imageSize: attributes.imageSize,
					cropImages: attributes.cropImages,
					postsToShow: attributes.postsToShow,
					showTitle: attributes.showTitle,
					showDate: attributes.showDate,
					showCategories: attributes.showCategories,
					showCommentsCount: attributes.showCommentsCount,
					showContent:
						attributes.showContent === true ? 'excerpt' : 'none',
					contentLength: attributes.contentLength,
					order: attributes.order,
					orderBy: attributes.orderBy,
				} ),
		},
	],
};

export default transforms;
