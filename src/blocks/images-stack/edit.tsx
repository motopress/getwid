import {
	BlockAlignmentToolbar,
	BlockControls,
	MediaPlaceholder,
	MediaUpload,
	mediaUpload,
	useBlockProps,
} from '@wordpress/block-editor';
import { DropZone, ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';

import Inspector from './inspector';
import MediaContainer from './media-container';
import type {
	CoreSelect,
	ImagesStackAttributes,
	ImagesStackEditProps,
	StackImage,
} from './types';
import {
	baseClass,
	chunkImages,
	getContainerClassName,
	getIdsFromImages,
	pickRelevantMediaFile,
} from './utils';

import './editor.scss';
import './style.scss';

const alignmentsList = [ 'wide', 'full' ];
const allowedMediaTypes = [ 'image' ];

export default function Edit( props: ImagesStackEditProps ) {
	const { attributes, setAttributes, isSelected, className } = props;
	const { align, images, ids, imageSize, linkTo } = attributes;
	const imgObj = useSelect(
		( select ) => {
			const { getMedia } = select( 'core' ) as CoreSelect;

			return ids
				? ids.map( ( id ) => ( id ? getMedia( Number( id ) ) : null ) )
				: [];
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

	function addFiles( files: FileList ) {
		const currentImages = images || [];
		const nextImageSize = normalizeImageSize();

		mediaUpload( {
			allowedTypes: allowedMediaTypes,
			filesList: files,
			onFileChange: ( nextImages: StackImage[] ) => {
				if ( typeof nextImages[ 0 ]?.id === 'undefined' ) {
					return;
				}

				setImagesAttributes( {
					images: currentImages.concat(
						nextImages.map( ( image ) =>
							pickRelevantMediaFile( image, nextImageSize )
						)
					),
				} );
			},
		} );
	}

	const controls = (
		<BlockControls>
			<BlockAlignmentToolbar
				controls={ alignmentsList }
				value={ align }
				onChange={ ( nextAlign ) =>
					setAttributes( { align: nextAlign } )
				}
			/>
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

	if ( images.length === 0 ) {
		return (
			<>
				{ controls }
				<MediaPlaceholder
					icon="format-gallery"
					className={ className }
					labels={ {
						title: __( 'Image Stack Gallery', 'getwid' ),
						instructions: __(
							'Drag images, upload new ones or select files from your library.',
							'getwid'
						),
					} }
					onSelect={ onSelectImages }
					accept="image/*"
					allowedTypes={ allowedMediaTypes }
					multiple
				/>
			</>
		);
	}

	const blockProps = useBlockProps( {
		className: getContainerClassName( attributes, className ),
	} );
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
				<DropZone onFilesDrop={ addFiles } />
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
