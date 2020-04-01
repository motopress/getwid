( function($) {
	$(document).ready( event => {


		const getwid_maps = $( '.wp-block-getwid-map' );

		if ( typeof google != 'undefined' ) {
			getwid_maps.each( (index, item) => {

				//No JS check
				$( item ).find( '.wp-block-getwid-map__points' ).remove();

				const getwid_map_container = $( item ).find( '.wp-block-getwid-map__container' )[ 0 ];

				const mapCenter  = $( item ).data( 'map-center'  );
				const mapMarkers = $( item ).data( 'map-markers' );
				const mapZoom    = $( item ).data( 'map-zoom'    );
				const mapStyle   = $( item ).data( 'map-style'   );

				const customStyle    = $( item ).data( 'custom-style' );
				const zoomControl    = $( item ).data( 'zoom-control' );
				const mapTypeControl = $( item ).data( 'type-control' );
				const interaction    = $( item ).data( 'interaction'  );

				const streetViewControl = $( item ).data( 'street-view-control' );
				const fullscreenControl = $( item ).data( 'full-screen-control' );

				//Clear attributes
				removeAllAttributes( $( item ) );

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

				if ( typeof mapMarkers != 'undefined' ) {
					if ( mapMarkers.length ) {
						$.each( mapMarkers, (index, item) => {
							initMarkers( mapData, index, googleMap );
						} );
					}
				}
			} );
		} else {
			if ( getwid_maps.length ) {
				getwid_maps.each( (index, item) => {
					const getwid_map = $( item );
					getwid_map.find( '.wp-block-getwid-map__container' ).remove();
					$( getwid_map ).prepend( '<iframe src="https://www.google.com/maps/embed" style="border:0;" allowfullscreen="" width="100%" height="400px" frameborder="0"></iframe>' );
				} );
			}
		}

		function removeAllAttributes($element) {
			var attributes = $.map( $element[ 0 ].attributes, function (item) {
				return item.name;
			} );

			$.each( attributes, function (i, item) {
				if ( item != 'class' ) {
					$element.removeAttr( item );
				}
			} );
		}

		function mapStyles (mapData) {
			const {
				mapStyle,
				customStyle
			} = mapData;

			if ( typeof mapStyle != 'object' ) {
				if ( mapStyle != 'default'){
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
						${_unescape( mapMarkers[ markerID ].description )}
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
