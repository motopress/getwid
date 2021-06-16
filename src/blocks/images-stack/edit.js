/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import classnames from 'classnames';
import { pick, map, get, chunk, some, filter, isEqual } from 'lodash';

/**
* Internal dependencies
*/
import attributes from './attributes';
import Inspector from './inspector';
import MediaContainer from './media-container';

import './editor.scss';

/**
* WordPress dependencies
*/
const { Component, Fragment } = wp.element;
const { ToolbarButton, DropZone, ToolbarGroup } = wp.components;
const { BlockControls, MediaUpload, MediaPlaceholder, mediaUpload, BlockAlignmentToolbar } = wp.blockEditor || wp.editor;

const { withSelect } = wp.data;
const { compose } = wp.compose;

const { jQuery: $ } = window;

/**
* Module Constants
*/
const alignmentsList = [ 'wide', 'full' ];
const ALLOWED_MEDIA_TYPES = [ 'image' ];
const baseClass = 'wp-block-getwid-images-stack';

/**
* Module Functions
*/
export const pickRelevantMediaFiles = ( image, imageSize ) => {
	const imageProps = pick( image, [ 'id', 'link', 'caption' ] );
	imageProps.original_url = image.url || image.source_url;
	imageProps.alt = image.alt || image.alt_text;
	imageProps.url = get( image, [ 'sizes', imageSize, 'url' ] ) || get( image, [ 'media_details', 'sizes', imageSize, 'source_url' ] ) || image.url;
	return imageProps;
};

/**
* Create an Component
*/
class Edit extends Component {
	constructor() {
		super( ...arguments );

		this.setImageAttributes = this.setImageAttributes.bind( this );
		this.uploadFromFiles    = this.uploadFromFiles   .bind( this );
		this.setAttributes 		= this.setAttributes     .bind( this );

		this.addFiles 	    = this.addFiles      .bind( this );
		this.getState       = this.getState      .bind( this );
		this.onSelectImages = this.onSelectImages.bind( this );
	}

	changeState(param, value) {
		if (typeof param == 'object') {
			this.setState(param);
		} else if (typeof param == 'string') {
			this.setState({[param]: value});
		}
	}

	getState(value) {
		return this.state[ value ];
	}

	onRemoveImage(url) {
		const images = filter( this.props.attributes.images, (image, index) => url != image.url );
		this.setAttributes({
			images
		});
	}

	setAttributes( attributes ) {
		if ( attributes.ids ) {
			throw new Error( 'The "ids" attribute should not be changed directly. It is managed automatically when "images" attribute changes' );
		}

		if ( attributes.images ) {
			attributes = {
				...attributes,
				ids: map( attributes.images, 'id' )
			};
		}

		this.props.setAttributes( attributes );
	}

	onSelectImages( images ) {

		const { setAttributes } = this.props;
		const { imageSize } = this.props.attributes;

		if ( ! Getwid.settings.image_sizes_value.includes( imageSize ) ) {
			imageSize = attributes.imageSize.default;
			setAttributes( {
				imageSize
			} );
		}

		this.setAttributes( {
			images: images.map( image => pickRelevantMediaFiles( image, imageSize ) )
		} );
	}

	setImageAttributes( index, attributes ) {
		const { setAttributes } = this;
		const { attributes: { images } } = this.props;

		if ( ! images[ index ] ) return;

		setAttributes( {
			images: [
				...images.slice( 0, index ),
				{
					...images[ index ],
					...attributes,
				},
				...images.slice( index + 1 ),
			],
		} );
	}

	uploadFromFiles( event ) {
		this.addFiles( event.target.files );
	}

	addFiles( files ) {
		const currentImages = this.props.attributes.images || [];
		const { setAttributes } = this;
		let {
			attributes:{
				imageSize,
			},
		} = this.props;

		if ( ! Getwid.settings.image_sizes_value.includes( imageSize ) ) {
			imageSize = attributes.imageSize.default;
			setAttributes( {
				imageSize
			} );
		}

		mediaUpload( {
			allowedTypes: ALLOWED_MEDIA_TYPES,
			filesList: files,
			onFileChange: images => {

				if ( typeof images[ 0 ].id == 'undefined' ) return;

				const imagesNormalized = images.map( image => pickRelevantMediaFiles( image, imageSize ) );
				setAttributes( {
					images: currentImages.concat( imagesNormalized )
				} );
			}
		} );
	}

	render() {

		const { onSelectImages, addFiles } = this;

		const { setAttributes, isSelected, className } = this.props;
		const { align, images, stackStyle } = this.props.attributes;

		const dropZone = (
			<DropZone
				onFilesDrop={addFiles}
			/>
		);

		const controls = (
			<Fragment>
				<BlockControls>
					<BlockAlignmentToolbar
						controls= {alignmentsList}
						value={align}
						onChange={align => setAttributes({ align })}
					/>
					{ !! images.length && (
						<ToolbarGroup>
							<MediaUpload
								onSelect={onSelectImages}
								allowedTypes={ ALLOWED_MEDIA_TYPES }
								multiple
								gallery
								value={ images.map( img => img.id ) }
								render={ ({ open }) => (
									<ToolbarButton
										className='components-toolbar__control'
										label={ __( 'Edit Gallery', 'getwid' ) }
										icon='edit'
										onClick={ open }
									/>
								) }
							/>
						</ToolbarGroup>
					) }
				</BlockControls>
			</Fragment>
		);

		if ( images.length === 0 ) {
			return (
				<Fragment>
					{ controls }
					<MediaPlaceholder
						icon={'format-gallery'}
						className={className}
						labels={ {
							title: __( 'Image Stack Gallery', 'getwid' ),
							instructions: __( 'Drag images, upload new ones or select files from your library.', 'getwid' )
						} }
						onSelect={onSelectImages}
						accept={'image/*'}
						allowedTypes={ALLOWED_MEDIA_TYPES}
						multiple
					/>
				</Fragment>
			);
		}

		const containerClasses = classnames( className, {
				[ `is-layout-${stackStyle}` ]: stackStyle != 'default'
			},
			align ? `align${ align }` : null
		);

		const arr_chunks = chunk( images, 3 );

		const hasImages = !! images.length;
		const hasImagesWithId = hasImages && some( images, ({ id }) => id );

		return (
			<Fragment>
				{controls}
				<Inspector {...{pickRelevantMediaFiles, ...this.props}} key={'inspector'}/>
				<div className={containerClasses}>
					{dropZone}
					<div className={`${baseClass}__wrapper`}>
						{ arr_chunks.map( chunk => {
							return (
								<div className={ `${baseClass}__chunk` }>
									{ chunk.map( (img, index) => {
										return (
											<div className={`${baseClass}__media-wrapper` } key={img.id || img.url}>
                                                <div className={`${baseClass}__media-inner-wrapper`}>
													<MediaContainer
														url={img.url}
														alt={img.alt}
														id={img.id}
														isSelected={isSelected}
														setAttributes={attrs => this.setImageAttributes( index, attrs )}
													/>
												</div>
											</div>
										);
									} ) }
								</div>
							);
						} ) }
					</div>
					{isSelected && (
						<MediaPlaceholder
							addToGallery={hasImagesWithId}
							isAppender={hasImages}
							className='components-form-file-upload'
							disableMediaButtons={hasImages && ! isSelected}
							icon={! hasImages && <BlockIcon icon={icon}/>}
							labels={{
								title: ! hasImages && __( 'Gallery' ),
								instructions: ! hasImages && __( 'Drag images, upload new ones or select files from your library.' )
							}}
							onSelect={onSelectImages}
							accept='image/*'
							allowedTypes={ALLOWED_MEDIA_TYPES}
							multiple
							value={hasImagesWithId ? images : undefined}
						/>
					)}
				</div>
			</Fragment>
		);
	}
}

export default compose( [
	withSelect( ( select, props ) => {
		const { getMedia } = select( 'core' );
		const { ids } = props.attributes;

		if ( typeof ids !='undefined' ) {
			return {
				imgObj: ids ? ids.map( id => getMedia( id ) ) : null
			};
		}
	} )
] )( Edit );
