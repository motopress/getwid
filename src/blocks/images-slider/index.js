/**
* Internal dependencies
*/
import { default as Edit } from './edit';
import Save from './save';
import Save_deprecated from './save_deprecated';
import attributes from './attributes';

import './style.scss';

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
import { every, filter } from 'lodash';

const { registerBlockType, createBlock } = wp.blocks;

/**
* Module Constants
*/
const validAlignments = [ 'center', 'wide', 'full' ];

/**
* Register the block
*/
export default registerBlockType(
	'getwid/images-slider',
	{
		title: __( 'Image Slider', 'getwid' ),
		category: 'getwid-blocks',
		icon: <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24"><g><circle cx="5.5" cy="6.5" r="1.5"/></g><g><path d="M0,0v8.4v0.2V16h16V5.3V0H0z M8,11.8l-2.1-1.6l-2.1,1.6L2,10.4V2h12v5.2L8,11.8z"/></g><path d="M20,8V4h-4v2h2v1v1v2v1v7h-7h-1H8H7H6v-2H4v4h4v4h16V8H20z M22,22H10v-2h10V10h2V22z"/></svg>,
		keywords: [
			__( 'gallery' , 'getwid' ),
			__( 'carousel', 'getwid' ),
			__( 'photo'	  , 'getwid' )
		],		
		supports: {
			html: false,
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

						return createBlock( 'getwid/images-slider', {
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
					transform: ( attributes ) => createBlock( 'getwid/images-slider', attributes )
				}
			],
			to: [
				{
					type: 'block',
					blocks: [ 'core/gallery' ],
					transform: ( attributes ) => createBlock( 'core/gallery', attributes )
				},
				{
					type: 'block',
					blocks: [ 'getwid/images-stack' ],
					transform: ( attributes ) => createBlock( 'getwid/images-stack', attributes )
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
		edit: Edit,
		save: Save
	}
);