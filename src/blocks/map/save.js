import classnames from 'classnames';
// import times from 'lodash/times';
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

		const wrapperClasses = classnames(
			className,
			`${className}`,
			blockAlignment ? `align${ blockAlignment }` : null,
		);

		const mapData = {
			'data-map' : JSON.stringify({...this.props.attributes}),
		};

		return (
			<Fragment>

				<div {...mapData} className={wrapperClasses}>
					<div style={{height: mapHeight + 'px'}} className={`${className}__container`}></div>
				</div>			

			</Fragment>
		);
	}
}
export default Save;