import {
	BlockAlignmentToolbar,
	BlockControls,
	MediaUpload,
	MediaUploadCheck,
	RichText,
	useBlockProps,
	withColors,
} from '@wordpress/block-editor';
import {
	Dashicon,
	TextControl,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import clsx from 'clsx';

import Inspector from './inspector';
import type { MediaObject, VideoPopupEditProps } from './types';
import {
	allowedMediaTypes,
	baseClass,
	getImageUrl,
	getWrapperClassName,
} from './utils';

import './editor.scss';
import './style.scss';

const alignmentsList = [ 'wide', 'full' ];
const imageBackgroundType = 'image';
const allowedFormats = [
	'core/bold',
	'core/italic',
	'core/link',
	'core/image',
	'core/strikethrough',
	'core/text-color',
];

type CoreSelect = {
	getMedia: ( id: number ) => MediaObject | null;
};

function Edit( props: VideoPopupEditProps ) {
	const {
		attributes,
		setAttributes,
		titleColor,
		iconColor,
		buttonColor,
		overlayColor,
		isSelected,
		className,
	} = props;
	const {
		id,
		url,
		title,
		link,
		align,
		minHeight,
		buttonMaxWidth,
		buttonStyle,
		buttonAnimation,
		buttonSize,
		customTitleColor,
		customIconColor,
		customButtonColor,
		customOverlayColor,
	} = attributes;
	const imgObj = useSelect(
		( select ) => {
			const { getMedia } = select( 'core' ) as CoreSelect;

			return id ? getMedia( id ) : null;
		},
		[ id ]
	);

	function changeImageSize( media: MediaObject, imageSize: string ) {
		if ( ! media ) {
			setAttributes( { url: undefined, id: undefined } );
			return;
		}

		const mediaType =
			media.media_type === imageBackgroundType
				? imageBackgroundType
				: media.type;

		if ( mediaType !== imageBackgroundType ) {
			return;
		}

		setAttributes( {
			id: media.id,
			url: getImageUrl( media, imageSize ) || url,
		} );
	}

	function onSelectMedia( media: MediaObject ) {
		let nextImageSize = attributes.imageSize;

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

	const blockProps = useBlockProps( {
		className: clsx( className, getWrapperClassName( attributes ) ),
	} );
	const containerProps = {
		className: clsx( `${ baseClass }__wrapper`, {
			'has-background': !! url && overlayColor.color,
			[ overlayColor.class ?? '' ]: !! url && overlayColor.class,
		} ),
		style: {
			backgroundColor:
				!! url && overlayColor.color
					? overlayColor.color
					: customOverlayColor,
			minHeight: url !== undefined ? minHeight : undefined,
		},
	};
	const buttonProps = {
		className: clsx(
			`${ baseClass }__button`,
			`is-style-${ buttonStyle }`,
			{
				[ `has-animation-${ buttonAnimation }` ]:
					buttonAnimation !== 'none',
				[ `is-size-${ buttonSize }` ]: buttonSize !== 'default',
			}
		),
		style: {
			backgroundColor:
				buttonStyle === 'fill'
					? buttonColor.color || customButtonColor
					: undefined,
			borderColor: buttonColor.color || customButtonColor,
		},
	};
	const iconProps = {
		className: clsx( `${ baseClass }__icon`, {
			'has-text-color': iconColor.color,
			[ iconColor.class ?? '' ]: iconColor.class,
			'has-background': buttonColor.color,
			[ buttonColor.class ?? '' ]: buttonColor.class,
		} ),
		style: {
			backgroundColor: buttonColor.color || customButtonColor,
			color: iconColor.color || customIconColor,
			borderColor: buttonColor.color || customButtonColor,
		},
	};
	const titleProps = {
		className: clsx( `${ baseClass }__title`, {
			'has-text-color': titleColor.color,
			[ titleColor.class ?? '' ]: titleColor.class,
		} ),
		style: {
			color: titleColor.color || customTitleColor,
		},
	};
	const hasTitle = ! RichText.isEmpty( title );
	const linkAttributes = {
		className: `${ baseClass }__link`,
		href: typeof link !== 'undefined' ? link : '',
		style: {
			maxWidth: ! url ? buttonMaxWidth : undefined,
		},
		'aria-label': hasTitle ? title : undefined,
		onClick: ( event: {
			preventDefault: () => void;
			stopPropagation: () => void;
		} ) => {
			event.preventDefault();
			event.stopPropagation();
		},
	};
	const imgAttributes = {
		src: url,
		alt: hasTitle ? title : '',
		className: clsx(
			`${ baseClass }__image`,
			`${ baseClass }__source`,
			id ? `wp-image-${ id }` : ''
		),
	};

	return (
		<>
			<div { ...blockProps }>
				{ isSelected && (
					<div className={ `${ baseClass }__url-field` }>
						<Dashicon icon="admin-links" />
						<TextControl
							placeholder={ __( 'Video URL', 'getwid' ) }
							value={ link || '' }
							onChange={ ( nextLink ) =>
								setAttributes( { link: nextLink } )
							}
						/>
					</div>
				) }
				<BlockControls>
					<BlockAlignmentToolbar
						controls={ alignmentsList }
						value={ align }
						onChange={ ( nextAlign ) =>
							setAttributes( { align: nextAlign } )
						}
					/>
					<MediaUploadCheck>
						<ToolbarGroup>
							<MediaUpload
								onSelect={ onSelectMedia }
								allowedTypes={ allowedMediaTypes }
								value={ id }
								render={ ( { open } ) => (
									<ToolbarButton
										label={ __( 'Select Image', 'getwid' ) }
										icon="format-image"
										onClick={ open }
									/>
								) }
							/>
							{ !! url && (
								<ToolbarButton
									label={ __( 'Delete Image', 'getwid' ) }
									icon="trash"
									onClick={ () =>
										setAttributes( {
											id: undefined,
											url: undefined,
										} )
									}
								/>
							) }
						</ToolbarGroup>
					</MediaUploadCheck>
				</BlockControls>
				<Inspector
					{ ...props }
					imgObj={ imgObj }
					changeImageSize={ changeImageSize }
					onSelectMedia={ onSelectMedia }
				/>
				<a { ...linkAttributes }>
					<div { ...containerProps }>
						{ !! url && <img { ...imgAttributes } /> }
						<div { ...buttonProps }>
							<div { ...iconProps }>
								<i className="fas fa-play"></i>
							</div>
							{ ! url && (
								<div
									className={ `${ baseClass }__button-caption` }
								>
									<RichText
										{ ...titleProps }
										tagName="p"
										placeholder={ __(
											'Write text…',
											'getwid'
										) }
										value={ title }
										onChange={ ( nextTitle ) =>
											setAttributes( {
												title: nextTitle,
											} )
										}
										allowedFormats={ allowedFormats }
									/>
								</div>
							) }
						</div>
					</div>
				</a>
				{ url && (
					<div className={ `${ baseClass }__caption` }>
						<RichText
							{ ...titleProps }
							tagName="p"
							placeholder={ __( 'Write text…', 'getwid' ) }
							value={ title }
							onChange={ ( nextTitle ) =>
								setAttributes( { title: nextTitle } )
							}
							allowedFormats={ [
								'bold',
								'italic',
								'strikethrough',
							] }
						/>
					</div>
				) }
			</div>
		</>
	);
}

export default withColors(
	'titleColor',
	'iconColor',
	'buttonColor',
	'overlayColor'
)( Edit );
