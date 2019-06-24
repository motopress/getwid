/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import { get, isEqual } from 'lodash';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import './editor.scss';
import './editor.scss';

import Inspector from './inspector';
import MediaContainer from './media-container';

/**
* WordPress dependencies
*/
const { InnerBlocks } = wp.editor;
const { withSelect } = wp.data;

const { compose } = wp.compose;
const {Component, Fragment} = wp.element;

const { TextareaControl } = wp.components;

/**
* Create an Component
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
		if ( typeof media.media_type != 'undefined' && media.media_type ) {
			if ( media.media_type === 'image' ) {
				mediaType = 'image';
			} else {
				mediaType = 'video';
			}
		} else {
			mediaType = media.type;
		}

		if ( mediaType === 'image' ) {
			size = (typeof innerParent != 'undefined' && typeof innerParent.attributes.imageSize != 'undefined' ? innerParent.attributes.imageSize : 'full');
			src = get( media, [ 'sizes', size, 'url' ] ) || get( media, [ 'media_details', 'sizes', size, 'source_url' ] ) || media.url;
		}

		setAttributes( {
			mediaAlt: media.alt,
			mediaId: media.id,
			mediaType,
			mediaUrl: src || media.url
		} );
	}

	renderMediaArea() {
		const { attributes, setAttributes } = this.props;
		const { mediaAlt, mediaId, mediaType, mediaUrl, innerParent, caption } = attributes;

		if ( !mediaType ) {
			setAttributes( { mediaType: 'image' } );
		}

		return (
			<MediaContainer
				className="wp-block-getwid-media-text-slider-slide-content__media"
				onSelectMedia={ this.onSelectMedia }
				{ ...{ mediaAlt, mediaId, mediaType, mediaUrl, innerParent, caption } }
			/>
		);
	}

	componentDidUpdate( prevProps, prevState ) {
		const { imgObj } = this.props;

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
			mediaUrl,
			mediaType,
			innerParent,
			caption
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
								
					<div style={contentStyle} className={ `${className}__content` }>
						<div className={`${className}__content-wrapper`}>
							{ mediaUrl && (
									<InnerBlocks
										templateLock={ false }
										template={ [
											[ 'core/heading'  , { placeholder: __( 'Write heading…', 'getwid' ), content: caption } ],
											[ 'core/paragraph', { placeholder: __( 'Write text…'   , 'getwid' ) } ]
										] }
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