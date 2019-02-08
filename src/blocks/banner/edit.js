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
	getColorClassName,
	URLInput,
	withColors,
} = wp.editor;

const {compose} = wp.compose;

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
class Edit extends Component {

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
				contentMaxWidth,
				verticalAlign,
				horizontalAlign,
				backgroundOpacity,
				blockAnimation,
				textAnimation,

				customBackgroundColor,
				customTextColor
			},
			setAttributes,
			isSelected,
			className,

			setBackgroundColor,
			setTextColor,
			
			backgroundColor,
			textColor,			
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

		const imageProps = {
			className: classnames(
				`${className}__wrapper`,
				{				
					'has-background': (backgroundColor.color),
					[ backgroundColor.class ]: (backgroundColor.class),				
				}
			),
			style: {
				backgroundColor: (this.props.backgroundColor.color ? this.props.backgroundColor.color : this.props.attributes.customBackgroundColor),
			},
		};

	/*	const captionStyle = {
			minHeight: minHeight,
		};*/

		const captionProps = {
			className: classnames(
				`${className}__caption`,
				{
					'has-text-color': textColor.color,
					[ textColor.class ]: textColor.class,					
				},
			),
			style: {
				color: ((typeof this.props.attributes.textColor != 'undefined' && typeof this.props.attributes.textColor.class == 'undefined') ? this.props.textColor.color : (customTextColor ? customTextColor : undefined)),
				minHeight: minHeight,
			},
		};

		const wrapperProps = {
			className: classnames(
				className,
				`${className}--${blockAnimation}`,
				{
					[ `${className}--${textAnimation}` ]: textAnimation != 'none' && !isSelected,
					[ `${className}--foreground-${backgroundOpacity}` ]: backgroundOpacity != 35,
					[ `${className}--vertical-${verticalAlign}` ]: verticalAlign != 'center',
					[ `${className}--horizontal-${horizontalAlign}` ]: horizontalAlign != 'center',				
				},
				align ? `align${ align }` : null,
			),
		};

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
				<div {...wrapperProps}>
					<Fragment>

						{ !! url && (
							<div {...imageProps}>
								{ (VIDEO_BACKGROUND_TYPE === type && !!url ) ? (
									<video
										className= {`${className}__video ${className}__source`}
										autoPlay
										muted
										loop
										src={ url }
									/>
								) : (<img src={ url } alt="" className= {`${className}__image ${className}__source` }/>) }

								<Fragment>
									<div {...captionProps}>
										<div style={{maxWidth: contentMaxWidth}} className= {`${className}__caption-wrapper`}>

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
									</div>
								</Fragment>
							
					
							</div>
						) }	
					</Fragment>
				</div>
					{isSelected &&
						(
							<Fragment>
								<div className= {`${className}__url-field`}>
									<Dashicon icon="admin-links"/>									
									<URLInput
										autoFocus={ false }
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

export default compose( [
	withColors( 'backgroundColor', { textColor: 'color' } ),
] )( Edit );