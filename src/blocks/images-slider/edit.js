/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import classnames from 'classnames';
import { pick, map, get, some, isEqual, filter } from 'lodash';

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
const { compose } = wp.compose;
const { withSelect } = wp.data;
const { Component, Fragment } = wp.element;

const { IconButton, DropZone, Toolbar } = wp.components;
const { BlockControls, MediaUpload, MediaPlaceholder, mediaUpload, BlockAlignmentToolbar, BlockIcon } = wp.blockEditor || wp.editor;

const { jQuery: $ } = window;

/**
* Module Constants
*/
const alignmentsList = [ 'wide', 'full' ];
const ALLOWED_MEDIA_TYPES = [ 'image' ];
const baseClass = 'wp-block-getwid-images-slider';

/**
* Module Functions
*/
export const pickRelevantMediaFiles = ( image, imageSize ) => {
	const imageProps = pick( image, [ 'id', 'link' ] );
	imageProps.original_url = image.url || image.source_url;
	imageProps.alt = image.alt || image.alt_text || image.caption;
	imageProps.url = get( image, [ 'sizes', imageSize, 'url' ] ) || get( image, [ 'media_details', 'sizes', imageSize, 'source_url' ] ) || image.url;
	return imageProps;
};

/**
* Create an Component
*/
class Edit extends Component {
	constructor(props) {
		super( ...arguments );

		this.changeState    = this.changeState   .bind( this );
		this.getState       = this.getState      .bind( this );
		this.onSelectImages = this.onSelectImages.bind( this );
		this.onRemoveImage = this.onRemoveImage  .bind( this );

		this.setImageAttributes = this.setImageAttributes.bind( this );
		this.addFiles           = this.addFiles			 .bind( this );
		this.uploadFromFiles    = this.uploadFromFiles	 .bind( this );
		this.setAttributes      = this.setAttributes	 .bind( this );
	}

	changeState (param, value) {
		this.setState( { [ param ]: value } );
	}

	getState (value) {
		return this.state[ value ];
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
		let { imageSize } = this.props.attributes;

		if ( ! [ 'full', 'large', 'medium', 'thumbnail' ].includes( imageSize ) ) {
			imageSize = attributes.imageSize.default;
			setAttributes( {
				imageSize
			} );
		}

		this.setAttributes( {
			images: images.map( image => pickRelevantMediaFiles( image, imageSize ) )
		} );
	}

	onRemoveImage( index ) {
		return () => {
			const images = filter( this.props.attributes.images, ( img, i ) => index !== i );
			this.setAttributes({
				images
			});
		};
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
					...attributes
				},
				...images.slice( index + 1 )
			]
		} );
	}

	uploadFromFiles( event ) {
		this.addFiles( event.target.files );
	}

	addFiles( files ) {

		const { imageSize } = this.props.attributes;

		const { setAttributes } = this;
		const currentImages = this.props.attributes.images || [];

		if ( ! [ 'full', 'large', 'medium', 'thumbnail' ].includes( imageSize ) ) {
			imageSize = attributes.imageSize.default;
			setAttributes({
				imageSize
			});
		}

		mediaUpload({
			allowedTypes: ALLOWED_MEDIA_TYPES,
			filesList: files,
			onFileChange: images => {
				const imagesNormalized = images.map( image => pickRelevantMediaFiles( image, imageSize ) );
				setAttributes( {
					images: currentImages.concat( imagesNormalized )
				});
			}
		});
	}

	destroySlider(){

		const { clientId } = this.props;

		const thisBlock = $( `[data-block='${clientId}']` );
		const sliderSelector = $( `.${baseClass}__wrapper`, thisBlock );

		sliderSelector.hasClass( 'slick-initialized' ) && sliderSelector.slick( 'unslick' );
	}

	initSlider() {

		const { clientId } = this.props;
		
		const { sliderAutoplay, sliderAutoplaySpeed, sliderInfinite } = this.props.attributes;
		const { sliderAnimationEffect, sliderSlidesToShow, sliderSlidesToScroll, slideHeight } = this.props.attributes;		
		const { sliderAnimationSpeed, sliderCenterMode, sliderVariableWidth, sliderArrows, sliderDots } = this.props.attributes;
		
		const thisBlock = $( `[data-block='${clientId}']` );
		const sliderSelector = $( `.${baseClass}__wrapper`, thisBlock );

		if ( sliderSelector.length ) {
			sliderSelector.imagesLoaded().done( function( instance ) {

				sliderSelector.not( '.slick-initialized' ).slick( {
					arrows: sliderArrows != 'none' ? true : false,
					dots  : sliderDots   != 'none' ? true : false,
					fade  : sliderAnimationEffect == 'fade' ? true : false,
					
					slidesToShow  : parseInt( sliderSlidesToShow   ),
					slidesToScroll: parseInt( sliderSlidesToScroll ),
					autoplaySpeed : parseInt( sliderAutoplaySpeed  ),
					speed         : parseInt( sliderAnimationSpeed ),

					infinite: sliderInfinite,
					autoplay: sliderAutoplay,

					centerMode   : sliderCenterMode,
					variableWidth: sliderVariableWidth,

					pauseOnHover: true,
					rows: 0
				} );

				if ( slideHeight ) {
					$( `.${baseClass}__item`, thisBlock ).css( 'height', slideHeight );
				}
			});
		}
	}

	componentDidMount() {
		const { images } = this.props.attributes;
		if ( images.length ) {
			this.initSlider();
		}
	}

	componentWillUpdate( nextProps, nextState ) {
		if ( ! isEqual( nextProps.attributes, this.props.attributes ) ) {
			this.destroySlider();
		}
	}

	componentDidUpdate( prevProps ) {
		if ( ! isEqual( prevProps.attributes, this.props.attributes ) ) {
			this.initSlider();
		}		
	}

	render() {

		const { setAttributes, isSelected, className } = this.props;
		const { sliderSpacing, sliderArrows, sliderDots } = this.props.attributes;
		const { align, images, imageCrop, imageAlignment, sliderSlidesToShow } = this.props.attributes;		

		const { onSelectImages, getState, changeState, addFiles } = this;

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
						value={ align }
						onChange={align => setAttributes({ align })}
					/>			
					{ !! images.length && (
						<Toolbar>
							<MediaUpload
								onSelect={onSelectImages}
								allowedTypes={ ALLOWED_MEDIA_TYPES }
								multiple
								gallery
								value={ images.map( img => img.id ) }
								render={({ open }) => (
									<IconButton
										className='components-toolbar__control'
										label={ __( 'Edit Slider', 'getwid' ) }
										icon='edit'
										onClick={open}
									/>
								)}
							/>
						</Toolbar>
					)}
				</BlockControls>
			</Fragment>
		);

		if ( images.length === 0 ) {
			return (
				<Fragment>
					{ controls }
					<MediaPlaceholder
						icon='format-gallery'
						className={baseClass}
						labels={ {
							title: __( 'Image Slider', 'getwid' ),
							instructions: __( 'Drag images, upload new ones or select files from your library.', 'getwid' )
						} }
						onSelect={onSelectImages}
						accept='image/*'
						allowedTypes={ALLOWED_MEDIA_TYPES}
						multiple
					/>
				</Fragment>
			);
		}

		const containerClasses = classnames( className,
			`has-arrows-${sliderArrows}`,
			`has-dots-${sliderDots}`, {
				[ `is-carousel` ]: sliderSlidesToShow > 1,
				[ `has-slides-gap-${sliderSpacing}` ]: sliderSlidesToShow > 1,
				[ `has-images-${imageAlignment}` ]: imageAlignment
			},			
			imageCrop ? `has-cropped-images` : null,
			align ? `align${ align }` : null
		);

		const imageRender = () => {

			const { onRemoveImage } = this;

			if ( images.length ) {
				return images.map( ( img, index ) => {
					return (
						<div className={`${baseClass}__item`} key={img.id || img.url}>
							<MediaContainer								
								original_url={img.original_url}
								isSelected={isSelected}
								url={img.url}
								alt={img.alt}
								id={img.id}
								onRemove={onRemoveImage( index )}
								setAttributes={attrs => this.setImageAttributes( index, attrs )}
							/>
						</div>
					);
				} );
			}
		};

		const hasImages = !! images.length;
		const hasImagesWithId = hasImages && some( images, ({ id }) => id );

		return (
			<Fragment>
				<div className={ containerClasses }>
					{ dropZone }
					<div className={`${baseClass}__wrapper`}>						
						{ imageRender() }
					</div>
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
				</div>
				{ controls }
				<Inspector {...{
					...this.props,
					pickRelevantMediaFiles,
					changeState,
					getState
				}} key='inspector'/>
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

