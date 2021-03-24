/**
 * External dependencies
 */
import { omit } from 'lodash';

/**
 * WordPress dependencies
 */
import { addFilter } from '@wordpress/hooks';

// Remove Button Width Controls.
function removeGalleryControls( controls, block ) {
	console.log( block );
	if ( 'core/button' == block.props.name ) {
		console.log( controls );

		return omit( controls, [ 'outline' ] );
	}

	return controls;
}

addFilter( 'blocks.registerBlockType', 'remove-button-controls', removeGalleryControls );

addFilter( 'blocks.registerBlockType', 'getwid/button-group', attributes => {
	console.log( 'test' );
	return omit(
		attributes,
		[
			'width',
			'borderRadius',
			'outline',
		]
	);
}, 0 );
