import $ from 'jquery';

type FancyboxElement = JQuery< HTMLElement > & {
	mpFancybox?: ( options: { baseClass: string } ) => void;
};

function initVideoPopup() {
	$( '.wp-block-getwid-video-popup:not(.getwid-init)' ).each( function () {
		const videoPopup = $( this );

		videoPopup.addClass( 'getwid-init' );

		const link = videoPopup.find(
			'.wp-block-getwid-video-popup__link'
		) as FancyboxElement;

		if ( typeof link.mpFancybox === 'function' ) {
			link.mpFancybox( {
				baseClass: 'getwid-video-popup',
			} );
		}
	} );
}

$( () => {
	$( document.body ).on( 'post-load', initVideoPopup );
	initVideoPopup();
} );
