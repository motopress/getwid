import classnames from 'classnames';
import times from 'lodash/times';
import './editor.scss'
import './style.scss'

const {
	Component,
	Fragment,
} = wp.element;
const {
	InnerBlocks,
	RichText,
} = wp.editor;

class Save extends Component {
	stripStringRender( string ) {
		return string.toLowerCase().replace( /[^0-9a-z-]/g,'' );
	}
	render() {
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
				markersArrays,
			}
		} = this.props;
		const className = 'wp-block-getwid-map';

		const markersArraysParsed = (markersArrays != '' ? JSON.parse(markersArrays) : []);

		const wrapperClasses = classnames(
			className,
			`${className}`,
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

		const mapMarkers = {
			'data-map-markers' : markersArrays,
		};

		const markersPoints = ( index ) => {
			if (typeof markersArraysParsed[ index ] !== 'undefined') {

				return (
					<Fragment>
						<li><a href={`https://www.google.com/maps/search/?api=1&query=${markersArraysParsed[ index ].coords.lat},${markersArraysParsed[ index ].coords.lng}`}>{`${markersArraysParsed[ index ].description}`}</a></li>
					</Fragment>
				);
			}
		};

		return (
			<Fragment>
				<div {...mapData} {...mapOptions} {...mapControls} {...mapMarkers} className={wrapperClasses}>
					<div style={{height: mapHeight + 'px'}} className={`${className}__container`}></div>

						{markersArraysParsed.length && (
							<Fragment>
								<ul className={`${className}__points`}>
									{ times( markersArraysParsed.length, n => markersPoints( n ) ) }
								</ul>
							</Fragment>
						)}
					
				</div>
			</Fragment>
		);
	}
}
export default Save;