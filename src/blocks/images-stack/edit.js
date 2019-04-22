/**
* External dependencies
*/

import classnames from 'classnames';
import './editor.scss';
import attributes from './attributes';
import Inspector from './inspector';
import MediaContainer from './media-container';
import {
	pick,
	map,
	get,
	chunk
} from "lodash";


/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {
	BlockControls,
	MediaUpload,
	MediaPlaceholder,
	mediaUpload,
	BlockAlignmentToolbar
} = wp.editor;
const {Component, Fragment} = wp.element;
const { compose } = wp.compose;
const {
	withSelect
} = wp.data;
const {
	IconButton,
	DropZone,
	FormFileUpload,
	Toolbar,
} = wp.components;
const $ = window.jQuery;


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

		this.onSelectImages = this.onSelectImages.bind( this );
		this.setImageAttributes = this.setImageAttributes.bind( this );
		this.addFiles = this.addFiles.bind( this );
		this.uploadFromFiles = this.uploadFromFiles.bind( this );
		this.setAttributes = this.setAttributes.bind( this );
	}

	setAttributes( attributes ) {
		if ( attributes.ids ) {
			throw new Error( 'The "ids" attribute should not be changed directly. It is managed automatically when "images" attribute changes' );
		}

		if ( attributes.images ) {
			attributes = {
				...attributes,
				ids: map( attributes.images, 'id' ),
			};
		}

		this.props.setAttributes( attributes );
	}

	onSelectImages( images ) {
		let {
			attributes:{
				imageSize,
			},
			setAttributes
		} = this.props;

		if (!['full', 'large', 'medium', 'thumbnail'].includes(imageSize)) {
			imageSize = attributes.imageSize.default;
			setAttributes( {
				imageSize
			} );
		}

		this.setAttributes( {
			images: images.map( ( image ) => pickRelevantMediaFiles( image, imageSize ) ),
		} );
	}

	setImageAttributes( index, attributes ) {
		const { attributes: { images } } = this.props;
		const { setAttributes } = this;
		if ( ! images[ index ] ) {
			return;
		}
		
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

		if (!['full', 'large', 'medium', 'thumbnail'].includes(imageSize)) {
			imageSize = attributes.imageSize.default;
			setAttributes( {
				imageSize
			} );
		}

		mediaUpload( {
			allowedTypes: ALLOWED_MEDIA_TYPES,
			filesList: files,
			onFileChange: ( images ) => {
				const imagesNormalized = images.map( ( image ) => pickRelevantMediaFiles( image, imageSize ) );
				setAttributes( {
					images: currentImages.concat( imagesNormalized ),
				} );
			},
		} );
	}

	componentDidMount(){

	}

	componentDidUpdate( prevProps ) {

	}

	componentWillUnmount() {

	}

	render() {
		const {
			attributes:{
				align,
				images,
				ids,
				linkTo,
				imageSize,
				stackStyle,
				stackOverlap
			},
			setAttributes,
			isSelected,
			className,
		} = this.props;

		const dropZone = (
			<DropZone
				onFilesDrop={ this.addFiles }
			/>
		);

		const controls = (
			<Fragment>
				<BlockControls>
					<BlockAlignmentToolbar
						controls= {alignmentsList}
						value={ align }
						onChange={align => setAttributes({align})}
					/>			
					{ !! images.length && (
						<Toolbar>
							<MediaUpload
								onSelect={ this.onSelectImages }
								allowedTypes={ ALLOWED_MEDIA_TYPES }
								multiple
								gallery
								value={ images.map( ( img ) => img.id ) }
								render={ ( { open } ) => (
									<IconButton
										className="components-toolbar__control"
										label={ __( 'Edit Gallery', 'getwid' ) }
										icon="edit"
										onClick={ open }
									/>
								) }
							/>
						</Toolbar>
					) }
				</BlockControls>
			</Fragment>
		);

		if ( images.length === 0 ) {
			return (
				<Fragment>
					{ controls }
					<MediaPlaceholder
						icon="format-gallery"
						className={ className }
						labels={ {
							title: __( 'Image Stack Gallery', 'getwid' ),
							instructions: __( 'Drag images, upload new ones or select files from your library.', 'getwid' ),
						} }
						onSelect={ this.onSelectImages }
						accept="image/*"
						allowedTypes={ ALLOWED_MEDIA_TYPES }
						multiple
					/>
				</Fragment>
			);
		}

		const containerClasses = classnames(
			className,
			{
				[ `is-layout-${stackStyle}` ]: stackStyle != 'default'
			},
			align ? `align${ align }` : null,
		);

		const arr_chunks = chunk(images, 3);

		return (
			<Fragment>
				{ controls }
				<Inspector {...{pickRelevantMediaFiles, ...this.props}} key='inspector'/>
				<div className={ containerClasses }>
					{ dropZone }
					<div className={`${baseClass}__wrapper`}>
						{ arr_chunks.map((chunk, index) => {

							return (
								<div className={`${baseClass}__chunk`}>
									{ chunk.map( ( img, index ) => {
						
										return (
											<div className={`${baseClass}__media-wrapper`} key={ img.id || img.url }>
                                                <div className={`${baseClass}__media-inner-wrapper`}>
													<MediaContainer
														url={ img.url }
														alt={ img.alt }
														id={ img.id }
														setAttributes={ ( attrs ) => this.setImageAttributes( index, attrs ) }
													/>
												</div>
											</div>
										);
																	
									} ) }
								</div>						
							);

						} ) }
					</div>
					{ isSelected &&
						<div className="blocks-gallery-item has-add-item-button">
							<FormFileUpload
								multiple
								isLarge
								className="block-library-gallery-add-item-button"
								onChange={ this.uploadFromFiles }
								accept="image/*"
								icon="insert"
							>
								{ __( 'Upload an image', 'getwid' ) }
							</FormFileUpload>
						</div>
					}
				</div>
			</Fragment>
		);
	}
}

export default compose( [
	withSelect( ( select, props ) => {
		const { getMedia } = select( 'core' );
		const { ids } = props.attributes;
		return {
			imgObj: ids ? ids.map((id) => getMedia( id ) ) : null,
		};
	} ),
] )( Edit );
