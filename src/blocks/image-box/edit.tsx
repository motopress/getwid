import {
	AlignmentToolbar,
	BlockControls,
	InnerBlocks,
	MediaPlaceholder,
	MediaUpload,
	MediaUploadCheck,
	useBlockProps,
} from '@wordpress/block-editor';
import { ToolbarButton, ToolbarGroup } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import clsx from 'clsx';
import jQuery from 'jquery';

import Inspector from './inspector';
import type { ImageBoxEditProps, MediaObject } from './types';
import {
	animateElement,
	baseClass,
	getBlockClassName,
	getImageContainerClassName,
	getImageUrl,
} from './utils';

import './editor.scss';
import './style.scss';

const allowedMediaTypes = [ 'image' ];
const template = [
	[
		'core/heading',
		{ level: 3, placeholder: __( 'Write heading…', 'getwid' ) },
	],
	[ 'core/paragraph', { placeholder: __( 'Write text…', 'getwid' ) } ],
];

type CoreSelect = {
	getMedia: ( id: number ) => MediaObject | null;
};

function Edit( props: ImageBoxEditProps ) {
	const { attributes, setAttributes, className, isSelected } = props;
	const {
		imageSize,
		id,
		url,
		alt,
		marginTop,
		marginBottom,
		marginLeft,
		marginRight,
		textAlignment,
		layout,
		imagePosition,
		link,
		hoverAnimation,
	} = attributes;
	const imgObj = useSelect(
		( select ) => {
			const { getMedia } = select( 'core' ) as CoreSelect;

			return id ? getMedia( id ) : null;
		},
		[ id ]
	);

	function changeImageSize( media: MediaObject, nextImageSize: string ) {
		if ( ! media ) {
			setAttributes( { url: undefined, id: undefined } );
			return;
		}

		setAttributes( {
			id: media.id,
			alt: media.alt,
			url: getImageUrl( media, nextImageSize ),
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

	const blockProps = useBlockProps( {
		className: clsx( className, getBlockClassName( attributes ), {
			'is-selected': isSelected,
		} ),
		'data-animation': hoverAnimation || undefined,
		onMouseEnter: ( event: { currentTarget: HTMLElement } ) => {
			if ( hoverAnimation ) {
				animateElement(
					jQuery( event.currentTarget ).find(
						`.${ baseClass }__image-wrapper`
					) as JQuery< HTMLElement >,
					{ animation: hoverAnimation }
				);
			}
		},
	} );
	const imageContainerClassName = clsx(
		`${ baseClass }__image-container`,
		getImageContainerClassName( attributes )
	);
	const imageContainerStyle = {
		marginTop,
		marginBottom,
		marginLeft,
		marginRight,
	};
	const imageWrapperProps = {
		className: `${ baseClass }__image-wrapper`,
	};
	const imageHTML = url ? (
		<img src={ url } alt={ alt } className={ `${ baseClass }__image` } />
	) : null;

	return (
		<>
			<BlockControls>
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
				<ToolbarGroup>
					<ToolbarButton
						icon="align-left"
						label={ __( 'Align Image Left', 'getwid' ) }
						isPressed={ layout === 'left' }
						onClick={ () =>
							setAttributes( {
								layout: layout === 'left' ? undefined : 'left',
							} )
						}
					/>
					<ToolbarButton
						icon="align-right"
						label={ __( 'Align Image Right', 'getwid' ) }
						isPressed={ layout === 'right' }
						onClick={ () =>
							setAttributes( {
								layout:
									layout === 'right' ? undefined : 'right',
							} )
						}
					/>
				</ToolbarGroup>
				<AlignmentToolbar
					value={ textAlignment }
					onChange={ ( nextTextAlignment ) =>
						setAttributes( {
							textAlignment: nextTextAlignment || 'center',
						} )
					}
				/>
			</BlockControls>
			{ !! url && (
				<Inspector
					{ ...props }
					imgObj={ imgObj }
					changeImageSize={ changeImageSize }
					onSelectMedia={ onSelectMedia }
				/>
			) }
			<div { ...blockProps }>
				{ ! url && (
					<MediaPlaceholder
						icon="format-image"
						className={ baseClass }
						labels={ {
							title: __( 'Image Box', 'getwid' ),
						} }
						onSelect={ onSelectMedia }
						accept="image/*"
						allowedTypes={ allowedMediaTypes }
					/>
				) }
				<div
					style={ imageContainerStyle }
					className={ imageContainerClassName }
				>
					{ link ? (
						<a
							href={ link }
							{ ...imageWrapperProps }
							onClick={ ( event ) => event.preventDefault() }
						>
							{ imageHTML }
						</a>
					) : (
						<div { ...imageWrapperProps }>{ imageHTML }</div>
					) }
				</div>
				<div className={ `${ baseClass }__content` }>
					<InnerBlocks
						template={ template }
						templateInsertUpdatesSelection={ false }
						templateLock={ false }
					/>
				</div>
			</div>
		</>
	);
}

export default Edit;
