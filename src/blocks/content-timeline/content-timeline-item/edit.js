/**
 * Internal dependencies
 */
import Inspector from './inspector';

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import classnames from 'classnames';
import { isEqual, get, pick } from 'lodash';

const { compose } = wp.compose;
const { withSelect } = wp.data;
const { Component, Fragment } = wp.element;
const { Toolbar, IconButton } = wp.components;
const { MediaUploadCheck, MediaUpload, BlockControls, InnerBlocks, RichText, getColorObjectByAttributeValues } = wp.editor;

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
	}

	updateTimeLineView() {
		const { updateLineHeight, updateBarHeight, setColorByScroll } = this.props;

		updateLineHeight();

		const { getBlock } = this.props;
		const { rootClientId } = this.state;

		const { filling } = getBlock( rootClientId ).attributes;

		if ( $.parseJSON( filling ) ) {
			const $block = $( `#block-${rootClientId}` );

			updateBarHeight( $block );
			setColorByScroll( $block );
		}
	}

	createHeightObserver() {
		const { clientId, baseClass } = this.props;

		const $block = $( `#block-${clientId}` );
		const $cardInner = $block.find( `.${baseClass}__card-wrapper` );

		const iframe = document.createElement( 'iframe' );
		iframe.style.pointerEvents = 'none';
		iframe.style.position      = 'absolute';
		iframe.style.display       = 'block';

		iframe.style.height = '100%';
		iframe.style.width  = '100%';

		iframe.style.top    = '0';
		iframe.style.bottom = '0';
		iframe.style.left   = '0';

		iframe.style.backgroundColor = 'transparent';
		iframe.className = `${baseClass}__height-observer`;

		$( iframe ).load( () => {
			$( iframe.contentWindow ).resize( () => {
				this.updateTimeLineView();
			} );
		} );

		$cardInner.append( iframe );
	}

	getColors() {
		const { getEditorSettings } = this.props;
		const { outerParent } = this.props.attributes;

		const customBackgroundColor = outerParent && outerParent.attributes.customBackgroundColor ? outerParent.attributes.customBackgroundColor : undefined;
		const backgroundColor       = outerParent && outerParent.attributes.backgroundColor       ? outerParent.attributes.backgroundColor       : undefined;

		const getColorBySlug = slug => {
			const editorColors = get( getEditorSettings(), [ 'colors' ], [] );
			return getColorObjectByAttributeValues( editorColors, slug ).color;
		}

		const colors = {};
		colors.backgroundColor = backgroundColor ?
			getColorBySlug( backgroundColor ) : customBackgroundColor ?
			customBackgroundColor : undefined;

		return colors;
	}

	render() {

		const { url, id, cardPosition } = this.props.attributes;
		const { className, baseClass, setAttributes } = this.props;
		const { outerParent } = this.props.attributes;

		const itemClass = {
			className: classnames( className, {
					'has-card-left' : cardPosition == 'left',
					'has-card-right': cardPosition == 'right'
				}
			)
		};

		const colors = this.getColors();
		const cardItemStyle = {
			style: {
				backgroundColor: colors.backgroundColor ? colors.backgroundColor : undefined
			}
		};

		const contentWrapperStyle = {
			style: {
				paddingTop   : outerParent && outerParent.attributes.paddingTop    ? outerParent.attributes.paddingTop    : undefined,
				paddingBottom: outerParent && outerParent.attributes.paddingBottom ? outerParent.attributes.paddingBottom : undefined,
				paddingLeft  : outerParent && outerParent.attributes.paddingLeft   ? outerParent.attributes.paddingLeft   : undefined,
				paddingRight : outerParent && outerParent.attributes.paddingRight  ? outerParent.attributes.paddingRight  : undefined,
			}
		};

		const pointStyle = {
			style: {
				marginLeft : outerParent && outerParent.attributes.horizontalSpace ? outerParent.attributes.horizontalSpace : undefined,
				marginRight: outerParent && outerParent.attributes.horizontalSpace ? outerParent.attributes.horizontalSpace : undefined
			}
		};

		const timeLineStyle = {
			style: {
				marginBottom: outerParent && outerParent.attributes.marginBottom ? outerParent.attributes.marginBottom : undefined
			}
		};

		const { onChangeImageSize, onSelectImage } = this;

		return (
			<Fragment>
				<Inspector { ...{
					...this.props,
					...{ onChangeImageSize },
					...{ onSelectImage }
				} } key={ 'inspector' } />
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
				<div {...itemClass} {...timeLineStyle}>
					<div className={`${baseClass}__wrapper`}>
						<div className={`${baseClass}__card`} {...cardItemStyle}>
							<div className={`${baseClass}__card-wrapper`}>
								{ url && ( <div className={`${baseClass}__image-wrapper`}>
										<img className={`${baseClass}__image`} src={url} alt={''}/>
									</div>
								) }
								<div className={`${baseClass}__content-wrapper`} {...contentWrapperStyle}>
									<InnerBlocks
										templateLock={ false }
										templateInsertUpdatesSelection={false}
										template={[
											[ 'core/heading'  , { placeholder: __( 'Write heading…', 'getwid' ) } ],
											[ 'core/paragraph', { placeholder: __( 'Write text…'   , 'getwid' ) } ]
										]}
									/>
								</div>
							</div>
						</div>

						<div className={`${baseClass}__point`} {...pointStyle}>
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
			</Fragment>
		);
	}

	componentDidUpdate(prevProps, prevState) {
		const { outerParent } = this.props.attributes;

		if ( outerParent && prevProps.attributes.outerParent ) {
			if ( ! isEqual( prevProps.attributes.outerParent.marginBottom, outerParent.attributes.marginBottom ) ) {

				this.updateTimeLineView();
			}
		}
	}

	componentWillUnmount() {
		const { baseClass, clientId } = this.props;

		const $block = $( `#block-${clientId}` );
		const $heightObserver = $block.find( `.${baseClass}__height-observer` );

		$heightObserver.off();
	}

	componentDidMount() {

		let scrolling = false;

		const { clientId, baseClass } = this.props;

		const $block = $( `#block-${clientId}` );

		const $card  = $block.find( `.${baseClass}__card` );
		const $point = $block.find( `.${baseClass}__point-content` );
		const $meta  = $block.find( `.${baseClass}__meta` );

		const { outerParent } = this.props.attributes;
		const animation = outerParent ? outerParent.attributes.animation : 'none';

		if ( $card[ 0 ].getBoundingClientRect().top > window.innerHeight * 0.8 && animation != 'none' ) {
			$card .addClass( 'is-hidden' );
			$meta .addClass( 'is-hidden' );
			$point.addClass( 'is-hidden' );
		}

		const checkScroll = () => {
			if ( $card.hasClass( 'is-hidden' ) && $card[ 0 ].getBoundingClientRect().top <= window.innerHeight * 0.8 ) {

				$card .addClass( animation );
				$meta .addClass( animation );
				$point.addClass( 'bounce-in' );

				$card .removeClass( 'is-hidden' );
				$meta .removeClass( 'is-hidden' );
				$point.removeClass( 'is-hidden' );
			}
			scrolling = false;
		}

		const $root = $( '.edit-post-layout' ).find( 'div[class$=__content]' );

		if ( animation != 'none' ) {
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

		this.createHeightObserver();
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
	} )
] )( GetwidTimelineItem );
