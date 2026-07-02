import {
	BlockControls,
	InnerBlocks,
	MediaPlaceholder,
	MediaUpload,
	MediaUploadCheck,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import clsx from 'clsx';

import Inspector from './inspector';
import type { MediaObject, PersonEditProps } from './types';
import { baseClass, getImageUrl } from './utils';

import './editor.scss';

const allowedBlocks = [ 'getwid/social-links', 'core/paragraph' ];
const allowedMediaTypes = [ 'image' ];
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

export default function Edit( props: PersonEditProps ) {
	const { attributes, setAttributes, className } = props;
	const {
		imageCrop,
		imageSize,
		title,
		subtitle,
		content,
		imgId,
		imgUrl,
		imgAlt,
	} = attributes;
	const imgObj = useSelect(
		( select ) => {
			const { getMedia } = select( 'core' ) as CoreSelect;

			return imgId ? getMedia( imgId ) : null;
		},
		[ imgId ]
	);
	const blockProps = useBlockProps( {
		className: clsx( className, {
			'is-image-cropped': imageCrop,
		} ),
	} );

	function changeImageSize( media: MediaObject, nextImageSize: string ) {
		if ( ! media ) {
			setAttributes( { imgId: undefined, imgUrl: undefined } );
			return;
		}

		const urlLink = getImageUrl( media, nextImageSize );

		setAttributes( {
			imgId: media.id,
			imgUrl: urlLink !== undefined ? urlLink : imgUrl,
			imgAlt: media.alt || media.alt_text,
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

	return (
		<>
			<BlockControls>
				{ !! imgUrl && (
					<MediaUploadCheck>
						<ToolbarGroup>
							<MediaUpload
								onSelect={ onSelectMedia }
								allowedTypes={ allowedMediaTypes }
								value={ imgId }
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
			<div { ...blockProps }>
				{ ! imgUrl && (
					<MediaPlaceholder
						icon="format-image"
						labels={ {
							title: __( 'Person', 'getwid' ),
						} }
						onSelect={ onSelectMedia }
						accept="image/*"
						allowedTypes={ allowedMediaTypes }
					/>
				) }
				{ imgUrl && (
					<>
						<Inspector
							{ ...props }
							imgObj={ imgObj }
							changeImageSize={ changeImageSize }
							onSelectMedia={ onSelectMedia }
						/>
						<div className={ `${ baseClass }__image` }>
							<img
								src={ imgUrl }
								alt={ imgAlt }
								className={
									imgId ? `wp-image-${ imgId }` : undefined
								}
							/>
						</div>
						<div className={ `${ baseClass }__content-wrapper` }>
							<div className="editor-testimonial__title-wrapper">
								<RichText
									tagName="span"
									className={ `${ baseClass }__title` }
									placeholder={ __(
										'Write heading…',
										'getwid'
									) }
									value={ title }
									onChange={ ( nextTitle ) =>
										setAttributes( { title: nextTitle } )
									}
									allowedFormats={ allowedFormats }
								/>
							</div>
							<div className="editor-testimonial__subtitle-wrapper">
								<RichText
									tagName="span"
									className={ `${ baseClass }__subtitle` }
									placeholder={ __(
										'Write subtitle…',
										'getwid'
									) }
									value={ subtitle }
									onChange={ ( nextSubtitle ) =>
										setAttributes( {
											subtitle: nextSubtitle,
										} )
									}
									allowedFormats={ allowedFormats }
								/>
							</div>
							<div className="editor-testimonial__content-wrapper">
								<RichText
									tagName="p"
									className={ `${ baseClass }__content` }
									placeholder={ __(
										'Write text…',
										'getwid'
									) }
									value={ content }
									onChange={ ( nextContent ) =>
										setAttributes( {
											content: nextContent,
										} )
									}
									allowedFormats={ allowedFormats }
								/>
							</div>
							<div className="editor-testimonial__social-links-wrapper">
								<InnerBlocks allowedBlocks={ allowedBlocks } />
							</div>
						</div>
					</>
				) }
			</div>
		</>
	);
}
