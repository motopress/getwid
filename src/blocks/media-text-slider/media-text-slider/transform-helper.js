/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
import { isEqual, times } from 'lodash';

import { convertBlockFrom } from '../../content-timeline/content-timeline/transform-helper';

const { select } = wp.data;
const { createBlock } = wp.blocks;

/**
* Modules functions
*/
export const convertFromMediaSlider = ( content ) => {
	const images = $.isPlainObject( content ) ? content.images : content;

	const sliderSchema = JSON.stringify( times( images.length, index => ( { text: `Slide ${index + 1}` } ) ) );	

	const getInnerBlocks = item => [
		createBlock ( 'core/heading'  , { placeholder: __( 'Write heading…', 'getwid' ), content: item.caption } ),
		createBlock ( 'core/paragraph', { placeholder: __( 'Write text…'   , 'getwid' ) } )
	];

	return createBlock(
		'getwid/media-text-slider',
		{
			slideCount: images.length,
			sliderArrays: sliderSchema
		},
		images.map( ( item, index ) =>
			createBlock(
				'getwid/media-text-slider-slide',
				{ slideId: ++index },
				[ createBlock( 'getwid/media-text-slider-slide-content', { mediaId: item.slideId, mediaUrl: item.url }, getInnerBlocks( item ) ) ]
			)
		)
	);
}

export const convertBlockTo = ( attributes, toBlock, ids ) => {
	
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
					[ ! ids && 'caption' ]: '',
					id:  slide.innerBlocks[ 0 ].attributes.mediaId,
					url: slide.innerBlocks[ 0 ].attributes.mediaUrl
				} );

				if ( ! ids ) {
					const heading = slide.innerBlocks[ 0 ].innerBlocks[ 0 ];

					if ( heading.attributes.content != '' ) {
						images[ images.length - 1 ] .caption = heading.attributes.content;
					}
				}				
			}
		});
	}

	const blockName = toBlock.split( '/' ).pop();
	
	if ( blockName == 'image' ) {
		if ( images.length ) {
			return images.map( ( { id, url, caption } ) => createBlock( toBlock, {
				id,
				url,
				caption
			} ) );
		}
		return createBlock( toBlock, { } );
	} else if ( isEqual( toBlock, 'getwid/content-timeline' ) ) {		
		return convertBlockFrom( images );
	} else {
		return createBlock( toBlock, {
			[ ids && 'imageSize' ]: attributes.imageSize,
			images: images.length ? images.map( ( { id, url, caption } ) => ( {
				id,
				url,
				caption
			} ) ) : [],
			[ ids && 'ids' ]: ids ? ids.length ? ids : [] : null
		} );
	}
}