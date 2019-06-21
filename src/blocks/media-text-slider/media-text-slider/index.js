/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
import { times } from 'lodash';

/**
* External dependencies
*/
import attributes from './attributes';
import edit from './edit';
import save from './save';

/**
* WordPress dependencies
*/
const { select } = wp.data;
const { registerBlockType, createBlock } = wp.blocks;

/**
* Register the block
*/
registerBlockType( 'getwid/media-text-slider', {
	title: __( 'Media & Text Slider', 'getwid' ),
	icon: <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 24 24"><path d="M0,0v1v0.2V2v1.9v10.3V16v0.9V18h3h18h3v-2v-1.9V3.9V2V1.2V1V0H0z M22,7l-8,7l-4.9-2.1L4,15c0,0-1.8,0-2,0V4.8V2h20V7z"/><rect x="4" y="4" width="11" height="2"/><rect x="4" y="7" width="7" height="2"/><circle cx="6" cy="22" r="2"/><circle cx="12" cy="22" r="2"/><circle cx="18" cy="22" r="2"/></svg>,
	category: 'getwid-blocks',
	keywords: [
		__( 'gallery' , 'getwid' ),
		__( 'carousel', 'getwid' ),
		__( 'photo'   , 'getwid' )
	],
	supports: {
		alignWide: true,
		align: [ 'wide', 'full' ],
	},
	attributes: {
		...attributes,
		images: {
			type: 'onject',
			default: null
		}
	},
	transforms: {
		from: [
			{
				type: 'block',
				blocks: [ 'core/gallery' ],
				transform: content => (
					convertBlockFrom( content, 'media-text-slider' )
				)
			},
			{
				type: 'block',
				blocks: [ 'getwid/images-stack' ],
				transform: content => (
					convertBlockFrom( content, 'media-text-slider' )
				)
			},
			{
				type: 'block',
				blocks: [ 'getwid/images-slider' ],
				transform: content => (
					convertBlockFrom( content, 'media-text-slider' )
				)
			}
		],
		to: [
			{
				type: 'block',
				blocks: [ 'core/gallery' ],
				transform: attributes => (
					convertBlockTo( attributes, 'core/gallery', null )
				)
			},
			{
				type: 'block',
				blocks: [ 'getwid/images-stack' ],
				transform: attributes => (
					convertBlockTo( attributes, 'getwid/images-stack', [] )
				)
			},
			{
				type: 'block',
				blocks: [ 'getwid/images-slider' ],
				transform: attributes => (
					convertBlockTo( attributes, 'getwid/images-slider', [] )
				)
			}
		]
	},
	edit,
	save,
} );

/**
* Internal functions
*/
const convertBlockFrom = ( content, to ) => {

	const json = JSON.stringify( times( content.images.length, index => (
		{ text: `Slide ${index + 1}` })
	));

	return createBlock( `getwid/${to}`, {
			sliderArrays: json,
			images: content.images,
			slideCount: content.images.length
		}
	);
}

const convertBlockTo = (attributes, toBlock, ids) => {
	const images = [];
	const clientId 	  = select( 'core/editor' ).getSelectedBlockClientId();
	const innerBlocks = select( 'core/editor' ).getBlock( clientId ).innerBlocks;

	if ( innerBlocks.length ) {
		$.each( innerBlocks, ( index, slide ) => {

			if ( typeof slide.innerBlocks[ 0 ].attributes[ 'mediaUrl' ] != 'undefined' ) {

				if ( ids ) {
					ids.push( slide.innerBlocks[ 0 ].attributes.mediaId );
				}

				images.push( {
					[ ! ids && 'caption']: '',
					id:  slide.innerBlocks[ 0 ].attributes.mediaId,
					url: slide.innerBlocks[ 0 ].attributes.mediaUrl
				});

				if ( ! ids ) {
					const heading = slide.innerBlocks[ 0 ].innerBlocks[ 0 ];

					if ( heading.attributes.content != '' ) {
						images[ images.length - 1 ] .caption = heading.attributes.content;
					}
				}				
			}
		});
	}

	return createBlock( toBlock, {
		[ ids && 'imageSize' ]: attributes.imageSize,
		images: images.length ? images.map( ( { id, url, caption } ) => ( {
			id,
			url,
			caption
		} ) ) : [],
		[ ids && 'ids' ]: ids ? ids.length ? ids : [] : null,
	} );
}