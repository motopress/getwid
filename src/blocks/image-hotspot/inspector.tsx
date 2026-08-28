import { InspectorControls } from '@wordpress/block-editor';
import {
	BaseControl,
	Button,
	Dashicon,
	Modal,
	PanelBody,
	RadioControl,
	RangeControl,
	SelectControl,
	TabPanel,
	TextareaControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	AnimationSelectControl,
	CustomColorPalette,
	IconPicker,
	ImageSizeSelect,
	MediaControl,
	TabsControl,
} from 'getwid-components';

import type {
	ChangeState,
	GetState,
	ImageHotspotEditProps,
	ImageHotspotPoint,
	MediaObject,
} from './types';
import { baseClass, parseImagePoints } from './utils';

type TabName = 'general' | 'style' | 'advanced';

type InspectorProps = ImageHotspotEditProps & {
	imgObj: MediaObject | null;
	changeImageSize: ( media: MediaObject | null, imageSize: string ) => void;
	onSelectMedia: ( media: MediaObject ) => void;
	onCancelPoint: () => void;
	onDeletePoint: ( pointID?: number ) => void;
	changeState: ChangeState;
	getState: GetState;
	updatePoint: ( index: number, value: Partial< ImageHotspotPoint > ) => void;
	hasSelectedPoint: boolean;
	selectedPoint: number | null;
};

const pointPlacementOptions = [
	{ value: 'top', label: __( 'Top', 'getwid' ) },
	{ value: 'right', label: __( 'Right', 'getwid' ) },
	{ value: 'bottom', label: __( 'Bottom', 'getwid' ) },
	{ value: 'left', label: __( 'Left', 'getwid' ) },
];

export default function Inspector( props: InspectorProps ) {
	const {
		attributes,
		setAttributes,
		imgObj,
		onCancelPoint,
		updatePoint,
		changeImageSize,
		changeState,
		getState,
		onSelectMedia,
		hasSelectedPoint,
		selectedPoint,
	} = props;
	const {
		id,
		url,
		imageSize,
		imagePoints,
		tooltipTrigger,
		tooltipTheme,
		tooltipArrow,
		tooltipAnimation,
		dotIcon,
		dotSize,
		dotPaddings,
		dotColor,
		dotBackground,
		dotOpacity,
		dotPulse,
		dotAppearanceAnimation,
		hoverAnimation,
	} = attributes;
	const [ tabName, setTabName ] = useState< TabName >( 'general' );
	const points = parseImagePoints( imagePoints );

	function contentFields( index: number, popup = false ) {
		return (
			<>
				<TextControl
					label={ __( 'Title', 'getwid' ) }
					value={ points[ index ].title }
					onChange={ ( title ) => updatePoint( index, { title } ) }
				/>
				<div
					className={ `components-base-control ${ baseClass }__url-field` }
				>
					{ popup && (
						<Dashicon
							className={ `${ baseClass }__url-icon` }
							icon="admin-links"
						/>
					) }

					<TextControl
						placeholder={ __( 'Enter URL', 'getwid' ) }
						value={ points[ index ].link }
						onChange={ ( link ) => updatePoint( index, { link } ) }
					/>
					<ToggleControl
						label={ __( 'Open in New Tab', 'getwid' ) }
						checked={ points[ index ].newTab }
						onChange={ ( newTab ) =>
							updatePoint( index, { newTab } )
						}
					/>
				</div>
				<TextareaControl
					label={ __(
						'Popup Content. Plain Text or HTML.',
						'getwid'
					) }
					rows={ 5 }
					value={ points[ index ].content }
					onChange={ ( content ) =>
						updatePoint( index, { content } )
					}
				/>
				<ToggleControl
					label={ __( 'Opened by default', 'getwid' ) }
					checked={ points[ index ].popUpOpen }
					onChange={ ( popUpOpen ) =>
						updatePoint( index, { popUpOpen } )
					}
				/>
			</>
		);
	}

	function placementFields( index: number, popup = false ) {
		return (
			<>
				<RangeControl
					label={ __( 'X Coord (%)', 'getwid' ) }
					value={ parseFloat( String( points[ index ].position.x ) ) }
					onChange={ ( value = 50 ) =>
						updatePoint( index, {
							position: {
								x: `${ parseFloat( String( value ) ) }%`,
								y: points[ index ].position.y,
							},
						} )
					}
					allowReset
					min={ 0 }
					max={ 100 }
					step={ 0.5 }
				/>
				<RangeControl
					label={ __( 'Y Coord (%)', 'getwid' ) }
					value={ parseFloat( String( points[ index ].position.y ) ) }
					onChange={ ( value = 50 ) =>
						updatePoint( index, {
							position: {
								x: points[ index ].position.x,
								y: `${ parseFloat( String( value ) ) }%`,
							},
						} )
					}
					allowReset
					min={ 0 }
					max={ 100 }
					step={ 0.5 }
				/>
				{ popup ? (
					<SelectControl
						label={ __( 'Tooltip Position', 'getwid' ) }
						value={ points[ index ].placement }
						options={ pointPlacementOptions }
						onChange={ ( placement ) => {
							updatePoint( index, {
								placement:
									placement as ImageHotspotPoint[ 'placement' ],
							} );
							changeState( {
								updatePoints: true,
								highlightDot: true,
							} );
						} }
					/>
				) : (
					<RadioControl
						label={ __( 'Tooltip Position', 'getwid' ) }
						selected={ points[ index ].placement }
						options={ pointPlacementOptions }
						onChange={ ( placement ) => {
							updatePoint( index, {
								placement:
									placement as ImageHotspotPoint[ 'placement' ],
							} );
							changeState( {
								updatePoints: true,
								highlightDot: true,
							} );
						} }
					/>
				) }
				<TextControl
					label={ __( 'Popup Maximum Width, px.', 'getwid' ) }
					value={ String( points[ index ].popUpWidth ) }
					type="number"
					onChange={ ( value ) =>
						updatePoint( index, { popUpWidth: parseInt( value ) } )
					}
				/>
			</>
		);
	}

	function styleFields( index: number ) {
		return (
			<>
				<BaseControl label={ __( 'Point Icon', 'getwid' ) }>
					<IconPicker
						value={ points[ index ].icon }
						onChange={ ( icon ) => {
							updatePoint( index, { icon } );
							changeState( {
								updatePoints: true,
								highlightDot: true,
							} );
						} }
					/>
				</BaseControl>
				<CustomColorPalette
					colorSettings={ [
						{
							title: __( 'Point Background', 'getwid' ),
							colors: {
								customColor: points[ index ].backgroundColor,
							},
							changeColor: ( backgroundColor ) => {
								updatePoint( index, { backgroundColor } );
								changeState( {
									updatePoints: true,
									highlightDot: true,
								} );
							},
						},
						{
							title: __( 'Icon Color', 'getwid' ),
							colors: { customColor: points[ index ].color },
							changeColor: ( color ) => {
								updatePoint( index, { color } );
								changeState( {
									updatePoints: true,
									highlightDot: true,
								} );
							},
						},
					] }
				/>
			</>
		);
	}

	function pointFields( index: number, popup = false ) {
		if ( typeof points[ index ] === 'undefined' ) {
			return null;
		}

		return popup ? (
			<TabPanel
				className="getwid-modal-editor-tabs"
				activeClass="is-active"
				tabs={ [
					{
						name: 'content',
						title: __( 'Content', 'getwid' ),
						className: 'components-button',
					},
					{
						name: 'placement',
						title: __( 'Position', 'getwid' ),
						className: 'components-button',
					},
					{
						name: 'style',
						title: __( 'Style', 'getwid' ),
						className: 'components-button',
					},
				] }
			>
				{ ( tab ) => {
					if ( tab.name === 'content' ) {
						return contentFields( index, true );
					}
					if ( tab.name === 'placement' ) {
						return placementFields( index, true );
					}

					return styleFields( index );
				} }
			</TabPanel>
		) : (
			<>
				{ contentFields( index ) }
				{ placementFields( index ) }
				{ styleFields( index ) }
			</>
		);
	}

	const currentPoint = getState( 'currentPoint' );
	const showModal =
		currentPoint !== null &&
		( getState( 'action' ) === 'edit' ||
			getState( 'action' ) === 'drop' ) &&
		getState( 'editModal' ) === true;

	return (
		<InspectorControls>
			{ ! hasSelectedPoint && (
				<TabsControl
					state={ tabName }
					onChangeTab={ ( nextTab ) =>
						setTabName( nextTab as TabName )
					}
					tabs={ [ 'general', 'style', 'advanced' ] }
				/>
			) }
			{ tabName === 'general' && ! hasSelectedPoint && (
				<PanelBody initialOpen>
					<MediaControl
						label={ __( 'Image', 'getwid' ) }
						url={ url }
						id={ id }
						onSelectMedia={ onSelectMedia }
						onRemoveMedia={ () =>
							setAttributes( { url: undefined, id: undefined } )
						}
					/>
					{ imgObj && (
						<ImageSizeSelect
							label={ __( 'Image Size', 'getwid' ) }
							help={ __(
								'For images from Media Library only.',
								'getwid'
							) }
							value={ imageSize }
							onChange={ ( nextImageSize ) => {
								setAttributes( { imageSize: nextImageSize } );
								changeImageSize( imgObj, nextImageSize );
							} }
						/>
					) }
					<RadioControl
						label={ __( 'Tooltip Interactivity', 'getwid' ) }
						help={ __(
							'These options are applied on frontend only.',
							'getwid'
						) }
						selected={ tooltipTrigger }
						options={ [
							{ value: 'hover', label: __( 'Hover', 'getwid' ) },
							{ value: 'click', label: __( 'Click', 'getwid' ) },
							{
								value: 'multiple',
								label: __( 'Click (Multiple)', 'getwid' ),
							},
						] }
						onChange={ ( nextTooltipTrigger ) =>
							setAttributes( {
								tooltipTrigger: nextTooltipTrigger,
							} )
						}
					/>
					<BaseControl label={ __( 'Point Icon', 'getwid' ) }>
						<IconPicker
							value={ dotIcon }
							onChange={ ( nextDotIcon ) =>
								setAttributes( { dotIcon: nextDotIcon } )
							}
						/>
					</BaseControl>
					<RangeControl
						label={ __( 'Point Size', 'getwid' ) }
						value={ dotSize }
						onChange={ ( nextDotSize = 16 ) =>
							setAttributes( { dotSize: nextDotSize } )
						}
						allowReset
						min={ 2 }
						max={ 64 }
						step={ 1 }
					/>
					<RangeControl
						label={ __( 'Point Spacing', 'getwid' ) }
						value={ dotPaddings }
						onChange={ ( nextDotPaddings = 6 ) =>
							setAttributes( { dotPaddings: nextDotPaddings } )
						}
						allowReset
						min={ 2 }
						max={ 100 }
						step={ 1 }
					/>
				</PanelBody>
			) }
			{ tabName === 'style' && ! hasSelectedPoint && (
				<PanelBody initialOpen>
					<CustomColorPalette
						colorSettings={ [
							{
								title: __( 'Point Background', 'getwid' ),
								colors: { customColor: dotBackground },
								changeColor: ( nextDotBackground ) =>
									setAttributes( {
										dotBackground: nextDotBackground,
									} ),
							},
							{
								title: __( 'Icon Color', 'getwid' ),
								colors: { customColor: dotColor },
								changeColor: ( nextDotColor ) =>
									setAttributes( { dotColor: nextDotColor } ),
							},
						] }
					/>
					<RangeControl
						label={ __( 'Point Opacity', 'getwid' ) }
						value={ dotOpacity }
						onChange={ ( nextDotOpacity = 100 ) =>
							setAttributes( { dotOpacity: nextDotOpacity } )
						}
						allowReset
						min={ 0 }
						max={ 100 }
						step={ 1 }
					/>
				</PanelBody>
			) }
			{ tabName === 'advanced' && ! hasSelectedPoint && (
				<PanelBody initialOpen>
					<SelectControl
						label={ __( 'Tooltip Theme', 'getwid' ) }
						value={ tooltipTheme }
						onChange={ ( nextTooltipTheme ) =>
							setAttributes( { tooltipTheme: nextTooltipTheme } )
						}
						options={ [
							{
								value: 'light',
								label: __( 'Default', 'getwid' ),
							},
							{ value: 'dark', label: __( 'Dark', 'getwid' ) },
							{
								value: 'light-border',
								label: __( 'Light with border', 'getwid' ),
							},
							{
								value: 'google',
								label: __( 'Google', 'getwid' ),
							},
							{
								value: 'translucent',
								label: __( 'Dark with transparency', 'getwid' ),
							},
						] }
					/>
					<ToggleControl
						label={ __( 'Display tooltip arrow', 'getwid' ) }
						checked={ tooltipArrow }
						onChange={ ( nextTooltipArrow ) =>
							setAttributes( { tooltipArrow: nextTooltipArrow } )
						}
					/>
					<SelectControl
						label={ __( 'Tooltip Animation', 'getwid' ) }
						value={ tooltipAnimation }
						onChange={ ( nextTooltipAnimation ) =>
							setAttributes( {
								tooltipAnimation: nextTooltipAnimation,
							} )
						}
						options={ [
							{
								value: 'shift-away',
								label: __( 'Shift Away', 'getwid' ),
							},
							{
								value: 'shift-toward',
								label: __( 'Shift Toward', 'getwid' ),
							},
							{ value: 'fade', label: __( 'Fade', 'getwid' ) },
							{ value: 'scale', label: __( 'Scale', 'getwid' ) },
							{
								value: 'perspective',
								label: __( 'Perspective', 'getwid' ),
							},
						] }
					/>
					<SelectControl
						label={ __( 'Point Animation', 'getwid' ) }
						value={ dotPulse }
						onChange={ ( nextDotPulse ) =>
							setAttributes( { dotPulse: nextDotPulse } )
						}
						options={ [
							{ value: 'none', label: __( 'None', 'getwid' ) },
							{ value: 'pulse', label: __( 'Pulse', 'getwid' ) },
						] }
					/>
					<SelectControl
						label={ __( 'Point Appearance Animation', 'getwid' ) }
						value={ dotAppearanceAnimation }
						onChange={ ( nextDotAppearanceAnimation ) =>
							setAttributes( {
								dotAppearanceAnimation:
									nextDotAppearanceAnimation,
							} )
						}
						options={ [
							{ value: 'none', label: __( 'None', 'getwid' ) },
							{
								value: 'zoomIn',
								label: __( 'Zoom In', 'getwid' ),
							},
							{
								value: 'slideDown',
								label: __( 'Slide Down', 'getwid' ),
							},
						] }
					/>
					<AnimationSelectControl
						label={ __( 'Point Animation On Hover', 'getwid' ) }
						help={ __(
							'These options are applied on frontend only.',
							'getwid'
						) }
						value={ hoverAnimation || '' }
						onChange={ ( nextHoverAnimation ) =>
							setAttributes( {
								hoverAnimation: nextHoverAnimation,
							} )
						}
						allowAnimation={ [ 'Seeker' ] }
					/>
				</PanelBody>
			) }
			{ showModal && (
				<Modal
					className={ `${ baseClass }__modal` }
					title={ __( 'Edit Point', 'getwid' ) }
					shouldCloseOnClickOutside={ false }
					shouldCloseOnEsc={ false }
					onRequestClose={ () => {
						const action = getState( 'action' );

						changeState( { action: false, editModal: false } );

						if ( action === 'drop' ) {
							onCancelPoint();
						}
					} }
				>
					{ pointFields( currentPoint, true ) }
					<div className={ `${ baseClass }__modal-actions` }>
						<Button
							variant="primary"
							onClick={ () =>
								changeState( {
									updatePoints: true,
									editModal: false,
									action: false,
								} )
							}
						>
							{ getState( 'action' ) === 'drop'
								? __( 'Save', 'getwid' )
								: __( 'Update', 'getwid' ) }
						</Button>
						{ getState( 'action' ) === 'drop' && (
							<Button
								variant="secondary"
								onClick={ () => {
									changeState( {
										action: false,
										editModal: false,
									} );
									onCancelPoint();
								} }
							>
								{ __( 'Cancel', 'getwid' ) }
							</Button>
						) }
					</div>
				</Modal>
			) }
			{ hasSelectedPoint && selectedPoint !== null && (
				<PanelBody
					title={ __( 'Point Settings', 'getwid' ) }
					initialOpen
				>
					{ pointFields( selectedPoint ) }
				</PanelBody>
			) }
		</InspectorControls>
	);
}
