/**
 * Internal dependencies
 */
import Inspector from './inspector';
import MediaContainer from './media-container';

import './editor.scss';
import './editor.scss';

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
import classnames from 'classnames';
import { get, isEqual } from 'lodash';

const { withSelect } = wp.data;
const { compose } = wp.compose;
const { InnerBlocks } = wp.editor;

const {Component, Fragment} = wp.element;
const { TextareaControl } = wp.components;

const { dispatch } = wp.data;

/**
* Module Constants
*/
const TEMPLATE = [
	[ 'core/heading'  , { placeholder: __('Write heading…', 'getwid') } ],
	[ 'core/paragraph', { placeholder: __('Write text…'   , 'getwid') } ]
];

/**
* Create an Component
*/
class Edit extends Component {

	constructor() {
		super( ...arguments );

		this.onSelectMedia = this.onSelectMedia.bind( this );

		this.state = {
			someState: false
		};
	}

	onSelectMedia( media, getUrl = false, quality = '' ) {
		const { innerParent } = this.props.attributes;
		const { setAttributes } = this.props;

		let mediaType, src, size;

		if ( ! media) return;
		if ( typeof media.media_type != 'undefined' && media.media_type ) {
			mediaType = ( media.media_type === 'image' ) ? 'image' : 'video';
		} else {
			mediaType = media.type;
		}

		if ( mediaType === 'image' ) {
			if ( ! getUrl ) {
				size = typeof innerParent != 'undefined' && typeof innerParent.attributes.imageSize != 'undefined' ? innerParent.attributes.imageSize : 'full';
			} else {
				size = quality;
			}
			
			src = get( media, [ 'sizes', size, 'url' ] ) || get( media, [ 'media_details', 'sizes', size, 'source_url' ] ) || media.url;
		}

		if ( getUrl ) {
			return src;
		}

		setAttributes( {
			mediaAlt: media.alt,
			mediaId: media.id,
			mediaUrl: src || media.url || media.source_url,
			isSelected: true,
			mediaType
		} );
	}

	componentWillReceiveProps( someProp ) {
		const { imgObj } = this.props;
		if ( imgObj && typeof someProp.attributes.innerParent != 'undefined' ) {
			const src = this.onSelectMedia( imgObj, true, someProp.attributes.innerParent.attributes.imageSize );
			someProp.attributes.mediaUrl = src;
		}		
	}

	renderMediaArea() {
		const { attributes, baseClass, setAttributes } = this.props;
		const { mediaAlt, mediaId, mediaType, mediaUrl, innerParent } = attributes;

		if ( ! mediaType ) {
			setAttributes( { mediaType: 'image' } );
		}

		return (
			<MediaContainer
				className={ `${baseClass}__media` }
				onSelectMedia={ this.onSelectMedia }
				{ ...{ mediaAlt, mediaId, mediaType, mediaUrl, innerParent } }
			/>
		);
	}

	componentDidUpdate(prevProps, prevState) {
		const { imgObj, mediaUrl } = this.props;
		const { innerParent } = prevProps.attributes;

		if ( innerParent && imgObj ) {
			if ( ! isEqual( innerParent.attributes.imageSize, this.props.attributes.innerParent.attributes.imageSize ) ) {
				this.onSelectMedia( imgObj );
			}
		}
	}

	render() {
		const { className, isSelected, setAttributes } = this.props;
		const { mediaAlt, mediaUrl, mediaType, innerParent } = this.props.attributes;
		
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
			color : innerParent != undefined && typeof innerParent.attributes.textColor != 'undefined' ? innerParent.attributes.textColor : null
		};

		return (
			<Fragment>
				<Inspector {...{ ...this.props, ...{ setAttributes }, ...{ onSelectMedia : this.onSelectMedia } } } key={ 'inspector' }/>

				<div className={ classNames } >
					{ this.renderMediaArea() }		
					<div className={ `${className}__content` } style={ contentStyle }>
						<div className={ `${className}__content-wrapper` }>
							{ mediaUrl && (
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

export default compose( [
	withSelect( ( select, props ) => {
		const { getMedia } = select( 'core' );
		const { mediaId } = props.attributes;
		return {
			imgObj: mediaId ? getMedia( mediaId ) : null
		};
	} )
] )( Edit );