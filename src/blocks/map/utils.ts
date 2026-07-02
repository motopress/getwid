import { parseCustomMapStyle } from './custom-style';
import type { MapAttributes, MapMarker, StylesGlobal } from './types';

export function parseMapMarkers( mapMarkers?: string ): MapMarker[] {
	if ( ! mapMarkers ) {
		return [];
	}

	try {
		const parsed = JSON.parse( mapMarkers );

		return Array.isArray( parsed ) ? parsed : [];
	} catch ( error ) {
		return [];
	}
}

function normalizeUndefinedValues< T >( value: T ): T {
	if ( Array.isArray( value ) ) {
		return value.map( normalizeUndefinedValues ) as T;
	}

	if ( value !== null && typeof value === 'object' ) {
		return Object.fromEntries(
			Object.entries( value ).map( ( [ key, item ] ) => [
				key,
				normalizeUndefinedValues( item ),
			] )
		) as T;
	}

	return ( typeof value === 'undefined' ? '' : value ) as T;
}

export function updateMarkerAt(
	markers: MapMarker[],
	index: number,
	value: Partial< MapMarker >
) {
	const normalizedValue = normalizeUndefinedValues( value );

	return markers.map( ( marker, markerIndex ) =>
		index === markerIndex
			? {
					...marker,
					...normalizedValue,
					coords: {
						...marker.coords,
						...normalizedValue.coords,
					},
			  }
			: marker
	);
}

export function getMapStyles( mapStyle: string, customStyle?: string ) {
	if ( typeof mapStyle !== 'string' ) {
		return null;
	}

	if ( mapStyle === 'custom' ) {
		return parseCustomMapStyle( customStyle );
	}

	if ( mapStyle !== 'default' ) {
		const stylesArr = ( window as StylesGlobal ).stylesArr || {};

		return stylesArr[ mapStyle ];
	}

	return undefined;
}

export function getMapDataAttributes( attributes: MapAttributes ) {
	const {
		mapCenter,
		mapZoom,
		interaction,
		zoomControl,
		mapTypeControl,
		streetViewControl,
		fullscreenControl,
		mapStyle,
		customStyle,
		mapMarkers,
	} = attributes;
	const markers = parseMapMarkers( mapMarkers );

	return {
		'data-map-zoom': mapZoom,
		'data-interaction': interaction,
		'data-map-style': mapStyle,
		'data-custom-style': customStyle,
		'data-map-center': JSON.stringify( mapCenter ),
		'data-zoom-control': zoomControl,
		'data-type-control': mapTypeControl,
		'data-street-view-control': streetViewControl,
		'data-full-screen-control': fullscreenControl,
		'data-map-markers': JSON.stringify( markers ),
	};
}
