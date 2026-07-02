/**
* External dependencies
*/
import { __ } from 'wp.i18n';

import classnames from 'classnames';
import { get, pick } from 'lodash';

/**
 * Internal dependencies
 */
import Inspector from './inspector';

/**
* WordPress dependencies
*/
const { compose } = wp.compose;
const { withSelect } = wp.data;
const { Component, Fragment, createRef } = wp.element;
const { ToolbarGroup, ToolbarButton } = wp.components;
const { MediaUploadCheck, MediaUpload, BlockControls, InnerBlocks, RichText, getColorObjectByAttributeValues } = wp.blockEditor || wp.editor;

/**
* Module Constants
*/
const allowedFormats = [
	'core/bold',
	'core/italic',
	'core/link',
	'core/image',
	'core/strikethrough',
	'core/text-color'
];

/**
* Create an Component
*/
class GetwidTimelineItem extends Component {

	constructor() {
		super(...arguments);

		this.onSelectImage = this.onSelectImage.bind( this );
		this.onChangeImageSize = this.onChangeImageSize.bind( this );

		this.timelineItemRef = createRef();

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

		imageProps.url =
			get( image, [ 'media_details', 'sizes', imageSize, 'source_url' ] ) ||
			get( image, [ 'media_details', 'sizes', 'large', 'source_url' ] ) ||
			get( image, [ 'media_details', 'sizes', 'full', 'source_url' ] ) ||
			get( image, [ 'sizes', imageSize, 'url' ] ) ||
			image.url ||
			image.source_url;

		return imageProps;
	};

	onSelectImage( image ) {
		const { imageSize } = this.props.attributes;
		const { setAttributes } = this.props

		if ( ![ 'full', 'large', 'medium', 'thumbnail' ].includes( imageSize ) ) {
			setAttributes( {
				imageSize: undefined,
				id: undefined,
				url: undefined
			} );
		}

		setAttributes( {
			...this.pickRelevantMediaFiles( image, imageSize )
		} );
	}

	onChangeImageSize(imageSize) {

		const { imgObj, setAttributes } = this.props;

		if ( imgObj ) {
			setAttributes( {
				imageSize,
				...this.pickRelevantMediaFiles( imgObj, imageSize )
			} );
		}
	}

	getColors() {
		const { getSettings } = this.props;
		const { outerParent } = this.props.attributes;

		const customBackgroundColor = outerParent && outerParent.attributes.customBackgroundColor ? outerParent.attributes.customBackgroundColor : undefined;
		const backgroundColor       = outerParent && outerParent.attributes.backgroundColor       ? outerParent.attributes.backgroundColor       : undefined;

		const getColorBySlug = slug => {
			const editorColors = get( getSettings(), [ 'colors' ], [] );
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
			className: classnames(
				className,
				outerParent?.attributes?.animation,
				{
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
				<Inspector
					{ ...{
						...this.props,
						onChangeImageSize,
						onSelectImage
					} }
				/>
				<BlockControls>
					<ToolbarGroup>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={this.onSelectImage}
								allowedTypes={[ 'image' ]}
								value={id}
								render={({ open }) => (
									<div>
										<ToolbarButton
											label={__( 'Select Image', 'getwid' )}
											icon='format-image'
											onClick={open}
										/>
									</div>
								)}
							/>
						</MediaUploadCheck>
						{url && ( <ToolbarButton
								label={__( 'Delete Image', 'getwid' )}
								icon='trash'
								onClick={() => {
									setAttributes({
										id : undefined,
										url: undefined
									});
								}}
							/>
						)}
					</ToolbarGroup>
				</BlockControls>
				<div
					ref={ this.timelineItemRef }
					{ ...itemClass }
					{ ...timeLineStyle }
				>
					<div className={`${baseClass}__wrapper`}>
						<div className={`${baseClass}__card`} {...cardItemStyle}>
							<div className={`${baseClass}__card-wrapper`}>
								{url && ( <div className={`${baseClass}__image-wrapper`}>
										<img className={`${baseClass}__image`} src={url} alt=''/>
									</div>
								)}
								<div className={`${baseClass}__content-wrapper`} {...contentWrapperStyle}>
									<InnerBlocks
										templateLock={false}
										templateInsertUpdatesSelection={false}
										template={[
											[ 'core/heading' , { level: 3, placeholder: __( 'Write heading…', 'getwid' ) } ],
											[ 'core/paragraph', { placeholder: __( 'Write text…' , 'getwid' ) } ]
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
								value={this.props.attributes.meta}
								allowedFormats={allowedFormats}
								onChange= {meta =>
									this.props.setAttributes({ meta })
								}
								className={`${baseClass}__meta-content`}
							/>
						</div>
					</div>
				</div>
			</Fragment>
		);
	}

	componentDidUpdate(prevProps, prevState) {
		const { marginBottom } = this.props.attributes.outerParent || {};
		const { marginBottom: oldMarginBottom } = prevProps.attributes.outerParent || {};

		if ( marginBottom !== oldMarginBottom ) {
			this.props.setScrollProgressPreview();
		}
	}
}

export default compose( [
	withSelect( ( select, props ) => {
		const { getMedia } = select( 'core' );
		const { getBlock, getSettings, getBlockRootClientId } = select( 'core/block-editor' );
		const { id } = props.attributes;
		return {
			getBlock,
			getSettings,
			getBlockRootClientId,
			imgObj: id ? getMedia( id ) : null
		};
	} )
] )( GetwidTimelineItem );
