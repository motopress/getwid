import {
	BlockControls,
	MediaPlaceholder,
	MediaUpload,
	MediaUploadCheck,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import clsx from 'clsx';

import Inspector from './inspector';
import type { TestimonialEditProps, TestimonialMedia } from './types';

import './editor.scss';

const baseClass = 'wp-block-getwid-testimonial';
const allowedMediaTypes = [ 'image' ];
const allowedFormats = [
	'core/bold',
	'core/italic',
	'core/link',
	'core/image',
	'core/strikethrough',
	'core/text-color',
];

export default function Edit( props: TestimonialEditProps ) {
	const { attributes, className, setAttributes } = props;
	const { title, subtitle, content, imgId, imgUrl, imgAlt } = attributes;
	const blockProps = useBlockProps( {
		className: clsx( className, {
			'has-image': imgUrl !== undefined,
		} ),
	} );

	function onSelectMedia( media: TestimonialMedia ) {
		setAttributes( {
			imgId: media.id,
			imgUrl:
				media.sizes?.thumbnail?.url ||
				media.sizes?.full?.url ||
				media.url,
			imgAlt: media.alt,
		} );
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

			<Inspector { ...props } onSelectMedia={ onSelectMedia } />

			<div { ...blockProps }>
				{ ! imgUrl && (
					<MediaPlaceholder
						icon="format-image"
						labels={ { title: __( 'Testimonial', 'getwid' ) } }
						onSelect={ onSelectMedia }
						accept="image/*"
						allowedTypes={ allowedMediaTypes }
					/>
				) }

				<div className={ `${ baseClass }__wrapper` }>
					<div className={ `${ baseClass }__content-wrapper` }>
						<RichText
							tagName="p"
							className={ `${ baseClass }__content` }
							placeholder={ __( 'Write text…', 'getwid' ) }
							value={ content }
							onChange={ ( value ) =>
								setAttributes( { content: value } )
							}
							allowedFormats={ allowedFormats }
						/>
					</div>
					<div className={ `${ baseClass }__header` }>
						{ imgUrl && (
							<div className={ `${ baseClass }__image-wrapper` }>
								<div className={ `${ baseClass }__image` }>
									<img
										src={ imgUrl }
										alt={ imgAlt }
										className={
											imgId
												? `wp-image-${ imgId }`
												: undefined
										}
									/>
								</div>
							</div>
						) }
						<div className={ `${ baseClass }__heading` }>
							<RichText
								tagName="span"
								className={ `${ baseClass }__title` }
								placeholder={ __( 'Write heading…', 'getwid' ) }
								value={ title }
								onChange={ ( value ) =>
									setAttributes( { title: value } )
								}
								allowedFormats={ allowedFormats }
							/>
							<RichText
								tagName="span"
								className={ `${ baseClass }__subtitle` }
								placeholder={ __(
									'Write subtitle…',
									'getwid'
								) }
								value={ subtitle }
								onChange={ ( value ) =>
									setAttributes( { subtitle: value } )
								}
								allowedFormats={ allowedFormats }
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
