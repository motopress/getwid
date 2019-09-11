/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import { times } from 'lodash';

const { select } = wp.data;
const { createBlock } = wp.blocks;

/**
* Modules functions
*/
export const convertBlockFrom = () => {

}

export const convertBlockTo = ( attributes, name ) => {
    const { getBlock, getSelectedBlockClientId } = select( 'core/editor' );

    const clientId 	  = getSelectedBlockClientId();
    const innerBlocks = getBlock( clientId ).innerBlocks;
    
    const images = [];
    if ( innerBlocks.length ) {
		$.each( innerBlocks, ( index, item ) => {

			if ( typeof item.attributes[ 'url' ] != 'undefined' ) {
				images.push( {
					id:  item.attributes.id,
                    url: item.attributes.url,
                    alt: item.attributes.alt
				} );
			}
		} );
    }

    if ( name.endsWith( 'image' ) ) {
        if ( images.length ) {
			return images.map( ( { id, url, alt } ) => createBlock( name, {
				id,
				url,
				alt
			} ) );
		}
		return createBlock( name, { } );
    } else {
        return createBlock( name, {
            imageSize: attributes.imageSize,
            images: images.length ? images.map( ( { id, url, alt } ) => ( {
                id,
                url,
                alt
            } ) ) : [],
            ids: images.map( ( { id } ) => id )
        } );
    }
}