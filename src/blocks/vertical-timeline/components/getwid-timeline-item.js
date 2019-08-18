/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import { isEqual, get, pick } from 'lodash';

const { compose } = wp.compose;
const { withSelect } = wp.data;
const { select, dispatch } = wp.data;
const { Component, Fragment } = wp.element;
const { Toolbar, IconButton, PanelBody, SelectControl } = wp.components;
const { MediaUploadCheck, MediaUpload, BlockControls, InspectorControls, InnerBlocks, RichText, getColorObjectByAttributeValues } = wp.editor;

/**
* Create an Component
*/
class GetwidTimelineItem extends Component {

	constructor() {
		super(...arguments);

		this.pickRelevantMediaFiles = this.pickRelevantMediaFiles.bind( this );
		
		this.onSelectImage     = this.onSelectImage    .bind( this );
		this.onChangeImageSize = this.onChangeImageSize.bind( this );

		this.updateLineHeight = this.updateLineHeight.bind( this );
		this.initState 		  = this.initState		 .bind( this );

		this.state = {
			rootClientId: this.initState()
		}
	}

	initState() {
		const { clientId } = this.props;
		const rootClientId = select( 'core/editor' ).getBlockRootClientId( clientId );
		
		return rootClientId;
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

	render() {
		
		const { url, id, imageSize, backgroundColor, customBackgroundColor } = this.props.attributes;
		const { className, baseClass, setAttributes } = this.props;

		let secondColor;
		if ( backgroundColor ) {
			const { getEditorSettings } = select( 'core/editor' );
			const editorColors = get( getEditorSettings(), [ 'colors' ], [] );
			const colorObject = getColorObjectByAttributeValues( editorColors, backgroundColor );

			secondColor = colorObject.color;

		} else if ( customBackgroundColor ) {
			secondColor = customBackgroundColor;
		}

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
						<div className={`${baseClass}__card`} >
							<div className={`${baseClass}__card-inner`} style={{ backgroundColor: secondColor }}>
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

							<div className={`${baseClass}__card-arrow`} style={{ backgroundColor: secondColor }}></div>
						</div>

						<div className={`${baseClass}__hide-line`}></div>
						
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
								// style={ {
								// 	backgroundColor: backgroundColor.color,
								// 	color: textColor.color
								// } }
								keepPlaceholderOnFocus
							/>
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

		const { clientId } = this.props;

		const { getBlock, getEditorSettings } = select( 'core/editor' );
		const { updateBlockAttributes } = dispatch( 'core/editor' );

		const innerBlocks = getBlock( clientId ).innerBlocks;
		const { textColor, customTextColor } = this.props.attributes;
		const { backgroundColor, customBackgroundColor } = this.props.attributes;

		if ( ! isEqual( prevProps, this.props ) ) {
			if ( innerBlocks.length ) {
				$.each( innerBlocks, (index, item) => {
					if ( textColor ) {
						const editorColors = get( getEditorSettings(), [ 'colors' ], [] );
						const colorObject = getColorObjectByAttributeValues( editorColors, textColor );

						updateBlockAttributes( item.clientId, { customTextColor: colorObject.color } );
					} else {
						updateBlockAttributes( item.clientId, { customTextColor } );
					}					
				} );

				const [ first, second ] = innerBlocks;

				updateBlockAttributes( second.clientId, {
					backgroundColor,
					customBackgroundColor
				} );
			}
		}
	}

	componentWillUnmount() {
		this.updateLineHeight( false );		
	}

	updateLineHeight(init = true) {		
		const { rootClientId } = this.state;
		const $root = $( `#block-${rootClientId}` );

		const { baseClass } = this.props;
		const element = $root.find( 'div[class$=__hide-line]' )[ 0 ];
		const $items  = $root.find( `.${baseClass}` );

		const [ first, second, ...rest ] = $items;

		const setLineHeight = () => {
			const { clientId } = this.props;
			const $block = $( `#block-${clientId}` );

			const $wrappers = $block.find( 'div[class$=__wrapper]' );
			const paddingBottom = $( $wrappers[ 0 ] ).css( 'padding-bottom' );

			$( element ).css( { 'height': parseFloat( paddingBottom ) + 32 } );
		}

		if ( init ) {
			second ?
				$( element ).css( { 'height': 32 } ) :
				setLineHeight();
		} else {
			rest.length ?
				$( element ).css( { 'height': 32 } ) :
				setLineHeight();
		}		
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

		this.updateLineHeight();
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