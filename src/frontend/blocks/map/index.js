(function($){
	$(document).ready(function(e){


		console.error('ERROR');

		var getwid_maps = $('.wp-block-getwid-map');

		function addScript(src, key)
		{
		    var script = document.createElement("script");
		    script.type = "text/javascript";
		    script.src =  src+key;
		    var done = false;
		    document.getElementsByTagName('head')[0].appendChild(script);
		
		    script.onload = script.onreadystatechange = function() {
		        if ( !done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") )
		        {
		            done = true;
		            script.onload = script.onreadystatechange = null;
		            loaded();
		        }
		    };
		}

		if (((typeof google == 'undefined') || (typeof google.maps == 'undefined')) && getwid_maps.length && Getwid.settings.google_api_key != ''){
			addScript("https://maps.googleapis.com/maps/api/js?key=", Getwid.settings.google_api_key);
		}

		//Google Map API Loaded
		function loaded(){
			
			getwid_maps.each(function(index){

				var getwid_map = $(this);
				var getwid_map_container = getwid_map.find('.wp-block-getwid-map__container')[0];
				var mapCenter, mapZoom, interaction, zoomControl, mapTypeControl, streetViewControl, fullscreenControl, markersArrays;

					mapCenter = getwid_map.data('map-center');
					mapZoom = getwid_map.data('map-zoom');
					interaction = getwid_map.data('interaction');
					zoomControl = getwid_map.data('zoom-control');
					mapTypeControl = getwid_map.data('type-control');
					streetViewControl = getwid_map.data('street-view-control');
					fullscreenControl = getwid_map.data('full-screen-control');
					markersArrays = getwid_map.data('map-markers');

				const mapData = {
					mapCenter,
					mapZoom,
					interaction,
					zoomControl,
					mapTypeControl,
					streetViewControl,
					fullscreenControl,
					markersArrays,
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

				if (markersArrays.length){
					$.each(markersArrays, function(index, val) {
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

			const { google_map_styles : stylesArr } = Getwid.settings;

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
				markersArrays
			} = mapData;

			const latLng = markersArrays[markerID].coords;

			const marker = new google.maps.Marker({
				position: latLng,
				map: googleMap,
				draggable: false,
				animation: google.maps.Animation.DROP,
			});

			if (markersArrays[markerID].bounce){			
				setTimeout(function(){marker.setAnimation(google.maps.Animation.BOUNCE); }, 2000);
			}			

			var message = `
				<div class='poi-info-window gm-style'>
					<div>
						<div class='title full-width'>
							${markersArrays[markerID].title}
						</div>
						<div class='address'>
							<div class='address-line full-width'>${markersArrays[markerID].description}</div>	
						</div>
					</div>
				</div>
			`;

			attachMessage(marker, message, markersArrays[markerID].popUpOpen, markersArrays[markerID].popUpMaxWidth);
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