/**
* Internal dependencies
*/
import attributes from './attributes';
import edit from './edit';

import './style.scss'

/**
* External dependencies
*/
import { __ } from 'wp.i18n';

const { registerBlockType, createBlock } = wp.blocks;

/**
* Register the block
*/
registerBlockType( 'getwid/recent-posts', {
	title: __( 'Recent Posts', 'getwid' ),
	icon: <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24"><path d="M0,0v10h10V0H0z M8,8H2V2h6V8z"/><rect x="12" y="2" width="12" height="2"/><rect x="12" y="6" width="8" height="2"/><path d="M0,14v10h10V14H0z M8,22H2v-6h6V22z"/><rect x="12" y="16" width="12" height="2"/><rect x="12" y="20" width="8" height="2"/></svg>,
	category: 'getwid-blocks',
	keywords: [ ],
	supports: {
		anchor: true
	},
	transforms: {
		to: [
			{
				type: 'block',
				blocks: [ 'getwid/custom-post-type' ],
				transform: ( attributes ) => createBlock( 'getwid/custom-post-type', {
					postType: 'post',
					postsToShow: attributes.postsToShow,
					postLayout: attributes.postLayout,
					columns: attributes.columns,
					order: attributes.order,
					orderBy: attributes.orderBy,
					align: attributes.align,
				})
			},
			{
				type: 'block',
				blocks: [ 'getwid/post-carousel' ],
				transform: ( attributes ) => createBlock( 'getwid/post-carousel', {
					titleTag: attributes.titleTag,
					imageSize: attributes.imageSize,
					cropImages: attributes.cropImages,
					postsToShow: attributes.postsToShow,
					showTitle: attributes.showTitle,
					showDate: attributes.showDate,
					showCategories: attributes.showCategories,
					showCommentsCount: attributes.showCommentsCount,
					showContent: attributes.showContent == true ? 'excerpt' : 'none',
					contentLength: attributes.contentLength,
					showFeaturedImage: attributes.showFeaturedImage,
					order: attributes.order,
					orderBy: attributes.orderBy
				})
			},			
			{
				type: 'block',
				blocks: [ 'getwid/post-slider' ],
				transform: ( attributes ) => createBlock( 'getwid/post-slider', {
					titleTag: attributes.titleTag,
					imageSize: attributes.imageSize,
					cropImages: attributes.cropImages,
					postsToShow: attributes.postsToShow,
					showTitle: attributes.showTitle,
					showDate: attributes.showDate,
					showCategories: attributes.showCategories,
					showCommentsCount: attributes.showCommentsCount,
					showContent: attributes.showContent == true ? 'excerpt' : 'none',
					contentLength: attributes.contentLength,
					order: attributes.order,
					orderBy: attributes.orderBy
				})
			}						
		]
	}
	attributes,
	getEditWrapperProps( attributes ) {
		const { align } = attributes;
		if ( [ 'wide', 'full' ].includes( align ) ) {
			return { 'data-align': align };
		}
	},
	edit,
	save: () => {
		return null;
	}
} );