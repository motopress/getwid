import {
	BaseControl,
	Button,
	ButtonGroup,
	ExternalLink,
	Modal,
	PanelBody,
	RadioControl,
	RangeControl,
	SelectControl,
	TextareaControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { InspectorControls } from '@wordpress/block-editor';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { CustomPanelBody, TabsControl } from 'getwid-components';

import {
	baseClass,
	googleMapsApiKeyHelpUrl,
	mapStyleOptions,
} from './constants';
import type { GoogleMapsRuntime, MapInspectorProps } from './types';
import { parseMapMarkers } from './utils';

const runtimeGlobal = window as GoogleMapsRuntime;

type TabName = 'general' | 'style' | 'layout';

export default function Inspector( props: MapInspectorProps ) {
	const {
		attributes,
		setAttributes,
		initMarkers,
		cancelMarker,
		onDeleteMarker,
		updateArrValues,
		changeState,
		getState,
		manageGoogleAPIKey,
	} = props;
	const {
		mapHeight,
		mapCenter,
		mapZoom,
		mapStyle,
		interaction,
		zoomControl,
		mapTypeControl,
		streetViewControl,
		fullscreenControl,
		customStyle,
		mapMarkers,
	} = attributes;
	const [ tabName, setTabName ] = useState< TabName >( 'general' );
	const markers = parseMapMarkers( mapMarkers );
	const currentMarker = getState( 'currentMarker' );
	const action = getState( 'action' );
	const editModal = getState( 'editModal' );

	function renderEditModal( index: number | null ) {
		if ( index === null || typeof markers[ index ] === 'undefined' ) {
			return null;
		}

		const marker = markers[ index ];

		if (
			! ( action === 'edit' || action === 'drop' ) ||
			editModal !== true
		) {
			return null;
		}

		return (
			<Modal
				className={ `${ baseClass }__modal` }
				title={ __( 'Edit Marker', 'getwid' ) }
				onRequestClose={ () => {
					changeState( 'action', false );
					changeState( 'editModal', false );

					if ( action === 'drop' ) {
						cancelMarker();
					} else {
						changeState( 'currentMarker', null );
					}
				} }
			>
				<TextControl
					label={ __( 'Name', 'getwid' ) }
					value={ marker.name }
					onChange={ ( value ) =>
						updateArrValues( { name: value }, index )
					}
					__nextHasNoMarginBottom
				/>
				<TextareaControl
					label={ __(
						'Popup Content. Plain Text or HTML.',
						'getwid'
					) }
					rows={ 5 }
					value={ marker.description }
					onChange={ ( value ) =>
						updateArrValues( { description: value }, index )
					}
				/>
				<ToggleControl
					label={ __( 'Opened by default', 'getwid' ) }
					checked={ marker.popUpOpen }
					onChange={ ( value ) =>
						updateArrValues( { popUpOpen: value }, index )
					}
				/>
				<TextControl
					label={ __( 'Popup Maximum Width, px.', 'getwid' ) }
					value={ String( marker.popUpMaxWidth ) }
					type="number"
					onChange={ ( value ) =>
						updateArrValues( { popUpMaxWidth: value }, index )
					}
					__nextHasNoMarginBottom
				/>
				<TextControl
					label={ __( 'Latitude', 'getwid' ) }
					value={ String( marker.coords.lat ) }
					type="number"
					onChange={ ( value ) =>
						updateArrValues(
							{
								coords: {
									lat: parseFloat( value ),
									lng: marker.coords.lng,
								},
							},
							index
						)
					}
					__nextHasNoMarginBottom
				/>
				<TextControl
					label={ __( 'Longitude', 'getwid' ) }
					value={ String( marker.coords.lng ) }
					type="number"
					onChange={ ( value ) =>
						updateArrValues(
							{
								coords: {
									lat: marker.coords.lat,
									lng: parseFloat( value ),
								},
							},
							index
						)
					}
					__nextHasNoMarginBottom
				/>
				<ButtonGroup>
					<Button
						isPrimary
						onClick={ () => {
							if ( action === 'drop' ) {
								initMarkers(
									false,
									false,
									currentMarker || 0,
									getState( 'mapObj' )
								);
							} else if ( action === 'edit' ) {
								initMarkers(
									false,
									true,
									currentMarker || 0,
									getState( 'mapObj' )
								);
							}

							changeState( 'currentMarker', null );
							changeState( 'action', false );
							changeState( 'editModal', false );
						} }
					>
						{ action === 'drop'
							? __( 'Save', 'getwid' )
							: __( 'Update', 'getwid' ) }
					</Button>
					{ action === 'drop' && (
						<Button
							isSecondary
							onClick={ () => {
								changeState( 'action', false );
								changeState( 'editModal', false );
								cancelMarker();
							} }
						>
							{ __( 'Cancel', 'getwid' ) }
						</Button>
					) }
				</ButtonGroup>
			</Modal>
		);
	}

	function renderMarkersSettings( index: number ) {
		const marker = markers[ index ];
		const markerInstance = getState( 'markerArrTemp' )[ index ];

		if ( typeof marker === 'undefined' ) {
			return null;
		}

		return (
			<CustomPanelBody
				key={ index }
				title={ `${ __( 'Marker', 'getwid' ) }: ${ marker.name }` }
				initialOpen={ false }
				onOpen={ () =>
					markerInstance?.setAnimation(
						runtimeGlobal.google?.maps.Animation.BOUNCE || null
					)
				}
				onClose={ () => markerInstance?.setAnimation( null ) }
			>
				<TextControl
					label={ __( 'Name', 'getwid' ) }
					value={ marker.name }
					onChange={ ( value ) =>
						updateArrValues( { name: value }, index )
					}
					__nextHasNoMarginBottom
				/>
				<TextareaControl
					label={ __(
						'Popup Content. Plain Text or HTML.',
						'getwid'
					) }
					rows={ 5 }
					value={ marker.description }
					onChange={ ( value ) =>
						updateArrValues( { description: value }, index )
					}
				/>
				<ToggleControl
					label={ __( 'Opened by default', 'getwid' ) }
					checked={ marker.popUpOpen }
					onChange={ ( value ) =>
						updateArrValues( { popUpOpen: value }, index )
					}
				/>
				<TextControl
					label={ __( 'Popup Width', 'getwid' ) }
					value={ String( marker.popUpMaxWidth ) }
					type="number"
					onChange={ ( value ) =>
						updateArrValues( { popUpMaxWidth: value }, index )
					}
					__nextHasNoMarginBottom
				/>
				<TextControl
					label={ __( 'Latitude', 'getwid' ) }
					value={ String( marker.coords.lat ) }
					type="number"
					onChange={ ( value ) =>
						updateArrValues(
							{
								coords: {
									lat: parseFloat( value ),
									lng: marker.coords.lng,
								},
							},
							index
						)
					}
					__nextHasNoMarginBottom
				/>
				<TextControl
					label={ __( 'Longitude', 'getwid' ) }
					value={ String( marker.coords.lng ) }
					type="number"
					onChange={ ( value ) =>
						updateArrValues(
							{
								coords: {
									lat: marker.coords.lat,
									lng: parseFloat( value ),
								},
							},
							index
						)
					}
					__nextHasNoMarginBottom
				/>
				<ButtonGroup>
					<Button
						isPrimary
						onClick={ () => {
							initMarkers(
								false,
								true,
								index,
								getState( 'mapObj' )
							);
						} }
					>
						{ __( 'Update', 'getwid' ) }
					</Button>
					<Button
						isSecondary
						onClick={ () => {
							onDeleteMarker( index );
						} }
					>
						{ __( 'Delete', 'getwid' ) }
					</Button>
				</ButtonGroup>
			</CustomPanelBody>
		);
	}

	return (
		<InspectorControls>
			<TabsControl
				state={ tabName }
				onChangeTab={ ( value ) => setTabName( value as TabName ) }
				tabs={ [
					'general',
					'style',
					...( markers.length > 0 ? [ 'layout' as const ] : [] ),
				] }
			/>

			{ tabName === 'general' && (
				<>
					<PanelBody title={ __( 'Settings', 'getwid' ) } initialOpen>
						<RadioControl
							label={ __( 'Zoom & Pan Interaction', 'getwid' ) }
							help={ __(
								'These options are applied on frontend only.',
								'getwid'
							) }
							selected={ interaction }
							options={ [
								{
									value: 'cooperative',
									label: __(
										'Prevent zoom on page scroll',
										'getwid'
									),
								},
								{
									value: 'none',
									label: __(
										'Disable zoom and pan',
										'getwid'
									),
								},
								{
									value: 'greedy',
									label: __(
										'Enable zoom and pan',
										'getwid'
									),
								},
							] }
							onChange={ ( value ) =>
								setAttributes( { interaction: value } )
							}
						/>
					</PanelBody>

					<PanelBody
						title={ __( 'Map Center & Zoom', 'getwid' ) }
						initialOpen={ false }
					>
						<TextControl
							label={ __( 'Zoom', 'getwid' ) }
							help={ __(
								'Drag and zoom map in preview area to apply.',
								'getwid'
							) }
							value={ String( mapZoom ) }
							type="number"
							min={ 1 }
							max={ 22 }
							step={ 1 }
							onChange={ ( value ) => {
								const googleMap = getState( 'mapObj' );
								googleMap?.setZoom(
									value === '' || value === '0'
										? 1
										: parseInt( value, 10 )
								);
							} }
							__nextHasNoMarginBottom
						/>
						<TextControl
							label={ __( 'Center Latitude', 'getwid' ) }
							value={ String( mapCenter.lat ) }
							type="number"
							onChange={ ( value ) =>
								setAttributes( {
									mapCenter: {
										lat: parseFloat( value ),
										lng: mapCenter.lng,
									},
								} )
							}
							__nextHasNoMarginBottom
						/>
						<TextControl
							label={ __( 'Center Longitude', 'getwid' ) }
							value={ String( mapCenter.lng ) }
							type="number"
							onChange={ ( value ) =>
								setAttributes( {
									mapCenter: {
										lat: mapCenter.lat,
										lng: parseFloat( value ),
									},
								} )
							}
							__nextHasNoMarginBottom
						/>
					</PanelBody>

					{ !! runtimeGlobal.Getwid?.current_user
						?.can_manage_options && (
						<PanelBody
							title={ __( 'Google Maps API Key', 'getwid' ) }
							initialOpen={ false }
						>
							<TextControl
								label={ __( 'Google Maps API Key', 'getwid' ) }
								value={ getState( 'checkApiKey' ) }
								onChange={ ( value ) =>
									changeState( 'checkApiKey', value )
								}
								__nextHasNoMarginBottom
							/>
							<BaseControl>
								<ButtonGroup>
									<Button
										isPrimary
										disabled={
											getState( 'checkApiKey' ) === ''
										}
										onClick={ ( event ) =>
											manageGoogleAPIKey( event, 'set' )
										}
									>
										{ __( 'Update', 'getwid' ) }
									</Button>
									<Button
										isSecondary
										onClick={ ( event ) =>
											manageGoogleAPIKey(
												event,
												'delete'
											)
										}
									>
										{ __( 'Delete', 'getwid' ) }
									</Button>
								</ButtonGroup>
							</BaseControl>
							<BaseControl>
								<ExternalLink href={ googleMapsApiKeyHelpUrl }>
									{ __( 'Get your key.', 'getwid' ) }
								</ExternalLink>
							</BaseControl>
							{ getState( 'error' ) && (
								<p>{ getState( 'error' ) }</p>
							) }
						</PanelBody>
					) }
				</>
			) }

			{ tabName === 'style' && (
				<PanelBody initialOpen>
					<RangeControl
						label={ __( 'Map Height', 'getwid' ) }
						value={ mapHeight }
						onChange={ ( value ) =>
							setAttributes( {
								mapHeight:
									typeof value === 'undefined' ? 600 : value,
							} )
						}
						allowReset
						min={ 100 }
						max={ 1080 }
						step={ 1 }
					/>
					<ToggleControl
						label={ __( 'Show Zoom', 'getwid' ) }
						checked={ zoomControl }
						onChange={ ( value ) =>
							setAttributes( { zoomControl: value } )
						}
					/>
					<ToggleControl
						label={ __( 'Show Map Type', 'getwid' ) }
						checked={ mapTypeControl }
						onChange={ ( value ) =>
							setAttributes( { mapTypeControl: value } )
						}
					/>
					<ToggleControl
						label={ __( 'Show Street View', 'getwid' ) }
						checked={ streetViewControl }
						onChange={ ( value ) =>
							setAttributes( { streetViewControl: value } )
						}
					/>
					<ToggleControl
						label={ __( 'Show Full Screen', 'getwid' ) }
						checked={ fullscreenControl }
						onChange={ ( value ) =>
							setAttributes( { fullscreenControl: value } )
						}
					/>
					<SelectControl
						label={ __( 'Map Style', 'getwid' ) }
						value={ mapStyle }
						onChange={ ( value ) =>
							setAttributes( { mapStyle: value } )
						}
						options={ mapStyleOptions }
					/>
					{ mapStyle === 'custom' && (
						<>
							<TextareaControl
								label={ __( 'Custom Style (JSON)', 'getwid' ) }
								rows={ 8 }
								value={ customStyle }
								onChange={ ( value ) =>
									setAttributes( { customStyle: value } )
								}
							/>
							<ExternalLink href="https://mapstyle.withgoogle.com/">
								{ __( 'Google Maps Styling Wizard', 'getwid' ) }
							</ExternalLink>
							<br />
							<ExternalLink href="https://snazzymaps.com/explore">
								{ __( 'Snazzy Maps', 'getwid' ) }
							</ExternalLink>
						</>
					) }
				</PanelBody>
			) }

			{ renderEditModal( currentMarker ) }

			{ markers.length > 0 && tabName === 'layout' && (
				<PanelBody title={ __( 'Markers', 'getwid' ) }>
					{ markers.map( ( _marker, index ) =>
						renderMarkersSettings( index )
					) }
				</PanelBody>
			) }
		</InspectorControls>
	);
}
