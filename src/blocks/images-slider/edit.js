import { filter, pick, map, get } from "lodash";
import classnames from 'classnames';
import animate from 'GetwidUtils/animate';
import './editor.scss';

/**
 * Internal block libraries
 */
const {__} = wp.i18n;

const {
	BlockControls,
	MediaUpload,
	MediaPlaceholder,
	mediaUpload,
	BlockAlignmentToolbar
} = wp.editor;

const {Component, Fragment} = wp.element;

const {
	IconButton,
	DropZone,
	FormFileUpload,
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
	Toolbar,
	withNotices,
} = wp.components;
const $ = window.jQuery;

const alignmentsList = [ 'wide', 'full' ];

import Inspector from './inspector';
import MediaContainer from './media-container';

// const MAX_COLUMNS = 8;
/*const linkOptions = [
	{ value: 'attachment', label: __( 'Attachment Page' ) },
	{ value: 'media', label: __( 'Media File' ) },
	{ value: 'none', label: __( 'None' ) },
];*/
const ALLOWED_MEDIA_TYPES = [ 'image' ];

/**
 * Create an Inspector Controls wrapper Component
 */

export const pickRelevantMediaFiles = ( image ) => {
	const imageProps = pick( image, [ 'alt', 'id', 'link', 'caption' ] );
	imageProps.url = get( image, [ 'sizes', 'thumb', 'url' ] ) || get( image, [ 'media_details', 'sizes', 'thumb', 'source_url' ] ) || image.url;
	return imageProps;
};

class Edit extends Component {
	constructor() {
		super( ...arguments );

		// this.onSelectImage = this.onSelectImage.bind( this );
		this.onSelectImages = this.onSelectImages.bind( this );
		// this.setLinkTo = this.setLinkTo.bind( this );
		// this.setColumnsNumber = this.setColumnsNumber.bind( this );
		// this.toggleImageCrop = this.toggleImageCrop.bind( this );
		// this.onRemoveImage = this.onRemoveImage.bind( this );
		this.setImageAttributes = this.setImageAttributes.bind( this );
		this.addFiles = this.addFiles.bind( this );
		this.uploadFromFiles = this.uploadFromFiles.bind( this );
		this.setAttributes = this.setAttributes.bind( this );

/*		this.state = {
			selectedImage: null,
		};*/
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

/*	onSelectImage( index ) {
		return () => {
			if ( this.state.selectedImage !== index ) {
				this.setState( {
					selectedImage: index,
				} );
			}
		};
	}*/

/*	onRemoveImage( index ) {
		return () => {
			const images = filter( this.props.attributes.images, ( img, i ) => index !== i );
			const { columns } = this.props.attributes;
			this.setState( { selectedImage: null } );
			this.setAttributes( {
				images,
				columns: columns ? Math.min( images.length, columns ) : columns,
			} );
		};
	}*/

	onSelectImages( images ) {
		console.log('onSelectImages');
		this.destroySlider();
		this.setAttributes( {
			images: images.map( ( image ) => pickRelevantMediaFiles( image ) ),
		} );
	}

/*	setLinkTo( value ) {
		this.setAttributes( { linkTo: value } );
	}

	setColumnsNumber( value ) {
		this.setAttributes( { columns: value } );
	}

	toggleImageCrop() {
		this.setAttributes( { imageCrop: ! this.props.attributes.imageCrop } );
	}*/

/*	getImageCropHelp( checked ) {
		return checked ? __( 'Thumbnails are cropped to align.' ) : __( 'Thumbnails are not cropped.' );
	}*/

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
		const { noticeOperations } = this.props;
		const { setAttributes } = this;
		mediaUpload( {
			allowedTypes: ALLOWED_MEDIA_TYPES,
			filesList: files,
			onFileChange: ( images ) => {
				const imagesNormalized = images.map( ( image ) => pickRelevantMediaFiles( image ) );
				setAttributes( {
					images: currentImages.concat( imagesNormalized ),
				} );
			},
			onError: noticeOperations.createErrorNotice,
		} );
	}

	destroySlider(){
		const {clientId} = this.props;
		const sliderEl = jQuery(`#block-${clientId} .${this.props.className}__wrapper`);
		sliderEl.hasClass('slick-initialized') && sliderEl.slick('unslick');
	}

	initSlider() {
		// console.log('Init');
		const {
			attributes: {
				sliderAnimationEffect,
				sliderSlidesToShow,
				sliderSlidesToShowLaptop,
				sliderSlidesToShowTablet,
				sliderSlidesToShowMobile,
				sliderSlidesToScroll,
				sliderAutoplay,
				sliderAutoplaySpeed,
				sliderInfinite,
				sliderAnimationSpeed,
				sliderCenterMode,
				sliderVariableWidth,
				sliderSpacing,
				sliderArrows,
				sliderDots
			},
			clientId
		} = this.props;

		console.warn(this.props);


		const sliderEl = jQuery(`#block-${clientId} .${this.props.className}__wrapper`);

		sliderEl.hasClass('slick-initialized') && sliderEl.slick('unslick');

/*		console.log(sliderEl);

this.destroySlider();*/

		// if (!sliderEl.hasClass('slick-initialized')){
			console.log('HERE WE GO');

			// Init slick slider
	        sliderEl.slick({
	            //vertical: true,
	            arrows: sliderArrows != 'none' ? true : false,
	            dots: sliderDots != 'none' ? true : false,
	            rows: 0,
	            slidesToShow: sliderSlidesToShow,
	            slidesToScroll: sliderSlidesToScroll,
	            autoplay: sliderAutoplay,
	            autoplaySpeed: parseInt(sliderAutoplaySpeed),
	            fade: sliderAnimationEffect == 'fade' ? true : false,
	            speed: parseInt(sliderAnimationSpeed),
	            infinite: sliderInfinite,
	            
	            centerMode: sliderCenterMode,
	            variableWidth: sliderVariableWidth,
	            pauseOnHover: true,            
	            adaptiveHeight: true,            
	        });

		// }
	}	

	componentDidMount(){
		console.log('MOUNT');
		this.initSlider();
	}

	componentDidUpdate( prevProps ) {
console.log(prevProps);
console.warn('++++++++++++++');


		console.warn('UPDATE');
		this.initSlider();
		// Deselect images when deselecting the block
	/*	if ( ! this.props.isSelected && prevProps.isSelected ) {
			this.setState( {
				selectedImage: null,
				captionSelected: false,
			} );
		}*/
	}

	componentWillUnmount() {
		console.error('DESTROY');
		// this.destroySlider();
	}

	render() {
		const {
			attributes:{
				align,
				images,
				ids,
				imageSize,
				imageCrop,
				linkTo,
				imageAlignment,
				sliderAnimationEffect,
				sliderSlidesToShow,
				sliderSlidesToShowLaptop,
				sliderSlidesToShowTablet,
				sliderSlidesToShowMobile,
				sliderSlidesToScroll,
				sliderAutoplay,
				sliderAutoplaySpeed,
				sliderInfinite,
				sliderAnimationSpeed,
				sliderCenterMode,
				sliderVariableWidth,
				sliderSpacing,
				sliderArrows,
				sliderDots,
			},
			setAttributes,
			isSelected,
			className,
			noticeOperations,
			noticeUI
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
										label={ __( 'Edit Gallery' ) }
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
							title: __( 'Gallery' ),
							instructions: __( 'Drag images, upload new ones or select files from your library.' ),
						} }
						onSelect={ this.onSelectImages }
						accept="image/*"
						allowedTypes={ ALLOWED_MEDIA_TYPES }
						multiple
						notices={ noticeUI }
						onError={ noticeOperations.createErrorNotice }
					/>
				</Fragment>
			);
		}

		const containerClasses = classnames(
			className,
			`${className}`,
			{
				[ `${className}--carousel` ]: sliderSlidesToShow > 1,
				[ `${className}--slides-gap-${sliderSpacing}` ]: sliderSlidesToShow > 1,
				[ `${className}--images-${imageAlignment}` ]: imageAlignment != 'center',
				[ `${className}--arrows-${sliderArrows}` ]: sliderArrows != 'inside',
				[ `${className}--dots-${sliderDots}` ]: sliderDots != 'inside',
			},			
			imageCrop ? `${ className }--crop-images` : null,
			align ? `align${ align }` : null,
		);

		const sliderData = {
			'data-effect' : sliderAnimationEffect,
			'data-slides-show' : sliderSlidesToShow,
			'data-slides-show-laptop' : sliderSlidesToShowLaptop,
			'data-slides-show-tablet' : sliderSlidesToShowTablet,
			'data-slides-show-mobile' : sliderSlidesToShowMobile,
			'data-slides-scroll' : sliderSlidesToScroll,
			'data-autoplay' : sliderAutoplay,
			'data-autoplay-speed' : sliderAutoplaySpeed,
			'data-infinite' : sliderInfinite,
			'data-animation-speed' : sliderAnimationSpeed,
			'data-center-mode' : sliderCenterMode,
			'data-variable-width' : sliderVariableWidth,
			'data-arrows' : sliderArrows != 'none' ? true : false,
			'data-dots' : sliderDots != 'none' ? true : false,
		};

		return (
			<Fragment>
				{ controls }
				<Inspector {...this.props} key='inspector'/>
				{ noticeUI }
				<div className={ containerClasses }>
					{ dropZone }
					<div className={`${className}__wrapper`} {...sliderData}>						
						{ images.map( ( img, index ) => {
							/* translators: %1$d is the order number of the image, %2$d is the total number of images. */
							const ariaLabel = __( sprintf( 'image %1$d of %2$d in gallery', ( index + 1 ), images.length ) );

							return (
								<div className={`${className}__item`} key={ img.id || img.url }>
									<MediaContainer
										url={ img.url }
										alt={ img.alt }
										id={ img.id }
										setAttributes={ ( attrs ) => this.setImageAttributes( index, attrs ) }
										aria-label={ ariaLabel }
									/>
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

export default withNotices( Edit );