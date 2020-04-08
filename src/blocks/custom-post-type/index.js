/**
* Internal dependencies
*/
import attributes from './attributes';
import Edit from './edit';
import {checkDisableBlock} from 'GetwidUtils/help-functions';
import './style.scss'

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
const { registerBlockType, createBlock } = wp.blocks;

/**
* Module Constants
*/
const blockName = 'getwid/custom-post-type';

/**
* Register the block
*/
registerBlockType( 'getwid/custom-post-type', {
	title: __('Custom Post Type', 'getwid'),
	icon: <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"	viewBox="0 0 24 24"><path d="M0,0v10h10V0H0z M8,8H2V2h6V8z"/><rect x="12" y="2" width="12" height="2"/><rect x="12" y="6" width="8" height="2"/><path d="M0,14v10h10V14H0z M8,22H2v-6h6V22z"/><rect x="12" y="16" width="12" height="2"/><rect x="12" y="20" width="8" height="2"/></svg>,
	category: 'getwid-blocks',
	keywords: [
	],
	supports: {
		inserter: !Getwid.disabled_blocks.includes(blockName)
	},
	transforms: {
		to: [
			{
				type: 'block',
				blocks: [ 'getwid/recent-posts' ],
				transform: ( attributes ) => createBlock( 'getwid/recent-posts', {
					postsToShow: attributes.postsToShow,
					postLayout: attributes.postLayout,
					columns: attributes.columns,
					order: attributes.order,
					orderBy: attributes.orderBy,
					showContent: true,
					align: attributes.align,
				}),
			},
			{
				type: 'block',
				blocks: [ 'getwid/post-carousel' ],
				transform: ( attributes ) => createBlock( 'getwid/post-carousel', {
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
				}),
			},
			{
				type: 'block',
				blocks: [ 'getwid/post-slider' ],
				transform: ( attributes ) => createBlock( 'getwid/post-slider', {
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
				}),
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
	...checkDisableBlock(blockName, Edit),
	save: () => {
		return null;
	},
} );
