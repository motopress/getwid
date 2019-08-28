/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import classnames from 'classnames';
import { isEqual, get, pick } from 'lodash';

const { compose } = wp.compose;
const { withSelect, withDispatch } = wp.data;
const { Component, Fragment } = wp.element;
const { Toolbar, IconButton, PanelBody, SelectControl, BaseControl, Button } = wp.components;
const { MediaUploadCheck, MediaUpload, BlockControls, InspectorControls, InnerBlocks, RichText, getColorObjectByAttributeValues } = wp.editor;

/**
* Create an Component
*/
class GetwidTimelineItem extends Component {

	constructor() {
		super(...arguments);

		this.onSelectImage = this.onSelectImage.bind( this );
		this.onChangeImageSize = this.onChangeImageSize.bind( this );

		this.state = {
			rootClientId: this.setRootId()
		}
	}

	setRootId() {
		const { clientId, getBlockRootClientId } = this.props;
		return getBlockRootClientId( clientId );
	}

	updateItemsCount(count) {
		const { rootClientId } = this.state;
		const { getBlock, updateBlockAttributes } = this.props;

		const itemsCount = getBlock( rootClientId ).innerBlocks.length + 1;

		updateBlockAttributes( rootClientId, {
			itemsCount
		} );
	}

	pickRelevantMediaFiles(image, imageSize) {
		const imageProps = pick( image, [ 'id', 'link', 'caption' ] );
		imageProps.original_url = image.url || image.source_url;
		imageProps.alt = image.alt || image.alt_text;
		imageProps.url = get( image, [ 'sizes', imageSize, 'url' ] ) || get( image, [ 'media_details', 'sizes', imageSize, 'source_url' ] ) || image.url;
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

	getBackgroundColor() {
		const { getEditorSettings } = this.props;
		const { backgroundColor, customBackgroundColor } = this.props.attributes;

		if ( backgroundColor ) {
			const editorColors = get( getEditorSettings(), [ 'colors' ], [] );
			const colorObject  = getColorObjectByAttributeValues( editorColors, backgroundColor );

			return colorObject.color;

		} else if ( customBackgroundColor ) {
			return customBackgroundColor;
		}
	}

	render() {		
		
		const { url, id, cardPosition, imageSize } = this.props.attributes;
		const { className, baseClass, setAttributes } = this.props;

		const wrapperClass = {
			className: classnames( `${baseClass}__wrapper`, {
				'has-card-left' : cardPosition == 'left',
				'has-card-right': cardPosition == 'right'
			} )
		}

		const backgroundColor = this.getBackgroundColor();

		return (
			<Fragment>
				<BlockControls>
					<Toolbar>
						{ ! url && (
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
												icon={'edit'}
												onClick={open}
											/>
										</div>
									)}
								/>
							</MediaUploadCheck>
						) }						
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
					<div {...wrapperClass}>
						<div className={`${baseClass}__card`}>
							<div className={`${baseClass}__card-inner`} style={{ backgroundColor }}>
								{ url && ( <div className={`${baseClass}__image-wrapper`}>
										<img className={`${baseClass}__image`} src={url} alt={''}/>
									</div>
								) }
								<div className={`${baseClass}__content-wrapper`}>
									<InnerBlocks
										templateLock={ false }
										templateInsertUpdatesSelection={false}
										template={[
											[ 'core/heading'  , { placeholder: __( 'Write heading…', 'getwid' )  } ],
											[ 'core/paragraph', { placeholder: __( 'Write text…'   , 'getwid' )  } ]
										]}
									/>
								</div>
							</div>

							<div className={`${baseClass}__card-arrow`} style={{ backgroundColor }}></div>
						</div>
						
						<div className={`${baseClass}__point`}>
							<div className={`${baseClass}__point-content`}></div>
						</div>						

						<div className={`${baseClass}__meta`}>
							<RichText
								placeholder={ __( 'Write text…', 'getwid' ) }
								value={ this.props.attributes.meta }
								formattingControls= { [ 'bold', 'italic', 'strikethrough' ] }
								onChange= { meta =>
									this.props.setAttributes( { meta } )
								}
								className={`${baseClass}__meta-content`}
								keepPlaceholderOnFocus
							/>
						</div>
					</div>
				</div>
				<InspectorControls key='inspector'>
					<PanelBody title={__( 'Settings', 'getwid' )} initialOpen={true}>
						{ url && (
							<SelectControl
								label={__( 'Image Size', 'getwid' )}
								help={__( 'For images from Media Library only.', 'getwid' )}
								value={imageSize}
								onChange={this.onChangeImageSize}
								options={Getwid.settings.image_sizes}
							/>
						) }						
					</PanelBody>
					{ url && (
						<PanelBody title={__( 'Image', 'getwid' )} initialOpen={true}>
							<MediaUpload
								onSelect={this.onSelectImage}
								allowedTypes={[ 'image' ]}
								value={id}
								render={( { open } ) => (
									<BaseControl>
										{ !! url && (
											<div className='getwid-background-image-wrapper'>
												<img src={url} />
											</div>
										)}
										<Button
											isDefault
											onClick={open}
										>
											{ ! id && __( 'Select Image', 'getwid' )}
											{ !! id && __( 'Replace Image', 'getwid' )}
										</Button>
									</BaseControl>
								)}
							/>
						</PanelBody>	
					)}	
					<SelectControl
						label={__( 'Card Alignment', 'getwid' )}
						value={ cardPosition }
						onChange={ cardPosition => {
							setAttributes( { cardPosition } );
						} }
						options={ [
							{ value: ''     , label: __( 'Auto' , 'getwid' ) },
							{ value: 'left' , label: __( 'Left' , 'getwid' ) },
							{ value: 'right', label: __( 'Right', 'getwid' ) }
						] }
					/>
				</InspectorControls>
			</Fragment>
		);
	}

	componentDidUpdate(prevProps, prevState) {
		/* */
	}

	componentWillUnmount() {
		// const { clientId, updateLineHeight, removeBlock } = this.props;

		// const $block = $( `#block-${clientId}` );
		// const $card  = $block.find( `.${baseClass}__card` );

		// this.observer.unobserve( $card[ 0 ] );
		// updateLineHeight( true );
	}

	componentDidMount() {

		let scrolling = false;

		const { entranceAnimation } = this.props.attributes;
		const { clientId, baseClass } = this.props;

		const $block = $( `#block-${clientId}` );
		
		const $card  = $block.find( `.${baseClass}__card`          );
		const $point = $block.find( `.${baseClass}__point-content` );
		const $meta  = $block.find( `.${baseClass}__meta`  		   );

		if ( $card[ 0 ].getBoundingClientRect().top > window.innerHeight * 0.8 ) {
			$card .addClass( 'is-hidden' );
			$meta .addClass( 'is-hidden' );
			$point.addClass( 'is-hidden' );
		}

		const checkScroll = () => {
			if ( $card.hasClass( 'is-hidden' ) && $card[ 0 ].getBoundingClientRect().top <= window.innerHeight * 0.8 ) {

				$card .addClass( entranceAnimation );
				$meta .addClass( entranceAnimation );
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

		const { updateLineHeight } = this.props;

		// this.waitLoadContent = setInterval( () => {
		// 	if ( document.readyState == 'complete' ) {
		// 		updateLineHeight();

		// 		this.observer = new ResizeObserver( () => updateLineHeight() );
		// 		this.observer.observe( $card[ 0 ] );
				
		// 		clearInterval( this.waitLoadContent );
		// 	}
		// }, 1 );
	}
}

export default compose( [
	withSelect( ( select, props ) => {
		const { getMedia } = select( 'core' );
		const { getBlock, getEditorSettings, getBlockRootClientId } = select( 'core/editor' );
		const { id } = props.attributes;
		return {
			getBlock,
			getEditorSettings,
			getBlockRootClientId,
			image: id ? getMedia( id ) : null
		};
	} ),
	withDispatch( ( dispatch, props ) => {
		const { updateBlockAttributes  } = dispatch( 'core/editor' );
		return {
			updateBlockAttributes
		};
	} ),
] )( GetwidTimelineItem );