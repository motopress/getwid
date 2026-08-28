import jQuery from 'jquery';

import { parseCustomMapStyle } from './custom-style';
import type {
	GoogleMap,
	GoogleMapsRuntime,
	GoogleMarker,
	MapMarker,
	StylesGlobal,
} from './types';

const runtimeGlobal = window as GoogleMapsRuntime;

function removeAllAttributes( element: JQuery< HTMLElement > ) {
	const attributes = Array.from( element.get( 0 )?.attributes || [] ).map(
		( attribute ) => attribute.name
	);

	attributes.forEach( ( attribute ) => {
		if ( attribute !== 'class' ) {
			element.removeAttr( attribute );
		}
	} );
}

function decodeHtml( value: string ) {
	const textarea = document.createElement( 'textarea' );
	textarea.innerHTML = value;

	return textarea.value;
}

function mapStyles( mapStyle: string, customStyle?: string ) {
	if ( typeof mapStyle !== 'string' ) {
		return null;
	}

	if ( mapStyle === 'custom' ) {
		return parseCustomMapStyle( customStyle );
	}

	if ( mapStyle !== 'default' ) {
		return GetwidGoogleMapStyles[ mapStyle ] || {};
	}

	return undefined;
}

function attachMessage(
	marker: GoogleMarker,
	message: string,
	opened: boolean,
	maxWidth: number | string
) {
	const google = runtimeGlobal.google;

	if ( ! google ) {
		return;
	}

	const popUp = new google.maps.InfoWindow( {
		content: message,
		maxWidth: Number( maxWidth ),
	} );

	if ( opened && popUp.content !== '' ) {
		popUp.open( marker.get( 'map' ), marker );
	}

	google.maps.event.clearInstanceListeners( marker );
	marker.addListener( 'click', () => {
		if ( popUp.content !== '' ) {
			popUp.open( marker.get( 'map' ), marker );
		}
	} );
}

function initMarker(
	mapMarkers: MapMarker[],
	markerId: number,
	googleMap: GoogleMap
) {
	const google = runtimeGlobal.google;
	const markerData = mapMarkers[ markerId ];

	if ( ! google ) {
		return;
	}

	const marker = new google.maps.Marker( {
		position: markerData.coords,
		map: googleMap,
		draggable: false,
		animation: google.maps.Animation.DROP,
	} );

	if ( markerData.bounce ) {
		setTimeout(
			() => marker.setAnimation( google.maps.Animation.BOUNCE ),
			2000
		);
	}

	const message =
		decodeHtml( markerData.description ) !== ''
			? `
				<div class='getwid-poi-info-window'>
					${ decodeHtml( markerData.description ) }
				</div>
			`
			: '';

	attachMessage(
		marker,
		message,
		markerData.popUpOpen,
		markerData.popUpMaxWidth
	);
}

function initMaps() {
	const maps = jQuery( '.wp-block-getwid-map:not(.getwid-init)' );

	if ( typeof runtimeGlobal.google !== 'undefined' ) {
		maps.each( ( _index, item ) => {
			const google = runtimeGlobal.google;
			const mapRoot = jQuery( item );
			const mapContainer = mapRoot
				.find( '.wp-block-getwid-map__container' )
				.get( 0 );

			if ( ! google || ! mapContainer ) {
				return;
			}

			mapRoot.addClass( 'getwid-init' );
			mapRoot.find( '.wp-block-getwid-map__points' ).remove();

			const mapCenter = mapRoot.data( 'map-center' );
			const mapMarkers = ( mapRoot.data( 'map-markers' ) ||
				[] ) as MapMarker[];
			const mapZoom = mapRoot.data( 'map-zoom' );
			const mapStyle = mapRoot.data( 'map-style' );
			const customStyle = mapRoot.data( 'custom-style' );
			const zoomControl = mapRoot.data( 'zoom-control' );
			const mapTypeControl = mapRoot.data( 'type-control' );
			const interaction = mapRoot.data( 'interaction' );
			const streetViewControl = mapRoot.data( 'street-view-control' );
			const fullscreenControl = mapRoot.data( 'full-screen-control' );

			removeAllAttributes( mapRoot );

			const googleMap = new google.maps.Map( mapContainer, {
				center: mapCenter,
				styles: mapStyles( mapStyle, customStyle ),
				gestureHandling: interaction,
				zoomControl,
				mapTypeControl,
				streetViewControl,
				fullscreenControl,
				zoom: mapZoom,
			} );

			if ( mapMarkers.length ) {
				mapMarkers.forEach( ( _marker, markerId ) => {
					initMarker( mapMarkers, markerId, googleMap );
				} );
			}
		} );
		return;
	}

	if ( maps.length ) {
		maps.each( ( _index, item ) => {
			const mapRoot = jQuery( item );

			mapRoot.find( '.wp-block-getwid-map__container' ).remove();
			mapRoot.prepend(
				'<iframe loading="lazy" src="https://www.google.com/maps/embed" style="border:0;" allowfullscreen="" width="100%" height="400px" frameborder="0"></iframe>'
			);
		} );
	}
}

jQuery( () => {
	jQuery( document.body ).on( 'post-load', initMaps );
	initMaps();
} );
