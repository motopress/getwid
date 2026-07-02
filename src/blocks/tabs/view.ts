import $ from 'jquery';

type TabsUi = {
	newPanel: JQuery< HTMLElement >;
};

type TabsElement = JQuery< HTMLElement > & {
	tabs: ( options: {
		active: number;
		activate: ( event: JQuery.Event, ui: TabsUi ) => void;
	} ) => void;
};

function makeTabId( length: number ) {
	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let result = '';

	for ( let index = 0; index < length; index++ ) {
		result += characters.charAt(
			Math.floor( Math.random() * characters.length )
		);
	}

	return result;
}

function initTabs() {
	$( '.wp-block-getwid-tabs:not(.getwid-init)' ).each( function () {
		const tabs = $( this );
		const tabId = makeTabId( 5 );
		const active = Number.parseInt(
			String( tabs.data( 'active-tab' ) ?? 0 ),
			10
		);

		tabs.addClass( 'getwid-init' );
		tabs.find( '.wp-block-getwid-tabs__nav-link' ).each(
			function ( index ) {
				$( this )
					.find( 'a' )
					.attr( 'href', `#tab-${ tabId }-${ index }` );
			}
		);
		tabs.find(
			'.wp-block-getwid-tabs__tab-content-wrapper, > .wp-block-getwid-tabs__tab-content'
		).each( function ( index ) {
			$( this ).attr( 'id', `tab-${ tabId }-${ index }` );
		} );

		tabs.find( '.wp-block-getwid-tabs__nav-link' ).each( function () {
			const navLink = $( this );
			const navLinks = navLink
				.closest( '.wp-block-getwid-tabs' )
				.find( '> .wp-block-getwid-tabs__nav-links' );
			const attributes: Record< string, string > = {};

			Array.from( this.attributes ).forEach( ( attribute ) => {
				attributes[ attribute.nodeName ] = attribute.nodeValue ?? '';
			} );

			navLink.detach();
			navLinks.append( navLink );
			navLink.replaceWith( () =>
				$( '<li/>', attributes ).append( navLink.contents() )
			);
		} );

		tabs.find( '.wp-block-getwid-tabs__tab-content-wrapper' )
			.eq( active )
			.addClass( 'is-active-tab' );

		( tabs as TabsElement ).tabs( {
			active,
			activate: ( _event, ui ) => {
				ui.newPanel
					.closest( '.wp-block-getwid-tabs' )
					.find( '.wp-block-getwid-tabs__tab-content-wrapper' )
					.removeClass( 'is-active-tab' );
				ui.newPanel.addClass( 'is-active-tab' );
				$( 'html, body' ).add( window ).add( document ).stop();
			},
		} );
	} );
}

$( () => {
	$( document.body ).on( 'post-load', initTabs );
	initTabs();
} );
