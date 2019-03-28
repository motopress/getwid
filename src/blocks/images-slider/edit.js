/**
* External dependencies
*/
import { pick, map, get, isEqual } from "lodash";
import classnames from 'classnames';
import attributes from './attributes';
import Inspector from './inspector';
import MediaContainer from './media-container';
import './editor.scss';


/**
* WordPress dependencies
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
	Toolbar,
} = wp.components;
const $ = window.jQuery;


/**
* Module Constants
*/
const alignmentsList = [ 'wide', 'full' ];
const ALLOWED_MEDIA_TYPES = [ 'image' ];


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

		this.changeState = this.changeState.bind(this);
		this.getState = this.getState.bind(this);
		this.onSelectImages = this.onSelectImages.bind( this );
		this.setImageAttributes = this.setImageAttributes.bind( this );
		this.addFiles = this.addFiles.bind( this );
		this.uploadFromFiles = this.uploadFromFiles.bind( this );
		this.setAttributes = this.setAttributes.bind( this );
	}

	changeState (param, value) {
		this.setState({[param]: value});
	}

	getState (value) {
		return this.state[value];
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

	destroySlider(){
		const {className} = this.props;
		const sliderEl = $(ReactDOM.findDOMNode(this));
		const sliderSelector = $(`.${className}__wrapper`, sliderEl);

		sliderSelector.hasClass('slick-initialized') && sliderSelector.slick('unslick');
	}

	initSlider() {
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
			clientId,
			className
		} = this.props;

		const sliderEl = $(ReactDOM.findDOMNode(this));
		const sliderSelector = $(`.${className}__wrapper`, sliderEl);

		if (sliderSelector.length){
		//Wait all images loaded
			sliderSelector.imagesLoaded().done( function( instance ) {

				sliderSelector.not('.slick-initialized').slick({
					arrows: sliderArrows != 'none' ? true : false,
					dots: sliderDots != 'none' ? true : false,
					rows: 0,
					slidesToShow: parseInt(sliderSlidesToShow),
					slidesToScroll: parseInt(sliderSlidesToScroll),
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
			});
		}

	}

	componentDidMount(){
		const {
			attributes:{
				images,
			},
		} = this.props;
		
		if (images.length){
			this.initSlider();			
		}
	}

	componentWillUpdate(nextProps, nextState) {
		if (!isEqual(nextProps.attributes, this.props.attributes)){
			this.destroySlider();
		}
	}

	componentDidUpdate( prevProps ) {
		if (!isEqual(prevProps.attributes, this.props.attributes)){
			this.initSlider();
		}
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
		} = this.props;

		const getState = this.getState;
		const changeState = this.changeState;

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
										label={ __( 'Edit Slider', 'getwid' ) }
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
							title: __( 'Image Slider', 'getwid' ),
							instructions: __( 'Drag images, upload new ones or select files from your library.', 'getwid' ),
						} }
						onSelect={ this.onSelectImages }
						value={ images.map( ( img ) => img.id ) }
						accept="image/*"
						allowedTypes={ ALLOWED_MEDIA_TYPES }
						multiple

					/>
				</Fragment>
			);
		}

		const containerClasses = classnames(
			className,
			`${className}--arrows-${sliderArrows}`,
			`${className}--dots-${sliderDots}`,
			{
				[ `${className}--carousel` ]: sliderSlidesToShow > 1,
				[ `${className}--slides-gap-${sliderSpacing}` ]: sliderSlidesToShow > 1,
				[ `${className}--images-${imageAlignment}` ]: imageAlignment,
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
			'data-arrows' : sliderArrows,
			'data-dots' : sliderDots,
			'data-spacing' : sliderSpacing,
		};

		const imageRender = () => {

			if (images.length){
				return images.map( ( img, index ) => {

					return (
						<div className={`${className}__item`} key={ img.id || img.url }>
							<MediaContainer
								url={ img.url }
								original_url={ img.original_url }
								alt={ img.alt }
								id={ img.id }
								setAttributes={ ( attrs ) => this.setImageAttributes( index, attrs ) }
							/>
						</div>
					);
				} );		
			}
		};

		return (
			<Fragment>
				<div className={ containerClasses }>
					{ dropZone }
					<div className={`${className}__wrapper`} {...sliderData}>						
						{ imageRender() }
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
				{ controls }
				<Inspector {...{
					pickRelevantMediaFiles,
					...this.props,
					...{changeState},
					...{getState},					
				}} key='inspector'/>				
			</Fragment>
		);
	}
}

export default ( Edit );