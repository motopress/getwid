/**
* External dependencies
*/
import classnames from 'classnames';
import { times, escape} from 'lodash';
import './editor.scss'
import './style.scss'


/**
* WordPress dependencies
*/
const {
	Component,
	Fragment,
} = wp.element;


/**
* Create an Component
*/
class Save extends Component {
	stripStringRender( string ) {
		return string.toLowerCase().replace( /[^0-9a-z-]/g,'' );
	}
	render() {
		const {
			attributes: {
				getDataFrom,
				userName,
				tagName,
				photoCount,
				displayStyle,
				gridColumns,
				linkTo,
				showLikes,
				showComments,
				blockAlignment,
			}
		} = this.props;
		const className = 'wp-block-getwid-map';

		// const mapMarkersParsed = (mapMarkers != '' ? JSON.parse(mapMarkers) : []);

		const wrapperClasses = classnames(
			className,
			blockAlignment ? `align${ blockAlignment }` : null,
		);

/* 		const mapData = {
			'data-map-zoom' : mapZoom,
			'data-interaction' : interaction,
			'data-map-style' : mapStyle,
			'data-custom-style' : customStyle,
		}; */

/* 		const markersPoints = ( index ) => {
			if (typeof mapMarkersParsed[ index ] !== 'undefined') {

				return (
					<Fragment>
						<li><a href={`https://maps.google.com/?q=${mapMarkersParsed[ index ].coords.lat},${mapMarkersParsed[ index ].coords.lng}&ll=${mapMarkersParsed[ index ].coords.lat},${mapMarkersParsed[ index ].coords.lng}&z=${mapZoom}`}>{`${mapMarkersParsed[ index ].name}`}</a></li>
					</Fragment>
				);
			}
		}; */

{/* <div ...mapData className={wrapperClasses}></div> */}

		return (
			<Fragment>
				<div className={wrapperClasses}>
				{/* 	<div style={{height: (mapHeight + 'px')}} className={`${className}__container`}></div>

						{(mapMarkersParsed.length != 0) && (
							<Fragment>
								<ul className={`${className}__points`}>
									{ times( mapMarkersParsed.length, n => markersPoints( n ) ) }
								</ul>
							</Fragment>
						)} */}
					
				</div>
			</Fragment>
		);
	}
}
export default Save;