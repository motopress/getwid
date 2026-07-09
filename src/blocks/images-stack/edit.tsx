import {
	BlockControls,
	MediaPlaceholder,
	MediaUpload,
	useBlockProps,
} from '@wordpress/block-editor';
import { store as coreDataStore } from '@wordpress/core-data';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import Inspector from './inspector';
import MediaContainer from './media-container';
import type {
	ImagesStackAttributes,
	ImagesStackEditProps,
	StackImage,
} from './types';
import {
	baseClass,
	chunkImages,
	getIdsFromImages,
	pickRelevantMediaFile,
} from './utils';

import './editor.scss';
import './style.scss';
import clsx from 'clsx';

const allowedMediaTypes = [ 'image' ];

export default function Edit( props: ImagesStackEditProps ) {
	const { attributes, setAttributes, isSelected, className } = props;
	const { images, ids, imageSize, linkTo, stackStyle } = attributes;
	const imgObj = useSelect(
		( select ) => {
			return (
				select( coreDataStore ).getEntityRecords(
					'postType',
					'attachment',
					{
						include: ids,
					}
				) || []
			);
		},
		[ ids ]
	);

	function setImagesAttributes(
		nextAttributes: Partial< ImagesStackAttributes >
	) {
		if ( nextAttributes.ids ) {
			throw new Error(
				'The "ids" attribute should not be changed directly. It is managed automatically when "images" attribute changes'
			);
		}

		if ( nextAttributes.images ) {
			setAttributes( {
				...nextAttributes,
				ids: getIdsFromImages( nextAttributes.images ),
			} );
			return;
		}

		setAttributes( nextAttributes );
	}

	function normalizeImageSize() {
		if (
			[ 'full', 'large', 'medium', 'thumbnail' ].includes( imageSize )
		) {
			return imageSize;
		}

		setAttributes( { imageSize: 'full' } );

		return 'full';
	}

	function onSelectImages( nextImages: StackImage[] ) {
		const nextImageSize = normalizeImageSize();

		setImagesAttributes( {
			images: nextImages.map( ( image ) =>
				pickRelevantMediaFile( image, nextImageSize )
			),
		} );
	}

	const controls = (
		<BlockControls>
			{ !! images.length && (
				<ToolbarGroup>
					<MediaUpload
						onSelect={ onSelectImages }
						allowedTypes={ allowedMediaTypes }
						multiple
						gallery
						value={ images.map( ( image ) => image.id ) }
						render={ ( { open } ) => (
							<ToolbarButton
								label={ __( 'Edit Gallery', 'getwid' ) }
								icon="edit"
								onClick={ open }
							/>
						) }
					/>
				</ToolbarGroup>
			) }
		</BlockControls>
	);

	const blockProps = useBlockProps( {
		className: clsx( className, {
			[ `is-layout-${ stackStyle }` ]: stackStyle !== 'default',
		} ),
	} );

	if ( images.length === 0 ) {
		return (
			<>
				{ controls }
				<div { ...blockProps }>
					<MediaPlaceholder
						icon="format-gallery"
						className={ className }
						labels={ {
							title: '',
							instructions: '',
						} }
						onSelect={ onSelectImages }
						accept="image/*"
						allowedTypes={ allowedMediaTypes }
						multiple
					/>
				</div>
			</>
		);
	}

	const hasImages = !! images.length;
	const hasImagesWithId = hasImages && images.some( ( image ) => image.id );

	return (
		<>
			{ controls }
			<Inspector
				{ ...props }
				imgObj={ imgObj }
				setImagesAttributes={ setImagesAttributes }
			/>
			<div { ...blockProps }>
				<div className={ `${ baseClass }__wrapper` }>
					{ chunkImages( images, 3 ).map(
						( imageChunk, chunkIndex ) => (
							<div
								key={ chunkIndex }
								className={ `${ baseClass }__chunk` }
							>
								{ imageChunk.map( ( image ) => (
									<div
										className={ `${ baseClass }__media-wrapper` }
										key={ image.id || image.url }
									>
										<div
											className={ `${ baseClass }__media-inner-wrapper` }
										>
											<MediaContainer
												image={ image }
												linkTo={ linkTo }
											/>
										</div>
									</div>
								) ) }
							</div>
						)
					) }
				</div>
				{ isSelected && (
					<MediaPlaceholder
						addToGallery={ hasImagesWithId }
						isAppender={ hasImages }
						className="components-form-file-upload"
						disableMediaButtons={ hasImages && ! isSelected }
						labels={ {
							title: ! hasImages
								? __( 'Gallery', 'getwid' )
								: undefined,
							instructions: ! hasImages
								? __(
										'Drag images, upload new ones or select files from your library.',
										'getwid'
								  )
								: undefined,
						} }
						onSelect={ onSelectImages }
						accept="image/*"
						allowedTypes={ allowedMediaTypes }
						multiple
						value={ hasImagesWithId ? images : undefined }
					/>
				) }
			</div>
		</>
	);
}
