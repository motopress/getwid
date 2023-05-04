/**
* External dependencies
*/
import { __, isRTL } from 'wp.i18n';
import classnames from 'classnames';
import { pick, map, get, some, isEqual, sortBy } from 'lodash';

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

const { ToolbarButton, ToggleControl, DropZone, ToolbarGroup, Dashicon, TextControl } = wp.components;
const { BlockControls, MediaUpload, MediaPlaceholder, mediaUpload, BlockAlignmentToolbar, BlockIcon, URLInput } = wp.blockEditor || wp.editor;

const { jQuery: $ } = window;

/**
* Module Constants
*/
const alignmentsList = [ 'wide', 'full' ];
const ALLOWED_MEDIA_TYPES = [ 'image' ];
const baseClass = 'wp-block-getwid-images-slider';
const NEW_TAB_REL = 'noreferrer noopener';

/**
* Module Functions
*/
export const pickRelevantMediaFiles = ( image, imageSize, props ) => {

	const { images } = props.attributes;
	const imageProps = pick( image, [ 'id', 'link' ] );

	imageProps.original_url = image.url || image.source_url;
	imageProps.alt = image.alt || image.alt_text;

	imageProps.url =
		get( image, [ 'media_details', 'sizes', imageSize, 'source_url' ] ) ||
		get( image, [ 'media_details', 'sizes', 'large', 'source_url' ] ) ||
		get( image, [ 'media_details', 'sizes', 'full', 'source_url' ] ) ||
		get( image, [ 'sizes', imageSize, 'url' ] ) ||
		image.url ||
		image.source_url;

	$.each(images, (index, item) => {
		if ( item.id == image.id ) {
			imageProps.custom_link = item.custom_link;
			return false;
		}
	});

	if ( typeof image.caption == 'string' || typeof image.caption == 'undefined' ) {
		imageProps.caption = image.caption;
	} else {
		imageProps.caption = image.caption.raw;
	}

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

		this.setImageAttributes = this.setImageAttributes.bind( this );
		this.addFiles           = this.addFiles			 .bind( this );
		this.uploadFromFiles    = this.uploadFromFiles	 .bind( this );
		this.setAttributes      = this.setAttributes	 .bind( this );
		this.onSetNewTab 		= this.onSetNewTab		 .bind( this );

		this.state = {
			isUpdate: false
		};
	}

    onSetNewTab( value, index ) {
		const { attributes: { images } } = this.props;
        const linkTarget = value ? '_blank' : undefined;

        let updatedRel = images[index].custom_link_rel;
        if ( linkTarget && ! images[index].custom_link_rel ) {
            updatedRel = NEW_TAB_REL;
        } else if ( ! linkTarget && images[index].custom_link_rel === NEW_TAB_REL ) {
            updatedRel = undefined;
		}

		this.setImageAttributes( index, {custom_link_target: linkTarget, custom_link_rel: updatedRel} );
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

	checkChangeImageOrder(images, props) {
		let before = sortBy(props.attributes.images, item => {
			return item.id;
		});
		before = before.map( image => {return (image.id ? image.id.toString() : false)} );

		let after = sortBy(images, item => {
			return item.id;
		});
		after = after.map( image => {return (image.id ? image.id.toString() : false)} );

		this.flag = false;

		if ( isEqual( before, after ) ) {
			this.flag = true;
		}

		return this.flag;
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

		this.checkChangeImageOrder( images, this.props );

		this.setAttributes( {
			images: images.map( image => pickRelevantMediaFiles( image, imageSize, this.props ) )
		} );
	}

	setImageAttributes( index, attributes ) {

		const { attributes: { images } } = this.props;
		const { setAttributes } = this;

		if ( ! images[ index ] ) {
			return;
		}

		const new_images = [
			...images.slice( 0, index ),
			{
				...images[ index ],
				...attributes
			},
			...images.slice( index + 1 )
		];

		setAttributes( {
			images: new_images
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
				const imagesNormalized = images.map( image => pickRelevantMediaFiles( image, imageSize, this.props ) );
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

		const { sliderAutoplay, sliderAutoplaySpeed, sliderInfinite, linkTo } = this.props.attributes;
		const { sliderAnimationEffect, sliderSlidesToShow, sliderSlidesToScroll, slideHeight } = this.props.attributes;
		const { sliderAnimationSpeed, sliderCenterMode, sliderVariableWidth, sliderArrows, sliderDots } = this.props.attributes;

		const thisBlock = $( `[data-block='${clientId}']` );
		const sliderSelector = $( `.${baseClass}__wrapper`, thisBlock );

		if ( sliderSelector.length && (typeof sliderSelector.imagesLoaded === "function") ) {
			sliderSelector.imagesLoaded().done( function( instance ) {

				sliderSelector.not( '.slick-initialized' ).slick( {
					arrows: sliderArrows != 'none' ? true : false,
					dots  : sliderDots   != 'none' ? true : false,
					fade  : sliderAnimationEffect == 'fade' ? true : false,

					slidesToShow  : (sliderAnimationEffect == 'fade' ? 1 : parseInt( sliderSlidesToShow )),
					slidesToScroll: parseInt( sliderSlidesToScroll ),
					autoplaySpeed : parseInt( sliderAutoplaySpeed  ),
					speed         : parseInt( sliderAnimationSpeed ),

					infinite: (linkTo != 'custom' ? sliderInfinite : false),
					autoplay: sliderAutoplay,
					draggable: (linkTo == 'custom' ? false : true),

					centerMode   : sliderCenterMode,
					variableWidth: sliderVariableWidth,

					pauseOnHover: true,
					rows: 0,
					rtl: isRTL()
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

	checkURLsChanges(propsCheck){
		let result = false;
		const { attributes: { images } } = this.props;

		//Check urls changes (Prevent update block)
		if ((images && images.length) && propsCheck.attributes.images.length ){
			$.each(images, function (index, el) {
				if (
					(typeof propsCheck.attributes.images[index] !='undefined' && propsCheck.attributes.images[index].custom_link != el.custom_link) ||
					(typeof propsCheck.attributes.images[index] !='undefined' && propsCheck.attributes.images[index].custom_link_target != el.custom_link_target) ||
					(typeof propsCheck.attributes.images[index] !='undefined' && propsCheck.attributes.images[index].custom_link_rel != el.custom_link_rel)
				){
					result = true;
				}
			});
		}

		return result;
	}

	componentDidUpdate( prevProps ) {

		const diffInUrls = this.flag ? false : this.checkURLsChanges( prevProps );

		if ( (! isEqual( prevProps.attributes, this.props.attributes ) && !diffInUrls) ) {
			this.destroySlider();
			this.initSlider();
			this.flag = false;
		}
	}

	render() {

		const { setAttributes, isSelected, className } = this.props;
		const { sliderSpacing, sliderArrows, sliderDots, linkTo } = this.props.attributes;
		const { align, images, imageFit, showCaption, captionStyle, captionPosition, imageAlignment, sliderSlidesToShow } = this.props.attributes;

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
						<ToolbarGroup>
							<MediaUpload
								onSelect={onSelectImages}
								allowedTypes={ ALLOWED_MEDIA_TYPES }
								multiple
								gallery
								value={ images.map( img => {return (img.id ? img.id : false);} ) }
								render={({ open }) => (
									<ToolbarButton
										label={ __( 'Edit Slider', 'getwid' ) }
										icon='edit'
										onClick={open}
									/>
								)}
							/>
						</ToolbarGroup>
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
			`has-dots-${sliderDots}`,
			{
				[ `has-captions` ]: showCaption == true,
				[ `captions-style-${captionStyle}` ]: showCaption == true && captionPosition !== 'underneath',
				[ `captions-${captionPosition}` ]: showCaption == true,

				[ `is-carousel` ]: sliderSlidesToShow > 1,
				[ `has-slides-gap-${sliderSpacing}` ]: sliderSlidesToShow > 1,
				[ `has-images-${imageAlignment}` ]: imageAlignment,
				[ `is-active` ]: isSelected,

				[ `has-cropped-images` ]: imageFit === 'fill',
				[ `has-fitted-images` ]: imageFit === 'fit',
			},
			align ? `align${ align }` : null
		);

		const imageRender = () => {

			if ( images.length ) {
				return images.map( ( img, index ) => {

					return (
						<Fragment key={ img.id || img.url }>
							<div className={`${baseClass}__item`}>
								<MediaContainer
									showCaption={showCaption}
									captionStyle={captionStyle}
									captionPosition={captionPosition}
									isSelected={isSelected}

									setAttributes={attrs => this.setImageAttributes( index, attrs )}
									image={img}
								/>
								{ (linkTo == 'custom') && (
									<Fragment>
										<div className= {`${baseClass}__url-field-wrapper`}>
											<div className= {`${baseClass}__url-field-container`}>
												<Dashicon icon='admin-links'/>
												<URLInput
													className= {`${baseClass}__url-field has-border`}
													autoFocus={ true }
													value={ img.custom_link ? img.custom_link : '' }
													onChange={ custom_link => {
														this.setImageAttributes( index, {custom_link} );
													} }
													disableSuggestions={ true }
												/>
											</div>
											<div className= {`${baseClass}__url-rel-container`}>
												<ToggleControl
													className= {`${baseClass}__url-toggle`}
													label={ __( 'New Tab', 'getwid' ) }
													onChange={ (value) => {
														this.onSetNewTab(value, index);
													} }
													checked={ img.custom_link_target === '_blank' }
												/>
												<TextControl
													className= {`${baseClass}__url-rel`}
													placeholder={ __( 'Link Rel', 'getwid' ) }
													value={ img.custom_link_rel || '' }
													onChange={ custom_link_rel => {
														this.setImageAttributes( index, {custom_link_rel} );
													} }
												/>
											</div>
										</div>
									</Fragment>
								)}
							</div>
						</Fragment>
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
				{ controls }
				<Inspector
					{ ...{
						...this.props,
						pickRelevantMediaFiles,
						changeState,
						getState
					} }
				/>
			</Fragment>
		);
	}
}

export default compose( [
	withSelect( ( select, props ) => {
		const { getMediaItems } = select( 'core' );
		const { ids } = props.attributes;

		if ( typeof ids != 'undefined' && ids.length > 0 ) {

			let mediaItems = getMediaItems( {
				include: ids.join( ',' ),
				per_page: ids.length,
			} );

			if ( mediaItems ) {

				return {
					imgObj:mediaItems
				};
			} else {

				return {
					imgObj:[]
				};
			}

		} else {
			return {
				imgObj:[]
			};
		}
	} )
] )( Edit );

