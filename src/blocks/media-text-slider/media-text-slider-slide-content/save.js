/**
* External dependencies
*/
import './style.scss';
import { noop } from 'lodash';


/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {
	InnerBlocks,
} = wp.editor;
const {
	Component,
} = wp.element;
const $ = window.jQuery;


/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-media-text-slider-slide-content';


/**
* Component Output
*/
class Save extends Component {

	render() {
		const {
			attributes: {
				mediaAlt,
				mediaType,
				mediaUrl,
				mediaWidth,
				mediaId,
				innerParent,

				className
			}
		} = this.props;

		const mediaTypeRenders = {
			image: () => <img src={ mediaUrl } alt={ mediaAlt } className={ `${baseClass}__image` + (( mediaId && mediaType === 'image' ) ? ` wp-image-${ mediaId }` : null) } />,
			video: () => <video controls src={ mediaUrl } />,
		};

		const overlayStyle = {
			backgroundColor : (typeof innerParent != 'undefined' && typeof innerParent.attributes.overlayColor != 'undefined' ? innerParent.attributes.overlayColor : null),
			opacity : (typeof innerParent != 'undefined' && typeof innerParent.attributes.overlayOpacity != 'undefined' ? innerParent.attributes.overlayOpacity / 100 : null)
		};

		const wrapperStyle = {
			maxWidth : (typeof innerParent != 'undefined' && typeof innerParent.attributes.contentMaxWidth != 'undefined' ? innerParent.attributes.contentMaxWidth : null),				
		};

		const contentStyle = {
			color : (typeof innerParent != 'undefined' && typeof innerParent.attributes.textColor != 'undefined' ? innerParent.attributes.textColor : null),				
		};

		return (
			<div style={wrapperStyle} className={ className }>
				<figure className={`${className}__media`} >
					{ ( mediaTypeRenders[ mediaType ] || noop )() }
					<div style={overlayStyle} className={`${className}__media-overlay`}></div>				
				</figure>
				<div style={contentStyle} className={`${className}__content`}>
					<div className={`${className}__content-wrapper`}>
						<InnerBlocks.Content />
					</div>
				</div>
			</div>
		);
	}
}

export default ( Save );