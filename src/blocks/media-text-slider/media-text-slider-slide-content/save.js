import './style.scss';
import { noop } from 'lodash';
import classnames from "classnames";

/**
 * Internal block libraries
 */
const { __ , sprintf } = wp.i18n;

const {
	InnerBlocks,
} = wp.editor;

const {
	Component,
	Fragment,
} = wp.element;

const $ = window.jQuery;

import MediaContainer from './media-container';

/**
 * Constants
 */
const ALLOWED_BLOCKS = [ 'core/button', 'core/paragraph', 'core/heading', 'core/list', 'core/separator' ];
const TEMPLATE = [
	[ 'core/heading', { placeholder: 'Title' } ],
	[ 'core/paragraph', { placeholder: 'Content…' } ],
];

/**
 * Create an Inspector Controls wrapper Component
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
				innerParent
			}
		} = this.props;

		const className = 'wp-block-getwid-media-text-slider-slide-content'

		const mediaTypeRenders = {
			image: () => <img src={ mediaUrl } alt={ mediaAlt } className={ ( mediaId && mediaType === 'image' ) ? `wp-image-${ mediaId }` : null } />,
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