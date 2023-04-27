/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import { isEqual } from 'lodash';
import classnames from 'classnames';

/**
* WordPress dependencies
*/
const { isBlobURL } = wp.blob;
const { withSelect } = wp.data;

const { Component, Fragment } = wp.element;
const { Spinner } = wp.components;

/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-images-slider';

/**
* Create an Sub Component
*/
class MediaContainer extends Component {

	render() {

		const { image } = this.props;

		return (
			<Fragment>
				<figure>
					<img
						className={`${baseClass}__image`}
						src={image.url}
						alt={image.alt}
						data-custom-link={image.custom_link ? image.custom_link : undefined}
						data-link-target={image.custom_link_target ? image.custom_link_target : undefined}
						data-link-rel={image.custom_link_rel ? image.custom_link_rel : undefined}
						data-original-link={image.original_url ? image.original_url : undefined}
						data-id={image.id}
						tabIndex='0'
					/>
					{ image.caption && (
						<figcaption className={classnames(
							`${baseClass}_item-caption`,
						)}>{
							image.caption
						}</figcaption>
					)}
				</figure>
				{ isBlobURL( image.url ) && <Spinner/> }
			</Fragment>
		);

	}
}

export default MediaContainer;
