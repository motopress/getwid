import classnames from 'classnames';
import attributes from './attributes';
import { times, escape} from 'lodash';

const v1 = {
	attributes,
	save: (props) => {
		const {
			attributes: {
				mapHeight,
				mapCenter,
				mapZoom,
				interaction,
				zoomControl,
				mapTypeControl,
				streetViewControl,
				fullscreenControl,
				mapStyle,
				customStyle,
				blockAlignment,
				mapMarkers,
				className,
			}
		} = props;

		const mapMarkersParsed = (mapMarkers != '' ? JSON.parse(mapMarkers) : []);

		const wrapperClass = classnames(
			"wp-block-getwid-map",
			className,
			blockAlignment ? `align${ blockAlignment }` : null,
		);

		const mapData = {
			'data-map-zoom' : mapZoom,
			'data-interaction' : interaction,
			'data-map-style' : mapStyle,
			'data-custom-style' : customStyle,
		};

		const mapOptions = {
			'data-map-center' : JSON.stringify(mapCenter),
		};

		const mapControls = {
			'data-zoom-control' : zoomControl,
			'data-type-control' : mapTypeControl,
			'data-street-view-control' : streetViewControl,
			'data-full-screen-control' : fullscreenControl,
		};

		const mapMarkerArr = {
			'data-map-markers' : escape(mapMarkers),
		};

		const markersPoints = ( index ) => {
			if (typeof mapMarkersParsed[ index ] !== 'undefined') {
				return (
					<li key={ index }><a href={`https://maps.google.com/?q=${mapMarkersParsed[ index ].coords.lat},${mapMarkersParsed[ index ].coords.lng}&ll=${mapMarkersParsed[ index ].coords.lat},${mapMarkersParsed[ index ].coords.lng}&z=${mapZoom}`}>{`${mapMarkersParsed[ index ].name}`}</a></li>
				);
			}
		};

		return (
			<div {...mapData} {...mapOptions} {...mapControls} {...mapMarkerArr} className={wrapperClass}>
				<div style={{height: (mapHeight + 'px')}} className="wp-block-getwid-map__container"></div>
					{(mapMarkersParsed.length != 0) && (
						<ul className="wp-block-getwid-map__points">
							{ times( mapMarkersParsed.length, n => markersPoints( n ) ) }
						</ul>
					)}
			</div>
		);
	}
}

export default [ v1 ];
