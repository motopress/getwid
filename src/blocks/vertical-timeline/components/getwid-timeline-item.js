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

		this.pickRelevantMediaFiles = this.pickRelevantMediaFiles.bind( this );
		
		this.onSelectImage     = this.onSelectImage    .bind( this );
		this.onChangeImageSize = this.onChangeImageSize.bind( this );
	}

	pickRelevantMediaFiles(image, imageSize) {

		console.log( image );
		console.log( imageSize );

		const imageProps = pick( image, [ 'id', 'link', 'caption' ] );
		imageProps.original_url = image.url || image.source_url;
		imageProps.alt = image.alt || image.alt_text;
		imageProps.url = get( image, [ 'sizes', imageSize, 'url' ] ) || get( image, [ 'media_details', 'sizes', imageSize, 'source_url' ] ) || image.url;

		console.log( imageProps );

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

		//console.log( imageSize );

		const { image, setAttributes } = this.props;

		//console.log( image );

		if ( image ) {
			setAttributes( {
				imageSize,
				...this.pickRelevantMediaFiles( image, imageSize )
			} );
		}			
	};

	render() {
		
		const { url, id, imageSize } = this.props.attributes;
		const { className, baseClass, setAttributes } = this.props;

		return (
			<Fragment>
				<BlockControls>
					<Toolbar>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={this.onSelectImage}
								allowedTypes={[ 'image' ]}
								value={id}
								render={( { open } ) => (
									<div>
										<IconButton
											className={'components-toolbar__control'}
											label={__( 'Edit Image', 'getwid' )}
											icon={'format-image'}
											onClick={open}
										/>
									</div>
								)}
							/>
						</MediaUploadCheck>
						{ url && ( <IconButton
								className={'components-toolbar__control'}
								label={__( 'Delete Image', 'getwid' )}
								icon={'trash'}
								onClick={() => {
									setAttributes( {
										id : undefined,
										url: undefined
									});
								}}
							/>
						) }
					</Toolbar>
				</BlockControls>
				<div className={`${className}`}>
					<div className={`${baseClass}__wrapper`}>
						<div className={`${baseClass}__hide-line`}></div>

						<div className={`${baseClass}__card`}>
							<div className={`${baseClass}__card-inner`}>
								{ url && ( <MediaUpload
										onSelect={ this.onSelectImage }
										allowedTypes={[ 'image' ]}
										value={id}
										render={( { open } ) => (
											<div className={`${baseClass}__image-wrapper`} onClick={open}>
												<img className={`${baseClass}__image`} src={url} alt={''}/>
											</div>
										)}
									/>
								) }								
								<div className={`${baseClass}__content-wrapper`}>
									<h5>Aliquam erat volutpat</h5>
									<div className={`${baseClass}__card-desc`}>Lorem ipsum dolor sit amet conse ctetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</div>
								</div>
							</div>

							<div className={`${baseClass}__card-arrow`}></div>
						</div>

						<div className={`${baseClass}__point`}>
							<div className={`${baseClass}__point-content`}></div>							
						</div>						

						<div className={`${baseClass}__meta`}>
							<div className={`${baseClass}__meta-content`}>
								<span>29 June 2017</span>
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
		
		const $card  = $block.find( `.${baseClass}__card`       );
		const $point = $block.find( `.${baseClass}__point-content` );
		const $meta  = $block.find( `.${baseClass}__meta`  );

		if ( $card[ 0 ].getBoundingClientRect().top > window.innerHeight * 0.8 ) {
			$card .addClass( 'is-hidden' );
			$meta .addClass( 'is-hidden' );
			$point.addClass( 'is-hidden' );
		}

		const checkScroll = () => {
			if ( $card.hasClass( 'is-hidden' ) && $card[ 0 ].getBoundingClientRect().top <= window.innerHeight * 0.8 ) {
				$card .addClass( 'bounce-in' );
				$meta .addClass( 'bounce-in' );
				$point.addClass( 'bounce-in' );

				$card .removeClass( 'is-hidden' );	
				$meta .removeClass( 'is-hidden' );
				$point.removeClass( 'is-hidden' );
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