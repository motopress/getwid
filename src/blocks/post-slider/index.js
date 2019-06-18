/**
* External dependencies
*/
import attributes from './attributes';
import edit from './edit';
import './style.scss'


/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {
	registerBlockType,
	createBlock
} = wp.blocks;


/**
* Register the block
*/
registerBlockType( 'getwid/post-slider', {
	title: __('Post Slider', 'getwid'),
	icon: <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24"><polygon points="16,4 8,4 8,6 16,6 "/><polygon points="14,12 8,12 8,14 14,14 "/><polygon points="16,8 8,8 8,10 16,10 "/><path d="M18,2v14H6V2H18 M20,0H4v18h16V0L20,0z"/><circle cx="6" cy="22" r="2"/><circle cx="12" cy="22" r="2"/><circle cx="18" cy="22" r="2"/></svg>,
	category: 'getwid-blocks',
	keywords: [
	],
	supports: {
		anchor: true,
	},
	transforms: {
		to: [
			{
				type: 'block',
				blocks: [ 'getwid/custom-post-type' ],
				transform: function( attributes ) {

					return createBlock( 'getwid/custom-post-type', {
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
					});
				},
			},				
			{
				type: 'block',
				blocks: [ 'getwid/post-carousel' ],
				transform: function( attributes ) {
					return createBlock( 'getwid/post-carousel', attributes );
				},
			},
			{
				type: 'block',
				blocks: [ 'getwid/recent-posts' ],
				transform: function( attributes ) {

					return createBlock( 'getwid/recent-posts', {
						titleTag: attributes.titleTag,
						imageSize: attributes.imageSize,
						cropImages: attributes.cropImages,
						postsToShow: attributes.postsToShow,
						showTitle: attributes.showTitle,
						showDate: attributes.showDate,
						showCategories: attributes.showCategories,
						showCommentsCount: attributes.showCommentsCount,
						showContent: attributes.showContent != 'none' ? true : false,
						contentLength: attributes.contentLength,
						showFeaturedImage: true,
						order: attributes.order,
						orderBy: attributes.orderBy
					});
				},
			},							
		],
	},	
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
	},	
} );