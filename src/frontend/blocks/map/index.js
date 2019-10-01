//import stylesArr from 'GetwidUtils/map-styles';
import {addScript} from 'GetwidUtils/help-functions';
//import { escape, unescape} from 'lodash';

( function($) {
	$(document).ready( event => {

		const getwid_maps = $( '.wp-block-getwid-map' );

		if (((typeof google == 'undefined') || (typeof google.maps == 'undefined')) && getwid_maps.length && Getwid.settings.google_api_key != ''){
			addScript("https://maps.googleapis.com/maps/api/js?key="+Getwid.settings.google_api_key, loaded);
		} else {
			if (getwid_maps.length){
				getwid_maps.each(function(index){
					var getwid_map = $(this);
					getwid_map.find('.wp-block-getwid-map__container').css('height', '');
				});
			}
		}

		//Google Map API Loaded
		function loaded(){
		
			getwid_maps.each( (index, item) => {

				const getwid_map = $( item );

				//No JS check			
				getwid_map.find( '.wp-block-getwid-map__points' ).remove();

				const getwid_map_container = getwid_map.find( '.wp-block-getwid-map__container' )[ 0 ];

				const mapCenter  = getwid_map.data( 'map-center'  );
				const mapMarkers = getwid_map.data( 'map-markers' );
				const mapZoom    = getwid_map.data( 'map-zoom'    );
				const mapStyle   = getwid_map.data( 'map-style'   );

				const customStyle    = getwid_map.data( 'custom-style' );
				const zoomControl    = getwid_map.data( 'zoom-control' );
				const mapTypeControl = getwid_map.data( 'type-control' );
				const interaction    = getwid_map.data( 'interaction'  );

				const streetViewControl = getwid_map.data( 'street-view-control' );
				const fullscreenControl = getwid_map.data( 'full-screen-control' );
					
				//Clear attributes
				$( getwid_map ).removeAllAttributes();

				const mapData = {
					mapCenter,
					mapZoom,
					interaction,
					mapStyle,
					customStyle,
					zoomControl,
					mapTypeControl,
					streetViewControl,
					fullscreenControl,
					mapMarkers
				};
				
				const googleMap = new google.maps.Map( getwid_map_container, {
					center: mapCenter,
					styles: mapStyles(mapData),
					gestureHandling: interaction,
					zoomControl: zoomControl,
					mapTypeControl: mapTypeControl,
					streetViewControl: streetViewControl,
					fullscreenControl: fullscreenControl,
					zoom: mapZoom
				} );

				if ( mapMarkers.length ) {
					$.each( mapMarkers, (index, item) => {
						initMarkers( mapData, index, googleMap );
					} );
				}
			});
		}

		function mapStyles (mapData){
			const {
				mapStyle,
				customStyle
			} = mapData;

			if ( typeof mapStyle != 'object' ) {
				if ( mapStyle == 'custom' ) {
					try {
					    return eval( customStyle )
					} catch ( event ) {
					    if ( event instanceof SyntaxError ) {
					        console.error( event.message );
					    } else {
					        throw( event );
					    }
					}
				} else {
					return stylesArr[ mapStyle ];
				}
			} else {
				return null;
			}
		}

		function initMarkers(mapData, markerID = 0, googleMap = false) {
			const {
				mapMarkers
			} = mapData;

			const latLng = mapMarkers[markerID].coords;

			const marker = new google.maps.Marker( {
				position: latLng,
				map: googleMap,
				draggable: false,
				animation: google.maps.Animation.DROP,
			} );

			if ( mapMarkers[ markerID ].bounce ) {			
				setTimeout( () => marker.setAnimation(google.maps.Animation.BOUNCE), 2000 );
			}

			let message = '';

			if ( unescape( mapMarkers[ markerID ].description ) != '' ) {
				message = `
					<div class='getwid-poi-info-window'>
						${unescape( mapMarkers[ markerID ].description )}
					</div>
				`;
			}

			attachMessage( marker, message, mapMarkers[ markerID ].popUpOpen, mapMarkers[ markerID ].popUpMaxWidth );
		}

		function attachMessage(marker, message, opened, maxWidth) {
			const popUp = new google.maps.InfoWindow( {
				content: message,
				maxWidth: maxWidth
			} );

			if ( opened ) {
				if ( popUp.content !='' ) {
					popUp.open( marker.get( 'map' ), marker );
				}
			}

			google.maps.event.clearInstanceListeners( marker );
			marker.addListener('click', () => {
				if ( popUp.content != '' ) {
					popUp.open( marker.get( 'map' ), marker );
				}
			} );
		}
	} );
} )( jQuery );