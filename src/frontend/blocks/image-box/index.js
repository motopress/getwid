( function($){
	$( document ).ready( function(e) {

		$( '.getwid-animation.wp-block-getwid-image-box' ).mouseenter( function() {
			getwid_animate( $( this ).find( '.wp-block-getwid-image-box__image-wrapper' ), {
				animation: $( this ).attr( 'data-animation' )
			} );
		} );

	} );
} )( jQuery );