/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import { isEqual } from 'lodash';
import {checkDisableBlock} from 'GetwidUtils/help-functions';

/**
* Internal dependencies
*/
import attributes from './attributes';
import Edit from './edit';

import './style.scss';

const { registerBlockType, createBlock } = wp.blocks;

/**
* Module Constants
*/
const blockName = 'getwid/post-carousel';

/**
* Register the block
*/
registerBlockType( 'getwid/post-carousel', {
	title: __( 'Post Carousel', 'getwid' ),
	icon: <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24"><polygon points="16,11 8,11 8,13 16,13 16,11 "/><polygon points="14,15 8,15 8,17 14,17 14,15 "/><polygon points="16,7 8,7 8,9 16,9 16,7 "/><path d="M24,4h-4V2H4v2H0v16h4v2h16v-2h4V4z M2,18V6h2v12H2z M6,20V4h12v16H6z M22,18h-2V6h2V18z"/></svg>,
	category: 'getwid-blocks',
	keywords: [ ],
	supports: {
		inserter: !Getwid.disabled_blocks.includes(blockName)
	},
	deprecated: [{
		attributes: attributes,
		isEligible( attributes, innerBlocks ) {
			return true;
		},
		migrate( attributes ) {
			const { sliderArrows, sliderDots } = attributes;
			return {
				...attributes,
				...{
					sliderArrows: isEqual( sliderArrows, 'ouside' ) ? 'outside' : sliderArrows,
					sliderDots:   isEqual( sliderDots  , 'ouside' ) ? 'outside' : sliderDots
				}
			};
		},
		save: () => {
			return null;
		}
	}],
	transforms: {
		to: [{
				type: 'block',
				blocks: [ 'getwid/custom-post-type' ],
				transform: attributes => createBlock( 'getwid/custom-post-type', {
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
					metaQuery: attributes.metaQuery
				})
			}, {
				type: 'block',
				blocks: [ 'getwid/post-slider' ],
				transform: ( attributes ) => createBlock( 'getwid/post-slider', attributes ),
			}, {
				type: 'block',
				blocks: [ 'getwid/recent-posts' ],
				transform: attributes => createBlock( 'getwid/recent-posts', {
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
					showFeaturedImage: attributes.showFeaturedImage,
					order: attributes.order,
					orderBy: attributes.orderBy
				})
			}
		]
	},
	attributes,
	getEditWrapperProps( attributes ) {
		const { align } = attributes;
		if ( [ 'wide', 'full' ].includes( align ) ) {
			return { 'data-align': align };
		}
	},
	...checkDisableBlock(blockName, Edit),
	save: () => {
		return null;
	}
} );
