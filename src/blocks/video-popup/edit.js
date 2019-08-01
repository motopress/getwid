/**
* External dependencies
*/
import classnames from 'classnames';
import attributes from './attributes';
import Inspector from './inspector';
import './editor.scss'
import './style.scss'
import {
	get
} from "lodash";


/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {
	BlockControls,
	BlockAlignmentToolbar,
	MediaPlaceholder,
	MediaUpload,
	MediaUploadCheck,
	RichText,
	URLInput,
	withColors,
} = wp.editor;
const {compose} = wp.compose;
const {
	withSelect
} = wp.data;
const {
	IconButton,
	ToggleControl,
	Toolbar,
	Dashicon
} = wp.components;
const {Component, Fragment} = wp.element;
const $ = window.jQuery;


/**
* Module Constants
*/
const alignmentsList = [ 'wide', 'full' ];
const ALLOWED_MEDIA_TYPES = [ 'image', 'video' ];
const IMAGE_BACKGROUND_TYPE = 'image';
const VIDEO_BACKGROUND_TYPE = 'video';
const NEW_TAB_REL = 'noreferrer noopener';
const baseClass = 'wp-block-getwid-video-popup';

/**
* Create an Component
*/
class Edit extends Component {

	constructor() {
		super(...arguments);

        this.onSetNewTab = this.onSetNewTab.bind( this );
	}

    onSetNewTab( value ) {
        const { rel } = this.props.attributes;
        const linkTarget = value ? '_blank' : undefined;

        let updatedRel = rel;
        if ( linkTarget && ! rel ) {
            updatedRel = NEW_TAB_REL;
        } else if ( ! linkTarget && rel === NEW_TAB_REL ) {
            updatedRel = undefined;
        }

        this.props.setAttributes( {
            linkTarget,
            rel: updatedRel,
        } );
	}
	
	initPopUp(){
		jQuery('.lightbox-video').magnificPopup({
			type: 'iframe',						
			iframe: {
			  patterns: {
				youtube: {
					index: 'youtu', // String that detects type of video (in this case YouTube). Simply via url.indexOf(index).				
					id: function(url){
						if (url.indexOf('youtube.com/') != -1){
							var link = url.match(/v=(.+)(\&|$)/);
							debugger;
							if (link[1] !== undefined){
								return link[1];
							}							
						}

						if (url.indexOf('youtu.be/') != -1){
							var link_short = url.match(/be\/(.+)(\?|$)/);
							debugger;
							if (link_short[1] !== undefined){
								return link_short[1];
							}							
						}
					}, // String that splits URL in a two parts, second part should be %id%
					// id: 'v=', // String that splits URL in a two parts, second part should be %id%
					// Or null - full URL will be returned
					// Or a function that should return %id%, for example:
					// id: function(url) { return 'parsed id'; }				
					src: '//www.youtube.com/embed/%id%?autoplay=1' // URL that will be set as a source for iframe.
				},
				vimeo: {
					index: 'vimeo.com/',
					id: '/',
					src: '//player.vimeo.com/video/%id%?autoplay=1'
				},				  
				dailymotion: {
				 
				  index: 'dailymotion.com',
				  
				  id: function(url) {        
					  var m = url.match(/^.+dailymotion.com\/(video|hub)\/([^_]+)[^#]*(#video=([^_&]+))?/);
					  if (m !== null) {
						  if(m[4] !== undefined) {
							
							  return m[4];
						  }
						  return m[2];
					  }
					  return null;
				  },
				  
				  src: 'https://www.dailymotion.com/embed/video/%id%'
				  
				}
			  }
			}						
		});	
	}

	componentDidMount() {
		this.initPopUp();
	}

	componentDidUpdate( prevProps ) {
		this.initPopUp();
	}

	render() {
		const {
			attributes: {
				videoAutoplay,
				id,
				url,
				type,
				title,
				text,
				link,
				align,
				minHeight,
				buttonMaxWidth,
				buttonStyle,
				buttonAnimation,
				buttonSize,
				backgroundOpacity,
				imageAnimation,
                linkTarget,
				rel,

				customTitleColor,
				customSubtitleColor,
				customIconColor,
				customButtonColor,
				customOverlayColor,				
			},
			titleColor,
			subtitleColor,
			iconColor,
			buttonColor,
			overlayColor,
			setAttributes,
			isSelected,
			className,		
		} = this.props;

		const changeImageSize = ( media, imageSize) => {
			if ( ! media ) {
				setAttributes( { url: undefined, id: undefined } );
				return;
			}

			let mediaType;
			if ( media.media_type ) {
				if ( media.media_type === IMAGE_BACKGROUND_TYPE ) {
					mediaType = IMAGE_BACKGROUND_TYPE;
				} else {
					mediaType = VIDEO_BACKGROUND_TYPE;
				}
			} else {
				if (
					media.type !== IMAGE_BACKGROUND_TYPE &&
					media.type !== VIDEO_BACKGROUND_TYPE
				) {
					return;
				}
				mediaType = media.type;
			}

			const url_link = get( media, [ 'sizes', imageSize, 'url' ] ) || get( media, [ 'media_details', 'sizes', imageSize, 'source_url' ] ) || media.url;

			setAttributes( {
				id: media.id,
				url: (typeof url_link !='undefined' ? url_link : url),
				type: mediaType,
			} );
		};

		const onSelectMedia = ( media ) => {
			let {
				attributes:{
					imageSize,
				},
			} = this.props;

			if (!['full', 'large', 'medium', 'thumbnail'].includes(imageSize)) {
				imageSize = attributes.imageSize.default;
				setAttributes( {
					imageSize
				} );
			}
	
			changeImageSize(media, imageSize);	
		};		

		const imageProps = {
			className: classnames(
				`${baseClass}__wrapper`,
				{				
					'has-background': (overlayColor.color),
					[ overlayColor.class ]: (overlayColor.class),				
				}
			),
			style: {
				backgroundColor: (this.props.overlayColor.color ? this.props.overlayColor.color : this.props.attributes.customOverlayColor),
			},
		};

		const pulseProps = {
			className: classnames(
				`${baseClass}__button-pulse`,
			),
			style: {
				borderColor: ((typeof this.props.attributes.buttonColor != 'undefined' && typeof this.props.attributes.buttonColor.class == 'undefined') ? this.props.buttonColor.color : (customButtonColor ? customButtonColor : undefined)),
			},
		};

		const containerProps = {
			className: classnames(
				`${baseClass}__container`,
			),
			style: {
				backgroundColor: buttonStyle == 'fill' ? ((typeof this.props.attributes.buttonColor != 'undefined' && typeof this.props.attributes.buttonColor.class == 'undefined') ? this.props.buttonColor.color : (customButtonColor ? customButtonColor : undefined)) : undefined,
				borderColor: ((typeof this.props.attributes.buttonColor != 'undefined' && typeof this.props.attributes.buttonColor.class == 'undefined') ? this.props.buttonColor.color : (customButtonColor ? customButtonColor : undefined)),
			},
		};

		const iconProps = {
			className: classnames(
				`${baseClass}__control`,
				{
					'has-text-color': iconColor.color,
					[ iconColor.class ]: iconColor.class,	
					'has-background': (buttonColor.color),
					[ buttonColor.class ]: (buttonColor.class),										
				},
			),
			style: {
				backgroundColor: ((typeof this.props.attributes.buttonColor != 'undefined' && typeof this.props.attributes.buttonColor.class == 'undefined') ? this.props.buttonColor.color : (customButtonColor ? customButtonColor : undefined)),
				color: ((typeof this.props.attributes.iconColor != 'undefined' && typeof this.props.attributes.iconColor.class == 'undefined') ? this.props.iconColor.color : (customIconColor ? customIconColor : undefined)),
			},
		};

		const titleProps = {
			className: classnames(
				`${baseClass}__title`,
				{
					'has-text-color': titleColor.color,
					[ titleColor.class ]: titleColor.class,					
				},
			),
			style: {
				color: ((typeof this.props.attributes.titleColor != 'undefined' && typeof this.props.attributes.titleColor.class == 'undefined') ? this.props.titleColor.color : (customTitleColor ? customTitleColor : undefined)),
			},
		};

		const subtitleProps = {
			className: classnames(
				`${baseClass}__sub-title`,
				{
					'has-text-color': subtitleColor.color,
					[ subtitleColor.class ]: subtitleColor.class,					
				},
			),
			style: {
				color: ((typeof this.props.attributes.subtitleColor != 'undefined' && typeof this.props.attributes.subtitleColor.class == 'undefined') ? this.props.subtitleColor.color : (customSubtitleColor ? customSubtitleColor : undefined)),
			},
		};		

		const captionProps = {
			className: classnames(
				`${baseClass}__caption`,
			),
			style: {
				minHeight: minHeight,
			},
		};

		const wrapperProps = {
			className: classnames(
				className,
				`has-animation-${imageAnimation}`,
				{
					[ `has-button-animation-${buttonAnimation}` ]: buttonAnimation != 'none',
					[ `has-foreground-${backgroundOpacity}` ]: backgroundOpacity != 35,
					[ `button-size-${buttonSize}` ]: buttonSize != 'default',
					[ `button-style-${buttonStyle}` ]: buttonStyle != 'default',
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
												label={ __( 'Edit Media', 'getwid' ) }
												icon="edit"
												onClick={ open }
											/>
										) }
									/>
									<IconButton
										className="components-toolbar__control"
										label={ __( 'Remove Media', 'getwid' ) }
										icon="trash"
										onClick={ (e) => {
											setAttributes({id: null, url: null})
										} }
									/>
								</Toolbar>
							</MediaUploadCheck>
						</Fragment>
					) }
				</BlockControls>
				<Inspector {...{ setAttributes, ...this.props, changeImageSize }} key='inspector'/>
			</Fragment>
		);

		if ( ! url ) {

			return (
				<Fragment>
					{ controls }
					<MediaPlaceholder
						icon={ 'format-image' }
						className={ baseClass }
						labels={ {
							title: __( 'Video popup', 'getwid' ),
						} }
						onSelect={ onSelectMedia }
						accept="image/*"
						allowedTypes={ ALLOWED_MEDIA_TYPES }
					/>
					<div {...wrapperProps}>
						<div style={{maxWidth: buttonMaxWidth}} className={`${baseClass}__button-wrapper`}>
							<div {...containerProps}>
								<div {...iconProps}>								
									<i className={`fas fa-play`}>{buttonAnimation == 'pulse' && (<span {...pulseProps}></span>)}</i>
								</div>
								<div className={`${baseClass}__inner-caption-wrapper`}>
									<RichText
										{...titleProps}
										tagName="span"
										placeholder={ __( 'Video Title', 'getwid' ) }
										value={ title }
										onChange={title => setAttributes({title})}	
										formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }							
									/>
									<RichText
										{...subtitleProps}
										tagName="p"
										placeholder={ __( 'Video subtitle', 'getwid' ) }
										value={ text }
										onChange={text => setAttributes({text})}
										formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
									/>
								</div>
							</div>
							<a href={link} className={`lightbox-video`}></a>
						</div>
					</div>
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
										className= {`${baseClass}__video ${baseClass}__source`}
										autoPlay={videoAutoplay}
										muted
										loop
										src={ url }
									/>
								) : (<img src={ url } alt="" className= {`${baseClass}__image ${baseClass}__source` }/>) }

								<Fragment>
									<div {...captionProps}>
										<div style={{maxWidth: buttonMaxWidth}} className={`${baseClass}__button-wrapper`}>
											<div {...containerProps}>
												<div {...iconProps}>
													<i className={`fas fa-play`}>{buttonAnimation == 'pulse' && (<span {...pulseProps}></span>)}</i>
												</div>
											</div>
											<a href={link} className={`lightbox-video`}></a>
										</div>
									</div>
								</Fragment>
							
					
							</div>
						) }	
						<div className= {`${baseClass}__outside-caption-wrapper`}>

							<RichText
								{...titleProps}
								tagName="span"
								placeholder={ __( 'Video Title', 'getwid' ) }
								value={ title }
								onChange={title => setAttributes({title})}	
								formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }							
							/>

							<RichText
								{...subtitleProps}
								tagName="p"
								placeholder={ __( 'Video subtitle', 'getwid' ) }
								value={ text }
								onChange={text => setAttributes({text})}
								formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }
							/>

						</div>
					</Fragment>
				</div>
					{isSelected &&
						(
							<Fragment>
								<div className= {`${baseClass}__url-field`}>
									<Dashicon icon="admin-links"/>									
									<URLInput
										autoFocus={ false }
										value={ link }
										onChange={ link => setAttributes({link}) }
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
	withSelect( ( select, props ) => {
		const { getMedia } = select( 'core' );
		const { id } = props.attributes;
		return {
			imgObj: id ? getMedia( id ) : null,
		};
	} ),	
	withColors('titleColor', 'subtitleColor', 'iconColor', 'buttonColor', 'overlayColor'),
] )( Edit );


