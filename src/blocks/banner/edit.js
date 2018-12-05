import classnames from 'classnames';
import animate from 'GetwidUtils/animate';
import Inspector from './inspector';
import './editor.scss'
/**
 * Internal block libraries
 */
const {__} = wp.i18n;

const {
	BlockControls,
	BlockAlignmentToolbar,
	MediaPlaceholder,
	MediaUpload,
	MediaUploadCheck,
	AlignmentToolbar,
	PanelColorSettings,
	RichText,
	withColors,
	getColorClassName,
} = wp.editor;

const {
	IconButton,
	PanelBody,
	RangeControl,
	ToggleControl,
	Toolbar,
	withNotices,
	SVG,
	Path,
} = wp.components;

const {Component, Fragment} = wp.element;
const $ = window.jQuery;

/**
 * Constants
 */
const ALLOWED_MEDIA_TYPES = [ 'image', 'video' ];
const IMAGE_BACKGROUND_TYPE = 'image';
const VIDEO_BACKGROUND_TYPE = 'video';

function backgroundImageStyles( backgroundUrl ) {
	return backgroundUrl ?
		{ backgroundImage: `url(${ backgroundUrl })` } :
		{};
}

/**
 * Create an Inspector Controls wrapper Component
 */
export default class Edit extends Component {

	constructor() {
		super(...arguments);
	}

	render() {
		const {
			attributes: {
				backgroundId,
				backgroundUrl,
				backgroundType,
				title,
				text,
				link,
				align,
				minHeight,
				verticalAlign,
				horizontalAlign,
				textColor,
				overlayColor,
				backgroundOpacity,
				blockAnimation,
				textAnimation,
			},
			setAttributes,
			isSelected,
			className,
		} = this.props;

		const updateAlignment = ( nextAlign ) => setAttributes( { align: nextAlign } );
		const onSelectMedia = ( media ) => {
			if ( ! media || ! media.url ) {
				setAttributes( { backgroundUrl: undefined, backgroundId: undefined } );
				return;
			}
			let mediaType;
			// for media selections originated from a file upload.
			if ( media.media_type ) {
				if ( media.media_type === IMAGE_BACKGROUND_TYPE ) {
					mediaType = IMAGE_BACKGROUND_TYPE;
				} else {
					// only images and videos are accepted so if the media_type is not an image we can assume it is a video.
					// Videos contain the media type of 'file' in the object returned from the rest api.
					mediaType = VIDEO_BACKGROUND_TYPE;
				}
			} else { // for media selections originated from existing files in the media library.
				if (
					media.type !== IMAGE_BACKGROUND_TYPE &&
					media.type !== VIDEO_BACKGROUND_TYPE
				) {
					return;
				}
				mediaType = media.type;
			}

			setAttributes( {
				backgroundId: media.id,
				backgroundUrl: media.url,
				backgroundType: mediaType,
			} );
		};
/*		const toggleParallax = () => setAttributes( { hasParallax: ! hasParallax } );
		const setTitle = ( newTitle ) => setAttributes( { title: newTitle } );*/

		const style = {
			...(
				backgroundType === IMAGE_BACKGROUND_TYPE ?
					backgroundImageStyles( backgroundUrl ) :
					{}
			),
			// backgroundColor: overlayColor.color,
		};

		const classes = classnames(
			className,
			// contentAlign !== 'center' && `has-${ contentAlign }-content`,
			{
				'has-parallax': true,
			}
		);

		const controls = (
			<Fragment>
				<BlockControls>
					<BlockAlignmentToolbar
						value={ align }
						onChange={ updateAlignment }
					/>
					{ !! backgroundUrl && (
						<Fragment>
							<MediaUploadCheck>
								<Toolbar>
									<MediaUpload
										onSelect={ onSelectMedia }
										allowedTypes={ ALLOWED_MEDIA_TYPES }
										value={ backgroundId }
										render={ ( { open } ) => (
											<IconButton
												className="components-toolbar__control"
												label={ __( 'Edit media' ) }
												icon="edit"
												onClick={ open }
											/>
										) }
									/>
								</Toolbar>
							</MediaUploadCheck>
						</Fragment>
					) }
				</BlockControls>
				{ !! backgroundUrl && (
					<Inspector {...{ setAttributes, ...this.props }} key='inspector'/>
				) }
			</Fragment>
		);

		if ( ! backgroundUrl ) {
			const hasTitle = ! RichText.isEmpty( title );
			const icon = hasTitle ? undefined : 'format-image';
			const label = hasTitle ? (
				<Fragment>
					<RichText
						tagName="h2"
						value={ title }
						onChange={ setTitle }
						inlineToolbar
					/>
					<RichText
						tagName="h3"
						value={ title }
						onChange={ setTitle }
						inlineToolbar
					/>							
				</Fragment>
			) : __( 'Cover', 'getwid' );

			return (
				<Fragment>
					{ controls }
					<MediaPlaceholder
						icon={ icon }
						className={ className }
						labels={ {
							title: label,
							instructions: __( 'Drag an image or a video, upload a new one or select a file from your library.' ),
						} }
						onSelect={ onSelectMedia }
						accept="image/*"
						allowedTypes={ ALLOWED_MEDIA_TYPES }
					/>
				</Fragment>
			);
		}

		return (
			<Fragment>
				{ controls }
				<div
					data-url={ backgroundUrl }
					style={ style }
					className={ classes }
				>
					{ VIDEO_BACKGROUND_TYPE === backgroundType && (
						<video
							className="wp-block-cover__video-background"
							autoPlay
							muted
							loop
							src={ backgroundUrl }
						/>
					) }
					{ ( ! RichText.isEmpty( title ) || isSelected ) && (
						<RichText
							tagName="p"
							className="wp-block-cover-text"
							placeholder={ __( 'Title' ) }
							value={ title }
							onChange={ setTitle }
							inlineToolbar
						/>
						<RichText
							tagName="p"
							className="wp-block-cover-text"
							placeholder={ __( 'Text' ) }
							value={ title }
							onChange={ setTitle }




							value={ backgroundOpacity }
							onChange={backgroundOpacity => setAttributes({backgroundOpacity})}


							inlineToolbar
						/>						
					) }
				</div>
			</Fragment>
		);
	}















}