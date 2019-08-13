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
	Toolbar,
	Dashicon
} = wp.components;
const {Component, Fragment} = wp.element;
const $ = window.jQuery;


/**
* Module Constants
*/
const alignmentsList = [ 'wide', 'full' ];
const ALLOWED_MEDIA_TYPES = [ 'image' ];
const IMAGE_BACKGROUND_TYPE = 'image';
const baseClass = 'wp-block-getwid-video-popup';

/**
* Create an Component
*/
class Edit extends Component {

	constructor() {
		super(...arguments);
	}
	
	initPopUp(){
		const thisBlock = $( ReactDOM.findDOMNode( this ) );
		const videoWrapper = $( '.lightbox-video', thisBlock );
		videoWrapper.on('click', function (e) {
			e.preventDefault();			
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
				id,
				url,
				title,
				text,
				link,
				align,
				minHeight,
				buttonMaxWidth,
				buttonStyle,
				buttonAnimation,
				buttonSize,
				overlayOpacity,
				imageAnimation,

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
				}
			} else {
				if (
					media.type !== IMAGE_BACKGROUND_TYPE
				) {
					return;
				}
				mediaType = media.type;
			}

			const url_link = get( media, [ 'sizes', imageSize, 'url' ] ) || get( media, [ 'media_details', 'sizes', imageSize, 'source_url' ] ) || media.url;

			setAttributes( {
				id: media.id,
				url: (typeof url_link !='undefined' ? url_link : url),
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
					[ `has-foreground-${overlayOpacity}` ]: overlayOpacity != 35,
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
					<div {...wrapperProps}>
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
					
						<div style={{maxWidth: buttonMaxWidth}} className={`${baseClass}__button-wrapper has-title`}>
							<div {...containerProps}>
								<div {...iconProps}>								
									<i className={`fas fa-play`}>{buttonAnimation == 'pulse' && (<span {...pulseProps}></span>)}</i>
									<a href={typeof link != 'undefined' ? link : ''} className={`lightbox-video`}></a>
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
						</div>
					</div>					
				</Fragment>
			);
		}

		return (
			<Fragment>
				<div {...wrapperProps}>
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
					{ controls }
					<Fragment>
						{ !! url && (
							<div {...imageProps}>
								<img src={ url } alt="" className= {`${baseClass}__image ${baseClass}__source` }/>
								<Fragment>
									<div {...captionProps}>
										<div style={{maxWidth: buttonMaxWidth}} className={`${baseClass}__button-wrapper`}>
											<div {...containerProps}>
												<div {...iconProps}>
													<i className={`fas fa-play`}>{buttonAnimation == 'pulse' && (<span {...pulseProps}></span>)}</i>
													<a href={typeof link != 'undefined' ? link : ''} className={`lightbox-video`}></a>
												</div>
											</div>
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


