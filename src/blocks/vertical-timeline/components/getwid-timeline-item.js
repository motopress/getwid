/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import { get, pick } from 'lodash';

const { compose } = wp.compose;
const { withSelect } = wp.data;
const { Component, Fragment } = wp.element;
const { Toolbar, IconButton, PanelBody, SelectControl } = wp.components;
const { MediaUploadCheck, MediaUpload, BlockControls, InspectorControls } = wp.editor;

/**
* Create an Component
*/
class GetwidTimelineItem extends Component {

	constructor() {
		super(...arguments);

		this.setElementsProperty    = this.setElementsProperty   .bind( this );
		this.pickRelevantMediaFiles = this.pickRelevantMediaFiles.bind( this );
		
		this.onSelectImage     = this.onSelectImage    .bind( this );
		this.onChangeImageSize = this.onChangeImageSize.bind( this );
	}

	pickRelevantMediaFiles(image, imageSize) {
		const imageProps = pick( image, [ 'id' ] );
		imageProps.id = image.id;
		imageProps.alt = image.alt;
		imageProps.url = get( image, [ 'sizes', imageSize, 'url' ] ) || image.url;
		return imageProps;
	};

	onSelectImage( image ) {
		const { imageSize } = this.props.attributes;
		const { setAttributes } = this.props

		if ( ! [ 'full', 'large', 'medium', 'thumbnail' ].includes( imageSize ) ) {
			imageSize = attributes.imageSize.default;
			setAttributes( {
				imageSize
			} );
		}

		setAttributes( {
			...this.pickRelevantMediaFiles( image, imageSize )
		} );
	}

	onChangeImageSize(imageSize) {

		const { image, setAttributes } = this.props;

		if ( image ) {
			setAttributes( {
				imageSize,
				...this.pickRelevantMediaFiles( image, imageSize )
			} );
		}			
	};

	setElementsProperty() {
		const { clientId, baseClass } = this.props;

		const $block = $( `#block-${clientId}` );

		const $wrapper   = $block.find( `.${baseClass}__image-wrapper` );
		const $dateItem  = $block.find( `.${baseClass}__date-label`    );
		const $nodeItem  = $block.find( `.${baseClass}__node-inner`    );

		const setProperties = (properties) => {
			$.each( [ $nodeItem, $dateItem ], (index, value) => {
				$( value ).css( properties );
			} );
		};
		
		setProperties( {
			'visibility': 'hidden'
		} );
		
		$wrapper.imagesLoaded().done( () => {
			setProperties( {
				'top':  $wrapper.height() + 9,
				'visibility': 'visible'
			} );
		} );

		$( window ).resize( () => {
			setProperties( {
				'top':  $wrapper.height() + 9
			} );
		} );
	}

	render() {
		
		const { url, id, imageSize } = this.props.attributes;
		const { className, baseClass, setAttributes } = this.props;

		const controls = (
			<Fragment>
				<BlockControls>
					<Toolbar>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ this.onSelectImage }
								allowedTypes={ [ 'image' ] }
								value={ id }
								render={ ( { open } ) => (
									<div>
										<IconButton
											className={ 'components-toolbar__control' }
											label={ __( 'Edit Image', 'getwid' ) }
											icon={ 'format-image' }
											onClick={ open }
										/>
									</div>
								)}
							/>
						</MediaUploadCheck>
						{ url && ( <div>
								<IconButton
									className={ 'components-toolbar__control' }
									label={ __( 'Delete Image', 'getwid' ) }
									icon={ 'trash' }
									onClick={ () => {
										setAttributes( { id: undefined, url: undefined } );
									} }
								/>
							</div>
						) }
					</Toolbar>
				</BlockControls>
			</Fragment>
		);

		return (
			<Fragment>
				{ controls }
				<div className={`${className}`}>
					<div className={`${baseClass}__inner`}>

						<div className={`${baseClass}__node`}>
							<div className={`${baseClass}__node-inner`}></div>
						</div>

						<div className={`${baseClass}__wrapper`}>
							<div className={`${baseClass}__card`}>
								<div className={`${baseClass}__card-inner`}>
									{ url && ( <div className={`${baseClass}__image-wrapper`}>
											<MediaUpload
												onSelect={ this.onSelectImage }
												allowedTypes={[ 'image' ]}
												value={id}
												render={( { open } ) => (
													<div className={`${baseClass}__wrapper`} onClick={open}>
														<img className={`${baseClass}__image`} src={url} alt={''}/>
													</div>
												)}
											/>
										</div>
									) }
									
									<div className={`${baseClass}__content-wrapper`}>
										<h5>Aliquam erat volutpat</h5>
										<p>Duis hendrerit venenatis felis in commodo. Sed lobortis ante gravida, suscipit ligula vel, faucibus turpis. Morbi varius consequat ligula, sed pretium eros placerat at. Fusce consectetur egestas mauris quis porta.</p>
									</div>
								</div>
							</div>

							<div className={`${baseClass}__item-date`}>
								<div className={`${baseClass}__date-label`}>
									<span>29 June 2017</span>
								</div>
							</div>
						</div>
					</div>
				</div>
				<InspectorControls>
					<PanelBody title={__( 'Settings', 'getwid' )} initialOpen={true}>
						<SelectControl
							label={__( 'Image Size', 'getwid' )}
							help={__( 'For images from Media Library only.', 'getwid' )}
							value={imageSize}
							onChange={this.onChangeImageSize}
							options={Getwid.settings.image_sizes}
						/>
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	}	

	componentDidUpdate(prevProps, prevState) {
		/* */
	}	

	componentDidMount() {		
		let scrolling = false;

		const { clientId, baseClass } = this.props;

		const $block = $( `#block-${clientId}` );
		
		const $cardItem = $block.find( `.${baseClass}__card`       );
		const $nodeItem = $block.find( `.${baseClass}__node-inner` );
		const $dateItem = $block.find( `.${baseClass}__item-date`  );

		if ( $cardItem[ 0 ].getBoundingClientRect().top > window.innerHeight * 0.8 ) {
			$cardItem.addClass( 'is-hidden' );
			$dateItem.addClass( 'is-hidden' );
			$nodeItem.addClass( 'is-hidden' );
		}

		const checkScroll = () => {
			if ( $cardItem.hasClass( 'is-hidden' ) && $cardItem[ 0 ].getBoundingClientRect().top <= window.innerHeight * 0.8 ) {
				$cardItem.addClass( 'bounce-in' );
				$dateItem.addClass( 'bounce-in' );
				$nodeItem.addClass( 'bounce-in' );

				$cardItem.removeClass( 'is-hidden' );	
				$dateItem.removeClass( 'is-hidden' );
				$nodeItem.removeClass( 'is-hidden' );
			}
			scrolling = false;
		}

		const $root = $( '.edit-post-layout' ).find( 'div[class$=__content]' );

		$root.scroll( () => {
			if ( ! scrolling ) {
				scrolling = true;
				
				( ! window.requestAnimationFrame ) ? setTimeout(
					() => checkScroll(), 250
				) : window.requestAnimationFrame(
					() => checkScroll()
				);
			}
		});

		this.setElementsProperty();
	}
}

export default compose( [
	withSelect( ( select, props ) => {
		const { getMedia } = select( 'core' );
		const { id } = props.attributes;
		return {
			image: id ? getMedia( id ) : null
		};
	} ),
] )( GetwidTimelineItem );