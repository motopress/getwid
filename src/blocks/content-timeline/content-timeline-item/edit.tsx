import {
	BlockControls,
	InnerBlocks,
	MediaUpload,
	MediaUploadCheck,
	RichText,
	getColorObjectByAttributeValues,
	store as blockEditorStore,
	useBlockProps,
} from '@wordpress/block-editor';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import classnames from 'classnames';

import { allowedFormats, itemBaseClass } from '../content-timeline/constants';
import Inspector from './inspector';
import type {
	ContentTimelineItemEditProps,
	MediaObject,
} from '../content-timeline/types';

type CoreSelect = {
	getMedia: ( id: number ) => MediaObject | null;
};

type EditorSettings = {
	colors?: Array< {
		name: string;
		slug: string;
		color: string;
	} >;
};

type BlockEditorSelect = {
	getSettings: () => EditorSettings;
};

function pickRelevantMediaFiles( image: MediaObject, imageSize: string ) {
	return {
		id: image.id,
		alt: image.alt || image.alt_text || '',
		url:
			image.media_details?.sizes?.[ imageSize ]?.source_url ||
			image.media_details?.sizes?.large?.source_url ||
			image.media_details?.sizes?.full?.source_url ||
			image.sizes?.[ imageSize ]?.url ||
			image.url ||
			image.source_url,
	};
}

export default function Edit( props: ContentTimelineItemEditProps ) {
	const { attributes, setAttributes } = props;
	const { url, id, cardPosition, outerParent } = attributes;
	const { imgObj, editorColors } = useSelect(
		( select ) => {
			const core = select( 'core' ) as CoreSelect;
			const blockEditor = select( blockEditorStore ) as BlockEditorSelect;

			return {
				imgObj: id ? core.getMedia( id ) : null,
				editorColors: blockEditor.getSettings().colors || [],
			};
		},
		[ id ]
	);
	const outerAttributes = outerParent?.attributes || {};
	const backgroundColor = outerAttributes.backgroundColor;
	const customBackgroundColor = outerAttributes.customBackgroundColor;
	const backgroundColorValue = backgroundColor
		? getColorObjectByAttributeValues( editorColors, backgroundColor )
				?.color
		: customBackgroundColor;
	const blockProps = useBlockProps( {
		className: classnames( outerAttributes.animation, {
			'has-card-left': cardPosition === 'left',
			'has-card-right': cardPosition === 'right',
		} ),
		style: {
			marginBottom: outerAttributes.marginBottom,
		},
	} );
	const cardStyle = {
		backgroundColor: backgroundColorValue || undefined,
	};
	const contentWrapperStyle = {
		paddingTop: outerAttributes.paddingTop,
		paddingBottom: outerAttributes.paddingBottom,
		paddingLeft: outerAttributes.paddingLeft,
		paddingRight: outerAttributes.paddingRight,
	};
	const pointStyle = {
		marginLeft: outerAttributes.horizontalSpace,
		marginRight: outerAttributes.horizontalSpace,
	};

	function onSelectImage( image: MediaObject ) {
		const { imageSize } = attributes;

		if (
			! [ 'full', 'large', 'medium', 'thumbnail' ].includes( imageSize )
		) {
			setAttributes( {
				imageSize: undefined,
				id: undefined,
				url: undefined,
			} );
		}

		setAttributes( {
			...pickRelevantMediaFiles( image, imageSize ),
		} );
	}

	function onChangeImageSize( imageSize: string ) {
		if ( imgObj ) {
			setAttributes( {
				imageSize,
				...pickRelevantMediaFiles( imgObj, imageSize ),
			} );
		}
	}

	return (
		<>
			<Inspector
				{ ...props }
				imgObj={ imgObj }
				onChangeImageSize={ onChangeImageSize }
				onSelectImage={ onSelectImage }
			/>
			<BlockControls>
				<ToolbarGroup>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ onSelectImage }
							allowedTypes={ [ 'image' ] }
							value={ id }
							render={ ( { open }: { open: () => void } ) => (
								<div>
									<ToolbarButton
										label={ __( 'Select Image', 'getwid' ) }
										icon="format-image"
										onClick={ open }
									/>
								</div>
							) }
						/>
					</MediaUploadCheck>
					{ url && (
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
			</BlockControls>
			<div { ...blockProps }>
				<div className={ `${ itemBaseClass }__wrapper` }>
					<div
						className={ `${ itemBaseClass }__card` }
						style={ cardStyle }
					>
						<div className={ `${ itemBaseClass }__card-wrapper` }>
							{ url && (
								<div
									className={ `${ itemBaseClass }__image-wrapper` }
								>
									<img
										className={ `${ itemBaseClass }__image` }
										src={ url }
										alt=""
									/>
								</div>
							) }
							<div
								className={ `${ itemBaseClass }__content-wrapper` }
								style={ contentWrapperStyle }
							>
								<InnerBlocks
									templateLock={ false }
									templateInsertUpdatesSelection={ false }
									template={ [
										[
											'core/heading',
											{
												level: 3,
												placeholder: __(
													'Write heading…',
													'getwid'
												),
											},
										],
										[
											'core/paragraph',
											{
												placeholder: __(
													'Write text…',
													'getwid'
												),
											},
										],
									] }
								/>
							</div>
						</div>
					</div>

					<div
						className={ `${ itemBaseClass }__point` }
						style={ pointStyle }
					>
						<div
							className={ `${ itemBaseClass }__point-content` }
						/>
					</div>

					<div className={ `${ itemBaseClass }__meta` }>
						<RichText
							placeholder={ __( 'Write text…', 'getwid' ) }
							value={ attributes.meta }
							allowedFormats={ allowedFormats }
							onChange={ ( meta ) => setAttributes( { meta } ) }
							className={ `${ itemBaseClass }__meta-content` }
						/>
					</div>
				</div>
			</div>
		</>
	);
}
