/**
* Internal dependencies
*/
import './style.scss';

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import { noop } from 'lodash';

const { InnerBlocks } = wp.editor;
const { Component } = wp.element;

/**
* Create an Component
*/
class Save extends Component {

	render() {
		const {
			attributes: {
				mediaAlt,
				mediaType,
				mediaUrl,
				mediaId,
				innerParent
			},
			baseClass
		} = this.props;

		const mediaTypeRenders = {
			image: () => <img src={ mediaUrl } alt={ mediaAlt } className={ `${baseClass}__image` + ( ( mediaId && mediaType === 'image' ) ? ` wp-image-${ mediaId }` : null ) } />,
			video: () => <video controls src={ mediaUrl } />
		};

		const overlayStyle = {
			backgroundColor : typeof innerParent != 'undefined' && typeof innerParent.attributes.overlayColor != 'undefined' ? innerParent.attributes.overlayColor : null,
			opacity : typeof innerParent != 'undefined' && typeof innerParent.attributes.overlayOpacity != 'undefined' ? innerParent.attributes.overlayOpacity / 100 : null
		};

		const wrapperStyle = {
			maxWidth : typeof innerParent != 'undefined' && typeof innerParent.attributes.contentMaxWidth != 'undefined' ? innerParent.attributes.contentMaxWidth : null,
		};

		const contentStyle = {
			color : typeof innerParent != 'undefined' && typeof innerParent.attributes.textColor != 'undefined' ? innerParent.attributes.textColor : null,
		};

		return (
			<div style={wrapperStyle} className={ baseClass }>
				<figure className={ `${baseClass}__media` } >
					{ ( mediaTypeRenders[ mediaType ] || noop )() }
					<div style={ overlayStyle } className={ `${baseClass}__media-overlay` }></div>				
				</figure>
				<div style={ contentStyle } className={ `${baseClass}__content` }>
					<div className={ `${baseClass}__content-wrapper` }>
						<InnerBlocks.Content />
					</div>
				</div>
			</div>
		);
	}
}

export default ( Save );