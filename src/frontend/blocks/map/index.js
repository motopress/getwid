import stylesArr from 'GetwidUtils/map-styles';
import {addScript} from 'GetwidUtils/help-functions';
import { escape, unescape} from 'lodash';

(function($){
	$(document).ready(function(e){

		var getwid_maps = $('.wp-block-getwid-map');

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
		
			getwid_maps.each(function(index){

				var getwid_map = $(this);

				//No JS check			
				getwid_map.find('.wp-block-getwid-map__points').remove();

				var getwid_map_container = getwid_map.find('.wp-block-getwid-map__container')[0];
				var mapCenter, mapZoom, interaction, mapStyle, customStyle, zoomControl, mapTypeControl, streetViewControl, fullscreenControl, mapMarkers;

					mapCenter = getwid_map.data('map-center');
					mapZoom = getwid_map.data('map-zoom');
					interaction = getwid_map.data('interaction');
					mapStyle = getwid_map.data('map-style');
					customStyle = getwid_map.data('custom-style');
					zoomControl = getwid_map.data('zoom-control');
					mapTypeControl = getwid_map.data('type-control');
					streetViewControl = getwid_map.data('street-view-control');
					fullscreenControl = getwid_map.data('full-screen-control');
					mapMarkers = getwid_map.data('map-markers');

				//Clear attributes
				$(getwid_map).removeAllAttributes();

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
					mapMarkers,
				};
				
				const googleMap = new google.maps.Map(getwid_map_container, {
					center: mapCenter,
					styles: mapStyles(mapData),
					gestureHandling: interaction,
					zoomControl: zoomControl,
					mapTypeControl: mapTypeControl,
					streetViewControl: streetViewControl,
					fullscreenControl: fullscreenControl,
					zoom: mapZoom
				});

				if (mapMarkers.length){
					$.each(mapMarkers, function(index, val) {
						initMarkers(mapData, index, googleMap);
					});
				}
			});

		}

		function mapStyles (mapData){
			const {
				mapStyle,
				customStyle
			} = mapData;

			if (typeof mapStyle != 'object'){
				if (mapStyle == 'custom'){
					try {
					    return eval(customStyle)
					} catch (e) {
					    if (e instanceof SyntaxError) {
					        console.error(e.message);
					    } else {
					        throw( e );
					    }
					}
				} else {
					return stylesArr[mapStyle];
				}
			} else {
				return null;
			}
		}

		function initMarkers(mapData, markerID = 0, googleMap = false){
			const {
				mapMarkers
			} = mapData;

			const latLng = mapMarkers[markerID].coords;

			const marker = new google.maps.Marker({
				position: latLng,
				map: googleMap,
				draggable: false,
				animation: google.maps.Animation.DROP,
			});

			if (mapMarkers[markerID].bounce){			
				setTimeout(function(){marker.setAnimation(google.maps.Animation.BOUNCE); }, 2000);
			}

			var message = `
				<div class='getwid-poi-info-window'>
					${unescape(mapMarkers[markerID].description)}
				</div>
			`;

			attachMessage(marker, message, mapMarkers[markerID].popUpOpen, mapMarkers[markerID].popUpMaxWidth);
		}

		function attachMessage(marker, message, opened, maxWidth) {
			const popUp = new google.maps.InfoWindow({
				content: message,
				maxWidth: maxWidth
			});

			if (opened){
				popUp.open(marker.get('map'), marker);
			}

			google.maps.event.clearInstanceListeners(marker);
			marker.addListener('click', function() {
				popUp.open(marker.get('map'), marker);
			});
		}

	});
})(jQuery);