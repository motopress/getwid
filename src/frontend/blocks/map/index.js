(function($){
	$(document).ready(function(e){

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
				var mapData = getwid_map.data('map');

				const {
					mapCenter,
					mapZoom,
					interaction,
					zoomControl,
					mapTypeControl,
					streetViewControl,
					fullscreenControl,
					markersArrays,
				} = mapData;
				
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

				googleMap.panTo(mapCenter);

				console.log(getwid_map);
				console.warn(mapData);
				console.error(Getwid);
			});

		}

		function mapStyles (mapData){
			const {
				mapStyle,
				customStyle
			} = mapData;

			const { google_map_styles : stylesArr } = Getwid.settings;

			if (typeof mapStyle != 'object'){
				if (JSON.parse(mapStyle).value == 'custom'){
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
					return stylesArr[JSON.parse(mapStyle).value];
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
				uuID : markersArrays[markerID].uuID,
				position: latLng,
				map: googleMap,
				draggable: false,
			});

			var message = `<div class='wp-block-getwid-map__marker-title'>
				<h2>${markersArrays[markerID].title}</h2>
				<div class='wp-block-getwid-map__marker-description'>${markersArrays[markerID].description}</div>
			</div>`;

			attachMessage(marker, message, markersArrays[markerID].popUpOpen);
		}

		function attachMessage(marker, message, opened) {
			const popUp = new google.maps.InfoWindow({
				content: message,
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