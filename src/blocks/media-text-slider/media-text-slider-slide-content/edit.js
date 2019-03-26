import { get, isEqual } from 'lodash';
import classnames from 'classnames';
import animate from 'GetwidUtils/animate';
import './editor.scss';
import Inspector from './inspector';

/**
 * Internal block libraries
 */
const {__} = wp.i18n;

const {
	BlockControls,
	InnerBlocks,
	InspectorControls,
	PanelColorSettings,
	withColors,
} = wp.editor;

const {
	withSelect
} = wp.data;

const { compose } = wp.compose;

const {Component, Fragment} = wp.element;

const {
	PanelBody,
	TextareaControl,
	ToggleControl,
	Toolbar,
} = wp.components;

const $ = window.jQuery;

import MediaContainer from './media-container';

/**
 * Constants
 */
const TEMPLATE = [
	[ 'core/heading', { placeholder: __('Write heading…', 'getwid') } ],
	[ 'core/paragraph', { placeholder: __('Write text…', 'getwid') } ],
];

/**
 * Create an Inspector Controls wrapper Component
 */
class Edit extends Component {

	constructor() {
		super( ...arguments );

		this.onSelectMedia = this.onSelectMedia.bind( this );
	}

	onSelectMedia( media ) {
		const {
			attributes:{
				innerParent
			},
			setAttributes
		} = this.props;

		let mediaType;
		let src;
		let size;

		if (!media) return;
		// for media selections originated from a file upload.
		if ( typeof media.media_type != 'undefined' && media.media_type ) {
			if ( media.media_type === 'image' ) {
				mediaType = 'image';
			} else {
				// only images and videos are accepted so if the media_type is not an image we can assume it is a video.
				// video contain the media type of 'file' in the object returned from the rest api.
				mediaType = 'video';
			}
		} else { // for media selections originated from existing files in the media library.
			mediaType = media.type;
		}

		if ( mediaType === 'image' ) {
			// Try the "large" size URL, falling back to the "full" size URL below.
			size = (typeof innerParent != 'undefined' && typeof innerParent.attributes.imageSize != 'undefined' ? innerParent.attributes.imageSize : 'full');
			src = get( media, [ 'sizes', size, 'url' ] ) || get( media, [ 'media_details', 'sizes', size, 'source_url' ] ) || media.url;
		}

		setAttributes( {
			mediaAlt: media.alt,
			mediaId: media.id,
			mediaType,
			mediaUrl: src || media.url,
		} );
	}

	renderMediaArea() {
		const { attributes } = this.props;
		const { mediaAlt, mediaId, mediaType, mediaUrl, innerParent } = attributes;

		return (
			<MediaContainer
				className="wp-block-getwid-media-text-slider-slide-content__media"
				onSelectMedia={ this.onSelectMedia }
				{ ...{ mediaAlt, mediaId, mediaType, mediaUrl, innerParent } }
			/>
		);
	}

	componentDidUpdate( prevProps, prevState ) {
		const {
			attributes : {
				mediaId
			},
			imgObj,
			setState
		} = this.props;

		//Change Image Size
		if (typeof prevProps.attributes.innerParent != 'undefined' && typeof prevProps.attributes.innerParent.attributes.imageSize != 'undefined'){
			if (!isEqual(prevProps.attributes.innerParent.attributes.imageSize, this.props.attributes.innerParent.attributes.imageSize)){
				if (typeof imgObj != 'undefined'){
					this.onSelectMedia( imgObj );
				}
			}
		}
	}

	render() {
		const {
			attributes,
			className,
			isSelected,
			setAttributes,
		} = this.props;
		const {
			mediaAlt,
			mediaId,
			mediaUrl,
			mediaType,
			innerParent
		} = attributes;
		const classNames = classnames( className, {
			'is-selected': isSelected,		
		} );

		const onMediaAltChange = ( newMediaAlt ) => {
			setAttributes( { mediaAlt: newMediaAlt } );
		};
		const mediaTextGeneralSettings = (
			<Fragment>
				{ mediaType === 'image' && ( <TextareaControl
					value={ mediaAlt }
					onChange={ onMediaAltChange }
				/> ) }
			</Fragment>
		);

		const contentStyle = {
			color : (typeof innerParent != 'undefined' && typeof innerParent.attributes.textColor != 'undefined' ? innerParent.attributes.textColor : null),				
		};

		return (
			<Fragment>
				<Inspector {...{ ...this.props, ...{setAttributes}, ...{onSelectMedia : this.onSelectMedia} }} key='inspector'/>

				<div className={ classNames } >
					{ this.renderMediaArea() }
								
					<div style={contentStyle} className={`${className}__content`}>
						<div className={`${className}__content-wrapper`}>
							{ mediaUrl &&
								(
									<InnerBlocks
										templateLock={ false }
										template={ TEMPLATE }
										templateInsertUpdatesSelection={ false }
									/>
								)
							}
						</div>
					</div>
				</div>
			
			</Fragment>
		);
	}

}

//Get Img object from Data
export default compose( [
	withSelect( ( select, props ) => {
		const { getMedia } = select( 'core' );
		const { mediaId } = props.attributes;
		return {
			imgObj: mediaId ? getMedia( mediaId ) : null,
		};
	} ),
] )( Edit );
