import $ from 'jquery';

function initToggle() {
	$( '.wp-block-getwid-toggle:not(.getwid-init)' ).each( function () {
		const toggle = $( this );

		toggle.addClass( 'getwid-init' );
		toggle
			.find(
				'.wp-block-getwid-toggle__row .wp-block-getwid-toggle__header-wrapper'
			)
			.on( 'click', function ( event ) {
				event.preventDefault();
				event.stopImmediatePropagation();

				const row = $( this ).parent();
				const contentWrapper = row
					.find( '.wp-block-getwid-toggle__content-wrapper' )
					.first();
				const contentHeight =
					row
						.find( '.wp-block-getwid-toggle__content' )
						.first()
						.outerHeight( true ) ?? 0;

				if ( row.hasClass( 'is-active' ) ) {
					row.removeClass( 'is-active' );
					contentWrapper.css( 'height', contentHeight );
					contentWrapper.animate(
						{ height: 0 },
						{
							queue: false,
							duration: 500,
							complete() {
								$( this ).css( 'height', '' );
							},
						}
					);
				} else {
					contentWrapper.animate(
						{ height: contentHeight },
						{
							queue: false,
							duration: 500,
							complete() {
								$( this ).css( 'height', '' );
							},
						}
					);
					row.addClass( 'is-active' );
				}
			} );
	} );
}

$( () => {
	$( document.body ).on( 'post-load', initToggle );
	initToggle();
} );
