import {
	BlockAlignmentToolbar,
	BlockControls,
	MediaPlaceholder,
	MediaUpload,
	MediaUploadCheck,
	RichText,
	URLInput,
	useBlockProps,
	withColors,
} from '@wordpress/block-editor';
import {
	Dashicon,
	ToolbarButton,
	ToolbarGroup,
	ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import {
	allowedFormats,
	allowedMediaTypes,
	baseClass,
	newTabRel,
	videoBackgroundType,
} from './constants';
import Inspector from './inspector';
import type { BannerEditProps, MediaObject } from './types';
import {
	getCaptionProps,
	getImageProps,
	getMediaType,
	getMediaUrl,
	getWrapperClassName,
} from './utils';

import './editor.scss';
import './style.scss';

type CoreSelect = {
	getMedia: ( id: number ) => MediaObject | null;
};

const alignmentsList = [ 'wide', 'full' ];

function Edit( props: BannerEditProps ) {
	const {
		attributes,
		setAttributes,
		isSelected,
		backgroundColor,
		textColor,
	} = props;
	const {
		id,
		url,
		type,
		title,
		text,
		link,
		align,
		contentMaxWidth,
		linkTarget,
		rel,
		imageSize,
	} = attributes;
	const imgObj = useSelect(
		( select ) => {
			const { getMedia } = select( 'core' ) as CoreSelect;

			return id ? getMedia( id ) : null;
		},
		[ id ]
	);
	const blockProps = useBlockProps( {
		className: getWrapperClassName( attributes ),
	} );

	function changeImageSize( media: MediaObject, nextImageSize: string ) {
		if ( ! media ) {
			setAttributes( { url: undefined, id: undefined } );
			return;
		}

		const mediaType = getMediaType( media );

		if ( ! mediaType ) {
			return;
		}

		const urlLink = getMediaUrl( media, nextImageSize );

		setAttributes( {
			id: media.id,
			url: typeof urlLink !== 'undefined' ? urlLink : url,
			type: mediaType,
		} );
	}

	function onSelectMedia( media: MediaObject ) {
		let nextImageSize = imageSize;

		if (
			! [ 'full', 'large', 'medium', 'thumbnail' ].includes(
				nextImageSize
			)
		) {
			nextImageSize = 'full';
			setAttributes( { imageSize: nextImageSize } );
		}

		changeImageSize( media, nextImageSize );
	}

	function onSetNewTab( value: boolean ) {
		const nextLinkTarget = value ? '_blank' : undefined;
		let nextRel = rel;

		if ( nextLinkTarget && ! rel ) {
			nextRel = newTabRel;
		} else if ( ! nextLinkTarget && rel === newTabRel ) {
			nextRel = undefined;
		}

		setAttributes( {
			linkTarget: nextLinkTarget,
			rel: nextRel,
		} );
	}

	const controls = (
		<>
			<BlockControls>
				<BlockAlignmentToolbar
					controls={ alignmentsList }
					value={ align }
					onChange={ ( nextAlign ) =>
						setAttributes( { align: nextAlign } )
					}
				/>
				{ !! url && (
					<MediaUploadCheck>
						<ToolbarGroup>
							<MediaUpload
								onSelect={ onSelectMedia }
								allowedTypes={ allowedMediaTypes }
								value={ id }
								render={ ( { open } ) => (
									<ToolbarButton
										label={ __( 'Edit Media', 'getwid' ) }
										icon="edit"
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
					{ ...props }
					imgObj={ imgObj }
					changeImageSize={ changeImageSize }
					onSelectMedia={ onSelectMedia }
				/>
			) }
		</>
	);

	if ( ! url ) {
		const hasTitle = ! RichText.isEmpty( title );
		const icon = hasTitle ? undefined : 'format-image';
		const label = hasTitle ? (
			<>
				<RichText
					tagName="p"
					value={ title }
					onChange={ ( nextTitle ) =>
						setAttributes( { title: nextTitle } )
					}
				/>
				<RichText
					tagName="p"
					value={ text }
					onChange={ ( nextText ) =>
						setAttributes( { text: nextText } )
					}
				/>
			</>
		) : (
			__( 'Banner', 'getwid' )
		);

		return (
			<>
				{ controls }
				<MediaPlaceholder
					icon={ icon }
					className={ baseClass }
					labels={ {
						title: label,
					} }
					onSelect={ onSelectMedia }
					accept="image/*"
					allowedTypes={ allowedMediaTypes }
				/>
			</>
		);
	}

	const imageProps = getImageProps( attributes, backgroundColor );
	const captionProps = getCaptionProps( attributes, textColor );

	return (
		<>
			{ controls }
			<div { ...blockProps }>
				<div { ...imageProps }>
					{ type === videoBackgroundType && url ? (
						<video
							className={ `${ baseClass }__video ${ baseClass }__source` }
							autoPlay
							muted
							loop
							src={ url }
						/>
					) : (
						<img
							src={ url }
							alt=""
							className={ `${ baseClass }__image ${ baseClass }__source` }
						/>
					) }

					<div { ...captionProps }>
						<div
							style={ { maxWidth: contentMaxWidth } }
							className={ `${ baseClass }__caption-wrapper` }
						>
							<RichText
								tagName="span"
								className={ `${ baseClass }__title` }
								placeholder={ __( 'Write heading…', 'getwid' ) }
								value={ title }
								onChange={ ( nextTitle ) =>
									setAttributes( { title: nextTitle } )
								}
								allowedFormats={ allowedFormats }
							/>
							<RichText
								tagName="p"
								className={ `${ baseClass }__text` }
								placeholder={ __( 'Write text…', 'getwid' ) }
								value={ text }
								onChange={ ( nextText ) =>
									setAttributes( { text: nextText } )
								}
								allowedFormats={ allowedFormats }
							/>
						</div>
					</div>
				</div>
			</div>
			{ isSelected && (
				<div className={ `${ baseClass }__url-field` }>
					<Dashicon icon="admin-links" />
					<URLInput
						className="has-border"
						value={ link }
						onChange={ ( nextLink ) =>
							setAttributes( { link: nextLink } )
						}
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={ __( 'Open in New Tab', 'getwid' ) }
						onChange={ onSetNewTab }
						checked={ linkTarget === '_blank' }
					/>
				</div>
			) }
		</>
	);
}

export default withColors( 'backgroundColor', { textColor: 'color' } )( Edit );
