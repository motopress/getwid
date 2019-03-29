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
const {__} = wp.i18n;
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
				contentMaxWidth,
				verticalAlign,
				horizontalAlign,
				backgroundOpacity,
				blockAnimation,
				textAnimation,
				customBackgroundColor,
				customTextColor,
                linkTarget,
				rel
			},
			setAttributes,
			isSelected,
			className,

			setBackgroundColor,
			setTextColor,
			
			backgroundColor,
			textColor,			
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
				`has-animation-${blockAnimation}`,
				{
					[ `has-text-animation-${textAnimation}` ]: textAnimation != 'none' && !isSelected,
					[ `has-foreground-${backgroundOpacity}` ]: backgroundOpacity != 35,
					[ `has-vertical-alignment-${verticalAlign}` ]: verticalAlign != 'center',
					[ `has-horizontal-alignment-${horizontalAlign}` ]: horizontalAlign != 'center',
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
								</Toolbar>
							</MediaUploadCheck>
						</Fragment>
					) }
				</BlockControls>
				{ !! url && (
					<Inspector {...{ setAttributes, ...this.props, changeImageSize }} key='inspector'/>
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
										autoPlay={videoAutoplay}
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
												placeholder={ __( 'Write heading…', 'getwid' ) }
												value={ title }
												onChange={title => setAttributes({title})}	
												formattingControls={ [ 'bold', 'italic', 'strikethrough' ] }							
											/>

											<RichText
												tagName="p"
												className= {`${className}__text`}
												placeholder={ __( 'Write text…', 'getwid' ) }
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
                                        onChange={ this.onSetNewTab }
                                        checked={ linkTarget === '_blank' } />
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
	withColors( 'backgroundColor', { textColor: 'color' } ),
] )( Edit );