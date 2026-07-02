import {
	InspectorControls,
	MediaPlaceholder,
	MediaUpload,
	URLInput,
} from '@wordpress/block-editor';
import {
	BaseControl,
	Button,
	PanelBody,
	RadioControl,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	AnimationSelectControl,
	StyleLengthControl,
	TabsControl,
} from 'getwid-components';

import type { ImageBoxEditProps, MediaObject } from './types';

type TabName = 'general' | 'style' | 'advanced';

const allowedMediaTypes = [ 'image' ];
const newTabRel = 'noreferrer noopener';
const imageSizeOptions =
	(
		window as unknown as {
			Getwid?: {
				settings?: {
					image_sizes?: Array< { value: string; label: string } >;
				};
			};
		}
	 ).Getwid?.settings?.image_sizes || [];

type InspectorProps = ImageBoxEditProps & {
	onSelectMedia: ( media: MediaObject ) => void;
	changeImageSize: ( media: MediaObject, imageSize: string ) => void;
};

export default function Inspector( props: InspectorProps ) {
	const {
		attributes,
		setAttributes,
		onSelectMedia,
		changeImageSize,
		imgObj,
	} = props;
	const {
		id,
		url,
		imageSize,
		layout,
		imagePosition,
		link,
		linkTarget,
		rel,
		hoverAnimation,
		mobileLayout,
		mobileAlignment,
		marginTop,
		marginBottom,
		marginLeft,
		marginRight,
	} = attributes;
	const [ tabName, setTabName ] = useState< TabName >( 'general' );
	const [ isLockedMargins, setIsLockedMargins ] = useState( false );
	const hasMargin =
		marginTop !== undefined ||
		marginBottom !== undefined ||
		marginRight !== undefined ||
		marginLeft !== undefined;

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

	function setLockedMargins( nextMarginTop?: string ) {
		setAttributes( {
			marginBottom: nextMarginTop,
			marginRight: nextMarginTop,
			marginLeft: nextMarginTop,
			marginTop: nextMarginTop,
		} );
	}

	function onChangeImageSize( nextImageSize: string ) {
		if ( imgObj ) {
			setAttributes( { imageSize: nextImageSize } );
			changeImageSize( imgObj, nextImageSize );
		}
	}

	return (
		<InspectorControls>
			<TabsControl
				state={ tabName }
				onChangeTab={ ( nextTabName ) =>
					setTabName( nextTabName as TabName )
				}
				tabs={ [ 'general', 'style', 'advanced' ] }
			/>
			{ tabName === 'general' && (
				<PanelBody>
					<RadioControl
						label={ __( 'Layout', 'getwid' ) }
						selected={ layout || '' }
						options={ [
							{ value: '', label: __( 'Default', 'getwid' ) },
							{
								value: 'left',
								label: __( 'Align Image Left', 'getwid' ),
							},
							{
								value: 'right',
								label: __( 'Align Image Right', 'getwid' ),
							},
						] }
						onChange={ ( nextLayout ) =>
							setAttributes( { layout: nextLayout } )
						}
					/>
					{ ( layout === 'left' || layout === 'right' ) && (
						<SelectControl
							label={ __( 'Image Vertical Alignment', 'getwid' ) }
							value={ imagePosition }
							options={ [
								{ value: 'top', label: __( 'Top', 'getwid' ) },
								{
									value: 'middle',
									label: __( 'Middle', 'getwid' ),
								},
								{
									value: 'bottom',
									label: __( 'Bottom', 'getwid' ),
								},
							] }
							onChange={ ( nextImagePosition ) =>
								setAttributes( {
									imagePosition: nextImagePosition,
								} )
							}
						/>
					) }
					<SelectControl
						label={ __( 'Mobile Layout', 'getwid' ) }
						value={ mobileLayout }
						options={ [
							{
								value: 'default',
								label: __( 'Default', 'getwid' ),
							},
							{
								value: 'column',
								label: __( 'Column', 'getwid' ),
							},
							{
								value: 'column-reverse',
								label: __( 'Column Reverse Order', 'getwid' ),
							},
						] }
						onChange={ ( nextMobileLayout ) =>
							setAttributes( { mobileLayout: nextMobileLayout } )
						}
					/>
					<SelectControl
						label={ __( 'Mobile Alignment', 'getwid' ) }
						value={ mobileAlignment }
						options={ [
							{
								value: 'default',
								label: __( 'Default', 'getwid' ),
							},
							{ value: 'left', label: __( 'Left', 'getwid' ) },
							{
								value: 'center',
								label: __( 'Center', 'getwid' ),
							},
							{ value: 'right', label: __( 'Right', 'getwid' ) },
						] }
						onChange={ ( nextMobileAlignment ) =>
							setAttributes( {
								mobileAlignment: nextMobileAlignment,
							} )
						}
					/>
					<AnimationSelectControl
						label={ __( 'Image Hover Animation', 'getwid' ) }
						value={ hoverAnimation || '' }
						onChange={ ( nextHoverAnimation ) =>
							setAttributes( {
								hoverAnimation: nextHoverAnimation,
							} )
						}
						allowAnimation={ [ 'Seeker', 'Icon' ] }
					/>
					<BaseControl label={ __( 'Image', 'getwid' ) }>
						{ ! url && (
							<MediaPlaceholder
								icon="format-image"
								labels={ {
									title: __( 'Image', 'getwid' ),
									instructions: __(
										'Upload an image file, pick one from your media library, or add one with a URL.',
										'getwid'
									),
								} }
								onSelect={ onSelectMedia }
								accept="image/*"
								allowedTypes={ allowedMediaTypes }
							/>
						) }
						{ url && (
							<MediaUpload
								onSelect={ onSelectMedia }
								allowedTypes={ allowedMediaTypes }
								value={ id }
								render={ ( { open } ) => (
									<BaseControl>
										<div
											onClick={ open }
											onKeyDown={ ( event ) => {
												if (
													event.key === 'Enter' ||
													event.key === ' '
												) {
													open();
												}
											} }
											className="getwid-background-image-wrapper"
											role="button"
											tabIndex={ 0 }
										>
											<img src={ url } alt="" />
										</div>
										<div>
											<Button
												variant="primary"
												onClick={ open }
											>
												{ ! id &&
													__(
														'Select Image',
														'getwid'
													) }
												{ !! id &&
													__(
														'Replace Image',
														'getwid'
													) }
											</Button>
										</div>
									</BaseControl>
								) }
							/>
						) }
					</BaseControl>
					{ imgObj && (
						<SelectControl
							label={ __( 'Image Size', 'getwid' ) }
							help={ __(
								'For images from Media Library only.',
								'getwid'
							) }
							value={ imageSize }
							onChange={ onChangeImageSize }
							options={ imageSizeOptions }
						/>
					) }
				</PanelBody>
			) }
			{ tabName === 'style' && (
				<PanelBody>
					<div className="components-base-control components-base-control-with-lock">
						<StyleLengthControl
							label={ __( 'Margin Top', 'getwid' ) }
							value={ marginTop }
							onChange={ ( nextMarginTop ) =>
								isLockedMargins
									? setLockedMargins( nextMarginTop )
									: setAttributes( {
											marginTop: nextMarginTop,
									  } )
							}
							allowNegative
						/>
						<Button
							icon={ isLockedMargins ? 'lock' : 'unlock' }
							onClick={ () => {
								if ( ! isLockedMargins ) {
									setIsLockedMargins( true );
									setAttributes( {
										marginBottom: marginTop,
										marginRight: marginTop,
										marginLeft: marginTop,
									} );
								} else {
									setIsLockedMargins( false );
								}
							} }
							label={
								isLockedMargins
									? __( 'Unlock', 'getwid' )
									: __( 'Lock', 'getwid' )
							}
						/>
					</div>
					<StyleLengthControl
						label={ __( 'Margin Bottom', 'getwid' ) }
						isLocked={ isLockedMargins }
						value={ marginBottom }
						onChange={ ( nextMarginBottom ) =>
							setAttributes( { marginBottom: nextMarginBottom } )
						}
						allowNegative
					/>
					<StyleLengthControl
						label={ __( 'Margin Left', 'getwid' ) }
						isLocked={ isLockedMargins }
						value={ marginLeft }
						onChange={ ( nextMarginLeft ) =>
							setAttributes( { marginLeft: nextMarginLeft } )
						}
						allowNegative
					/>
					<StyleLengthControl
						label={ __( 'Margin Right', 'getwid' ) }
						isLocked={ isLockedMargins }
						value={ marginRight }
						onChange={ ( nextMarginRight ) =>
							setAttributes( { marginRight: nextMarginRight } )
						}
						allowNegative
					/>
					<BaseControl>
						<Button
							variant="link"
							isDestructive
							onClick={ () =>
								setAttributes( {
									marginBottom: undefined,
									marginRight: undefined,
									marginLeft: undefined,
									marginTop: undefined,
								} )
							}
							disabled={ ! hasMargin }
						>
							{ __( 'Reset', 'getwid' ) }
						</Button>
					</BaseControl>
				</PanelBody>
			) }
			{ tabName === 'advanced' && (
				<PanelBody>
					<BaseControl
						label={ __( 'Image Link', 'getwid' ) }
						className="getwid-editor-url-input"
					>
						<URLInput
							autoFocus={ false }
							value={ link }
							onChange={ ( nextLink ) =>
								setAttributes( { link: nextLink } )
							}
							__nextHasNoMarginBottom
						/>
					</BaseControl>
					<BaseControl>
						<ToggleControl
							label={ __( 'Open in New Tab', 'getwid' ) }
							checked={ linkTarget === '_blank' }
							onChange={ onSetNewTab }
						/>
					</BaseControl>
					<TextControl
						label={ __( 'Link Rel', 'getwid' ) }
						value={ rel || '' }
						onChange={ ( nextRel ) =>
							setAttributes( { rel: nextRel } )
						}
					/>
				</PanelBody>
			) }
		</InspectorControls>
	);
}
