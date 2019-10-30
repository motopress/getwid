/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;

const { Component, Fragment } = wp.element;
const { IconButton, Toolbar	} = wp.components;
const { BlockControls, MediaPlaceholder, MediaUpload } = wp.blockEditor;

/**
* Module Constants
*/
const ALLOWED_MEDIA_TYPES = [ 'image' ];
const baseClass = 'wp-block-getwid-media-text-slider-slide-content'

/**
* Create an Sub Component
*/
export default class MediaContainer extends Component {
	renderToolbarEditButton() {
		const { mediaId, onSelectMedia } = this.props;
		return (
			<BlockControls>
				<Toolbar>
					<MediaUpload
						onSelect={ onSelectMedia }
						allowedTypes={ ALLOWED_MEDIA_TYPES }
						value={ mediaId }
						render={ ( { open } ) => (
							<IconButton
								className={ 'components-toolbar__control' }
								label={ __( 'Edit Media', 'getwid' ) }
								icon={ 'edit' }
								onClick={ open }
							/>
						) }
					/>
				</Toolbar>
			</BlockControls>
		);
	}

	renderImage() {
		const { mediaAlt, mediaUrl, innerParent, className } = this.props;

		const overlayStyle = {
			backgroundColor : typeof innerParent != 'undefined' && typeof innerParent.attributes.overlayColor   != 'undefined' ? innerParent.attributes.overlayColor 		 : null,
			opacity 		: typeof innerParent != 'undefined' && typeof innerParent.attributes.overlayOpacity != 'undefined' ? innerParent.attributes.overlayOpacity / 100 : null
		};

		return (
			<Fragment>
				{ this.renderToolbarEditButton() }
				<figure className={ className }>
					<img className={ `${baseClass}__image` } src={ mediaUrl } alt={ mediaAlt } />
					<div style={ overlayStyle } className={ `${className}-overlay` }></div>	
				</figure>
			</Fragment>
		);
	}

	renderVideo() {
		const { mediaUrl, className } = this.props;
		return (
			<Fragment>
				{ this.renderToolbarEditButton() }
				<figure className={ className }>
					<video controls src={ mediaUrl } />
				</figure>
			</Fragment>
		);
	}

	renderPlaceholder() {
		const { onSelectMedia, className } = this.props;
		return (
			<MediaPlaceholder
				icon={ 'format-image' }
				labels={ {
					title: __( 'Image', 'getwid' ),
				} }
				accept={ 'image/*' }
				className={ className }
				onSelect={ onSelectMedia }
				allowedTypes={ ALLOWED_MEDIA_TYPES }
			/>
		);
	}

	render() {
		const { mediaUrl, mediaType } = this.props;

		if ( mediaType && mediaUrl ) {

			let mediaElement = null;
			switch ( mediaType ) {
				case 'image':
					mediaElement = this.renderImage();
					break;
				case 'video':
					mediaElement = this.renderVideo();
					break;
			}
			return (
				<Fragment>
					{ mediaElement }
				</Fragment>
			);
		}
		return this.renderPlaceholder();
	}
}