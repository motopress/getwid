/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import classnames from 'classnames';
import { get } from 'lodash';

/**
* Internal dependencies
*/
import attributes from './attributes';
import Inspector from './inspector';

import './editor.scss';
import './style.scss';

/**
* WordPress dependencies
*/
const { compose } = wp.compose;
const { withSelect } = wp.data;
const { Component, Fragment } = wp.element;
const { ToolbarButton, ToggleControl, ToolbarGroup, Dashicon } = wp.components;
const { BlockControls, BlockAlignmentToolbar, MediaPlaceholder, MediaUpload, MediaUploadCheck, RichText, URLInput, withColors } = wp.blockEditor || wp.editor;

/**
* Module Constants
*/
const alignmentsList = [ 'wide', 'full' ];
const ALLOWED_MEDIA_TYPES = [ 'image', 'video' ];
const IMAGE_BACKGROUND_TYPE = 'image';
const VIDEO_BACKGROUND_TYPE = 'video';
const NEW_TAB_REL = 'noreferrer noopener';
const baseClass = 'wp-block-getwid-banner';

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

        this.props.setAttributes({
            linkTarget,
            rel: updatedRel
        });
    }

	render() {

		const { setAttributes, isSelected, className, backgroundColor, textColor } = this.props;

		const { id, url, type, title, text, link, align, minHeight, contentMaxWidth, verticalAlign, horizontalAlign } = this.props.attributes;
		const { backgroundOpacity, blockAnimation, textAnimation, customTextColor, linkTarget } = this.props.attributes;

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

			const url_link =
				get( media, [ 'media_details', 'sizes', imageSize, 'source_url' ] ) ||
				get( media, [ 'media_details', 'sizes', 'large', 'source_url' ] ) ||
				get( media, [ 'media_details', 'sizes', 'full', 'source_url' ] ) ||
				get( media, [ 'sizes', imageSize, 'url' ] ) ||
				media.url;

			setAttributes( {
				id: media.id,
				url: (typeof url_link !='undefined' ? url_link : url),
				type: mediaType,
			} );
		};

		const onSelectMedia = media => {
			const { imageSize } = this.props.attributes;

			if ( ! [ 'full', 'large', 'medium', 'thumbnail' ].includes( imageSize ) ) {
				imageSize = attributes.imageSize.default;
				setAttributes({
					imageSize
				});
			}

			changeImageSize( media, imageSize );
		};

		const imageProps = {
			className: classnames( `${baseClass}__wrapper`, {
					'has-background': backgroundColor.color,
					[ backgroundColor.class ]: backgroundColor.class
				}
			),
			style: {
				backgroundColor: this.props.backgroundColor.color ? this.props.backgroundColor.color : this.props.attributes.customBackgroundColor
			}
		};

		const captionProps = {
			className: classnames( `${baseClass}__caption`, {
					'has-text-color': textColor.color,
					[ textColor.class ]: textColor.class,
				},
			),
			style: {
				color: (typeof this.props.attributes.textColor != 'undefined' && typeof this.props.attributes.textColor.class == 'undefined') ? this.props.textColor.color : (customTextColor ? customTextColor : undefined),
				minHeight: minHeight
			}
		};

		const wrapperProps = {
			className: classnames( className, {
					[ `has-animation-${blockAnimation}` ]: blockAnimation != 'none',
					[ `has-text-animation-${textAnimation}` ]: textAnimation != 'none' && !isSelected,
					[ `has-foreground-${backgroundOpacity}` ]: backgroundOpacity != 35,
					[ `has-vertical-alignment-${verticalAlign}` ]: verticalAlign != 'center',
					[ `has-horizontal-alignment-${horizontalAlign}` ]: horizontalAlign != 'center'
				},
				align ? `align${ align }` : null
			)
		};

		const controls = (
			<Fragment>
				<BlockControls>
					<BlockAlignmentToolbar
						controls= {alignmentsList}
						value={ align }
						onChange={align => setAttributes({ align })}
					/>
					{ !! url && (
						<MediaUploadCheck>
							<ToolbarGroup>
								<MediaUpload
									onSelect={ onSelectMedia }
									allowedTypes={ ALLOWED_MEDIA_TYPES }
									value={ id }
									render={ ( { open } ) => (
										<ToolbarButton
											label={ __( 'Edit Media', 'getwid' ) }
											icon='edit'
											onClick={ open }
										/>
									) }
								/>
							</ToolbarGroup>
						</MediaUploadCheck>
					) }
				</BlockControls>
				{ !! url && (
					<Inspector
						{ ...{
							...this.props,
							setAttributes,
							changeImageSize,
							onSelectMedia
						} }
					/>
				) }
			</Fragment>
		);

		if ( ! url ) {
			const hasTitle = ! RichText.isEmpty( title );
			const icon = hasTitle ? undefined : 'format-image';
			const label = hasTitle ? (
				<Fragment>
					<RichText
						tagName='p'
						value={ title }
						onChange={title => setAttributes({ title })}
					/>
					<RichText
						tagName='p'
						value={ text }
						onChange={text => setAttributes({ text })}
					/>
				</Fragment>
			) : __( 'Banner', 'getwid' );

			return (
				<Fragment>
					{ controls }
					<MediaPlaceholder
						icon={ icon }
						className={ baseClass }
						labels={ {
							title: label,
						} }
						onSelect={ onSelectMedia }
						accept='image/*'
						allowedTypes={ ALLOWED_MEDIA_TYPES }
					/>
				</Fragment>
			);
		}

		return (
			<Fragment>
				{ controls }
				<div {...wrapperProps}>
					{ !! url && (
						<div {...imageProps}>
							{ VIDEO_BACKGROUND_TYPE === type && !!url ? (
								<video
									className= {`${baseClass}__video ${baseClass}__source`}
									autoPlay={true}
									muted
									loop
									src={ url }
								/>
							) : (<img src={ url } alt="" className= {`${baseClass}__image ${baseClass}__source` }/>) }

							<div {...captionProps}>
								<div style={{ maxWidth: contentMaxWidth }} className= {`${baseClass}__caption-wrapper`}>

									<RichText
										tagName='span'
										className= {`${baseClass}__title`}
										placeholder={ __( 'Write heading…', 'getwid' ) }
										value={ title }
										onChange={title => setAttributes({ title })}
										allowedFormats={allowedFormats}
									/>

									<RichText
										tagName='p'
										className= {`${baseClass}__text`}
										placeholder={ __( 'Write text…', 'getwid' ) }
										value={ text }
										onChange={text => setAttributes({ text })}
										allowedFormats={allowedFormats}
									/>
								</div>
							</div>
						</div>
					) }
				</div>
					{ isSelected && (
						<div className= {`${baseClass}__url-field`}>
							<Dashicon icon='admin-links'/>
							<URLInput
								className="has-border"
								autoFocus={ false }
								value={ link }
								onChange={ link => setAttributes({ link }) }
								__nextHasNoMarginBottom
							/>
							<ToggleControl
								label={ __( 'Open in New Tab', 'getwid' ) }
								onChange={ this.onSetNewTab }
								checked={ linkTarget === '_blank' }
							/>
						</div>
					) }
			</Fragment>
		);
	}
}

export default compose( [
	withSelect( ( select, props ) => {
		const { getMedia } = select( 'core' );
		const { id } = props.attributes;
		if ( typeof id !='undefined' ) {
			return {
				imgObj: id ? getMedia( id ) : null
			};
		}
	} ),
	withColors( 'backgroundColor', { textColor: 'color' } )
] )( Edit );
