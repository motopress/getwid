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
	URLInput
} = wp.editor;

const {
	IconButton,
	PanelBody,
	RangeControl,
	ToggleControl,
	Toolbar,
	Dashicon
} = wp.components;

const {Component, Fragment} = wp.element;
const $ = window.jQuery;

const alignmentsList = [ 'wide', 'full' ];

/**
 * Constants
 */
const ALLOWED_MEDIA_TYPES = [ 'image', 'video' ];
const IMAGE_BACKGROUND_TYPE = 'image';
const VIDEO_BACKGROUND_TYPE = 'video';

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
				id,
				url,
				type,
				title,
				text,
				link,
				newWindow,
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

		const onSelectMedia = ( media ) => {
			if ( ! media || ! media.url ) {
				setAttributes( { url: undefined, id: undefined } );
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
				id: media.id,
				url: media.url,
				type: mediaType,
			} );
		};

		const wrapperStyle = {	
			color: textColor,
		};

		const imageStyle = {
			backgroundColor: overlayColor,
		};

		const captionStyle = {
			minHeight: minHeight,
		};

		const wrapperClasses = classnames(
			className,
			`${className}--${blockAnimation}`,
			{
				[ `${className}--${textAnimation}` ]: textAnimation != 'none' && !isSelected,
				[ `${className}--foreground-${backgroundOpacity}` ]: backgroundOpacity != 35,
				[ `${className}--vertical-${verticalAlign}` ]: verticalAlign != 'center',
				[ `${className}--horizontal-${horizontalAlign}` ]: horizontalAlign != 'center',
			},
			align ? `align${ align }` : null,
		);

		const controls = (
			<Fragment>
				<BlockControls>
					<BlockAlignmentToolbar
						controls= {alignmentsList}
						value={ align }
						onChange={align => setAttributes({align})}
					/>
					{ !! url && (
						<Fragment>
							<MediaUploadCheck>
								<Toolbar>
									<MediaUpload
										onSelect={ onSelectMedia }
										allowedTypes={ ALLOWED_MEDIA_TYPES }
										value={ id }
										render={ ( { open } ) => (
											<IconButton
												className="components-toolbar__control"
												label={ __( 'Edit media', 'getwid' ) }
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
				{ !! url && (
					<Inspector {...{ setAttributes, ...this.props }} key='inspector'/>
				) }
			</Fragment>
		);

		if ( ! url ) {
			const hasTitle = ! RichText.isEmpty( title );
			const icon = hasTitle ? undefined : 'format-image';
			const label = hasTitle ? (
				<Fragment>
					<RichText
						tagName="p"
						value={ title }
						onChange={title => setAttributes({title})}
					/>
					<RichText
						tagName="p"
						value={ text }
						onChange={text => setAttributes({text})}
					/>							
				</Fragment>
			) : __( 'Banner', 'getwid' );

			return (
				<Fragment>
					{ controls }
					<MediaPlaceholder
						icon={ icon }
						className={ className }
						labels={ {
							title: label,
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
					className={ wrapperClasses }
					style={ wrapperStyle }
				>
					<Fragment>
						{ VIDEO_BACKGROUND_TYPE === type && (
							<video
								className= {`${className}__video`}
								autoPlay
								muted
								loop
								src={ url }
							/>
						) }
						{ !! url && (
							<figure
								className= {`${className}__wrapper`}
								style= {imageStyle}
							>
							<img src={ url } alt="" className= {`${className}__image` }/>
																
								<Fragment>
									<figcaption
										className= {`${className}__caption`}
										style= {captionStyle}
									>
										<div className= {`${className}__caption-wrapper`}>

											<RichText
												tagName="span"
												className= {`${className}__title`}
												placeholder={ __( 'Enter title here...', 'getwid' ) }
												value={ title }
												onChange={title => setAttributes({title})}	
												formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }							
											/>

											<RichText
												tagName="p"
												className= {`${className}__text`}
												placeholder={ __( 'Enter text here...', 'getwid' ) }
												value={ text }
												onChange={text => setAttributes({text})}
												formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
											/>

										</div>
									</figcaption>
								</Fragment>
							
					
							</figure>
						) }	
					</Fragment>
				</div>
					{isSelected &&
						(
							<Fragment>
								<div className= {`${className}__url-field`}>
									<Dashicon icon="admin-links"/>									
									<URLInput
										value={ link }
										onChange={ link => setAttributes({link}) }
									/>
									<ToggleControl
										label={ __( 'Open in New Tab', 'getwid' ) }
										checked={ newWindow }
										onChange={ () => {
											setAttributes( { newWindow: !newWindow } );
										}}
									/>
								</div>
							</Fragment>						
						)
					}
			</Fragment>
		);
	}

}