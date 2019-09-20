/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import { isEqual } from 'lodash';

import { convertFromMediaSlider } from '../../media-text-slider/media-text-slider/transform-helper';

const { select } = wp.data;
const { createBlock } = wp.blocks;

/**
* Modules functions
*/
export const convertBlockFrom = content => {
    let images;
    if ( $.isPlainObject( content ) ) {
        images = [ ...content.images ];
    } else {
        images = [ ...content ];
    }

	return createBlock(
		'getwid/content-timeline', {},
		images.map( ( item, index ) =>
			createBlock(
				'getwid/content-timeline-item', {
                    id: item.id,
                    alt: item.alt,
                    url: item.url,

                    imageSize: content.imageSize
                }, [
                    createBlock( 'core/heading'  , { placeholder: __( 'Write heading…', 'getwid' ), content: item.caption } ),
                    createBlock( 'core/paragraph', { placeholder: __( 'Write heading…', 'getwid' ) } )
                ]
			)
		)
	);
}

export const convertBlockTo = name => {
    const { getBlock, getSelectedBlockClientId } = select( 'core/editor' );

    const clientId 	  = getSelectedBlockClientId();
    const innerBlocks = getBlock( clientId ).innerBlocks;

    const images = [];
    if ( innerBlocks.length ) {
		$.each( innerBlocks, ( index, item ) => {

            const [ heading, ] = item.innerBlocks;

			if ( typeof item.attributes[ 'url' ] != 'undefined' ) {
				images.push( {
					id:  item.attributes.id,
                    url: item.attributes.url,
                    alt: item.attributes.alt,

                    caption: heading.attributes.content
				} );
			}
		} );
    }

    if ( isEqual( name, 'core/image' ) ) {
        if ( images.length ) {
			return images.map( ( { id, url, alt, caption } ) => createBlock( name, {
				id,
				url,
                alt,
                caption
			} ) );
		}
		return createBlock( name, { } );
    } else if ( isEqual( name, 'getwid/media-text-slider' ) ) {
        return convertFromMediaSlider( images );
    } else {
        return createBlock( name, {
            imageSize: innerBlocks[ 0 ].attributes.imageSize,
            images: images.length ? images.map( ( { id, url, alt, caption } ) => ( {
                id,
                url,
                alt,
                caption
            } ) ) : [],
            ids: images.map( ( { id } ) => id )
        } );
    }
}