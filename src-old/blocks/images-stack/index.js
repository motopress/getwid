/**
* External dependencies
*/
import { default as Edit } from './edit';
import Save from './save';
import Save_deprecated from './save_deprecated';
import attributes from './attributes';
import {checkDisableBlock} from 'GetwidUtils/help-functions';


import './style.scss';
import {
	every,
	filter
} from 'lodash';


/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
const {
	registerBlockType,
	createBlock
} = wp.blocks;


/**
 * Module Constants
 */
const validAlignments = [ 'center', 'wide', 'full' ];
const blockName = 'getwid/images-stack';

/**
* Register the block
*/
export default registerBlockType(
	'getwid/images-stack',
	{
		title: __('Image Stack Gallery', 'getwid'),
		category: 'getwid-blocks',
		icon: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14,10h8V2H14Zm6-6V8H16V4Z"/><path d="M12,12V0H0V18H7v6H24V12ZM2,16V2h8V16H2Zm20,6H9V18h3V14H22Z"/></svg>,
		keywords: [
			__('photo', 'getwid')
		],
		supports: {
			html: false,
			inserter: !Getwid.disabled_blocks.includes(blockName)
		},
		deprecated: [
			{
				attributes: attributes,
				save: Save_deprecated
			}
		],
		transforms: {
			from: [
				{
					type: 'block',
					isMultiBlock: true,
					blocks: [ 'core/image' ],
					transform: ( attributes ) => {
						let { align } = attributes[ 0 ];
						align = every( attributes, [ 'align', align ] ) ? align : undefined;
						const validImages = filter( attributes, ( { id, url } ) => id && url );

						return createBlock( 'getwid/images-stack', {
							images: validImages.map( ( { id, url, alt, caption } ) => ( {
								id,
								url,
								alt,
								caption,
							} ) ),
							ids: validImages.map( ( { id } ) => id ),
							align,
						} );
					},
				},
				{
					type: 'block',
					blocks: [ 'core/gallery' ],
					transform: ( attributes ) => {
						return createBlock( 'getwid/images-stack', attributes );
					}
				}
			],
			to: [
				{
					type: 'block',
					blocks: [ 'core/gallery' ],
					transform: function( attributes ) {
						return createBlock( 'core/gallery', attributes );
					},
				},
				{
					type: 'block',
					blocks: [ 'getwid/images-slider' ],
					transform: function( attributes ) {
						return createBlock( 'getwid/images-slider', attributes );
					},
				},
				{
					type: 'block',
					blocks: [ 'core/image' ],
					transform: ( { images, align } ) => {
						if ( images.length > 0 ) {
							return images.map( ( { id, url, alt, caption } ) => createBlock( 'core/image', {
								id,
								url,
								alt,
								caption,
								align,
							} ) );
						}
						return createBlock( 'core/image', { align } );
					},
				},
			],
		},
		attributes,
		getEditWrapperProps( attributes ) {
			const { align } = attributes;
			if ( -1 !== validAlignments.indexOf( align ) ) {
				return { 'data-align': align };
			}
		},
		...checkDisableBlock(blockName, Edit),
		save: Save
	},
);
