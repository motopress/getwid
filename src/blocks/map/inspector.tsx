import {
	BaseControl,
	Button,
	ExternalLink,
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
import { TabsControl } from 'getwid-components';

import { googleMapsApiKeyHelpUrl, mapStyleOptions } from './constants';
import type { MapInspectorProps } from './types';
import { parseMapMarkers } from './utils';
import { MarkerModal } from './marker-modal';
import { MarkerSettingsPanel } from './marker-setting-panel';

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
		currentWindow,
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

	const google = currentWindow?.google;

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

					{ !! Getwid.current_user.can_manage_options && (
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
								<Button
									variant="primary"
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
									variant="secondary"
									onClick={ ( event ) =>
										manageGoogleAPIKey( event, 'delete' )
									}
								>
									{ __( 'Delete', 'getwid' ) }
								</Button>
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

			{ currentMarker !== null && editModal && (
				<MarkerModal
					isUpdating={ action !== 'drop' }
					marker={ markers[ currentMarker ] }
					onClose={ () => {
						changeState( 'action', false );
						changeState( 'editModal', false );
						if ( action === 'drop' ) {
							cancelMarker();
						}
					} }
					onSave={ ( marker ) => {
						updateArrValues( marker, currentMarker );

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
				/>
			) }

			{ markers.length > 0 && tabName === 'layout' && (
				<PanelBody title={ __( 'Markers', 'getwid' ) }>
					{ markers.map( ( _marker, index ) => (
						<MarkerSettingsPanel
							key={ index }
							marker={ _marker }
							onOpen={ () => {
								if ( ! google ) {
									return;
								}

								getState( 'markerArrTemp' )?.[
									index
								].setAnimation(
									google.maps.Animation.BOUNCE || null
								);
							} }
							onClose={ () =>
								getState( 'markerArrTemp' )?.[
									index
								].setAnimation( null )
							}
							onEdit={ ( value ) =>
								updateArrValues( value, index )
							}
							onUpdate={ () =>
								initMarkers(
									false,
									true,
									index,
									getState( 'mapObj' )
								)
							}
							onDelete={ () => onDeleteMarker( index ) }
						/>
					) ) }
				</PanelBody>
			) }
		</InspectorControls>
	);
}
