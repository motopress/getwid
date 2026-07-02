import jQuery from 'jquery';

function initAccordions() {
	const accordions = jQuery( '.wp-block-getwid-accordion:not(.getwid-init)' );

	accordions.each( ( _index, accordion ) => {
		const $accordion = jQuery( accordion );
		$accordion.addClass( 'getwid-init' );

		const activeElement = $accordion.data( 'active-element' );
		const active =
			activeElement !== 'none'
				? Number.parseInt( String( activeElement ), 10 )
				: false;

		$accordion.accordion( {
			icons: false,
			animate: false,
			collapsible: true,
			active,
			heightStyle: 'content',
			activate: ( _event, ui ) => {
				if ( ui.newPanel.length ) {
					const newPanelHeight = ui.newPanel
						.find( '.wp-block-getwid-accordion__content' )
						.outerHeight( true );

					if ( newPanelHeight ) {
						jQuery( ui.newPanel ).animate(
							{
								height: newPanelHeight,
							},
							{
								queue: false,
								duration: 500,
								complete() {
									jQuery( this ).css( 'height', '' );
								},
							}
						);
					}
				}

				if ( ui.oldPanel.length ) {
					const oldPanelHeight = ui.oldPanel
						.find( '.wp-block-getwid-accordion__content' )
						.outerHeight( true );

					if ( oldPanelHeight ) {
						jQuery( ui.oldPanel ).css( 'height', oldPanelHeight );
						jQuery( ui.oldPanel ).animate(
							{
								height: 0,
							},
							{
								queue: false,
								duration: 500,
								complete() {
									jQuery( this ).css( 'height', '' );
								},
							}
						);
					}
				}
			},
		} );
	} );
}

jQuery( document ).ready( () => {
	jQuery( document.body ).on( 'post-load', () => {
		initAccordions();
	} );

	initAccordions();
} );
