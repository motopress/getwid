import { get } from 'lodash';
import classnames from 'classnames';
import animate from 'GetwidUtils/animate';
import './editor.scss';

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

const {Component, Fragment} = wp.element;

const {
	PanelBody,
	TextareaControl,
	ToggleControl,
	Toolbar,
} = wp.components;
const $ = window.jQuery;

import {SliderContext} from './../context';
import MediaContainer from './media-container';

/**
 * Constants
 */
const ALLOWED_BLOCKS = [ 'core/button', 'core/paragraph', 'core/heading', 'core/list' ];
const TEMPLATE = [
	[ 'core/heading', { placeholder: 'Title' } ],
	[ 'core/paragraph', { placeholder: 'Content…' } ],
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
		const { setAttributes } = this.props;

		let mediaType;
		let src;
		// for media selections originated from a file upload.
		if ( media.media_type ) {
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
			src = get( media, [ 'sizes', 'full', 'url' ] ) || get( media, [ 'media_details', 'sizes', 'full', 'source_url' ] );
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
		const { mediaAlt, mediaId, mediaType, mediaUrl } = attributes;

		return (
			<MediaContainer
				className="block-library-media-text__media-container"
				onSelectMedia={ this.onSelectMedia }
				{ ...{ mediaAlt, mediaId, mediaType, mediaUrl } }
			/>
		);
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
					label={ __( 'Alt Text (Alternative Text)' ) }
					value={ mediaAlt }
					onChange={ onMediaAltChange }
					help={ __( 'Alternative text describes your image to people who can’t see it. Add a short description with its key details.' ) }
				/> ) }
			</Fragment>
		);
		return (
			<Fragment>
				<SliderContext.Consumer>
					{ ( value ) => 
						{
							console.error('EDIT Content');
							console.error(value);
							if (value){setAttributes({innerParent : value})}
						}
					}
				</SliderContext.Consumer>

				<div className={ classNames } >
					{ this.renderMediaArea() }

					<InnerBlocks
						allowedBlocks={ ALLOWED_BLOCKS }
						templateLock={ false }
						template={ TEMPLATE }
						templateInsertUpdatesSelection={ false }
					/>
					
				</div>
			</Fragment>
		);
	}		

}

export default Edit;
