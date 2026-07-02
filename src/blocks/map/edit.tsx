import {
	BlockAlignmentToolbar,
	BlockControls,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Button,
	TextControl,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { useEffect, useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import classnames from 'classnames';
import jQuery from 'jquery';

import { baseClass, googleMapsApiKeyHelpUrl } from './constants';
import Inspector from './inspector';
import type {
	GoogleInfoWindow,
	GoogleMap,
	GoogleMapsRuntime,
	GoogleMarker,
	MapEditProps,
	MapMarker,
	MapState,
} from './types';
import { getMapStyles, parseMapMarkers, updateMarkerAt } from './utils';

import './editor.scss';

const runtimeGlobal = window as GoogleMapsRuntime;

function markerDefaults( index: number ): MapMarker {
	return {
		name: `#${ index + 1 }`,
		description: '',
		popUpOpen: false,
		popUpMaxWidth: 250,
		bounce: false,
		coords: {
			lat: 0,
			lng: 0,
		},
	};
}

export default function Edit( props: MapEditProps ) {
	const { attributes, setAttributes } = props;
	const {
		mapHeight,
		mapCenter,
		mapZoom,
		zoomControl,
		mapTypeControl,
		streetViewControl,
		fullscreenControl,
		mapMarkers,
		blockAlignment,
	} = attributes;
	const mapRef = useRef< HTMLDivElement | null >( null );
	const waitLoadGoogle = useRef< ReturnType< typeof setInterval > | null >(
		null
	);
	const initialApiKey = runtimeGlobal.Getwid?.settings?.google_api_key || '';
	const [ state, setState ] = useState< MapState >( {
		currentMarker: null,
		googleApiKey: initialApiKey,
		checkApiKey: initialApiKey,
		mapObj: null,
		markerArrTemp: [],
		action: false,
		editModal: false,
		firstInit: true,
		readyState: false,
	} );
	const stateRef = useRef( state );

	useEffect( () => {
		stateRef.current = state;
	}, [ state ] );

	function changeState< K extends keyof MapState >(
		key: K,
		value: MapState[ K ]
	) {
		setState( ( current ) => ( { ...current, [ key ]: value } ) );
	}

	function getState< K extends keyof MapState >( key: K ) {
		return state[ key ];
	}

	function setMarkers( markers: MapMarker[] ) {
		setAttributes( { mapMarkers: JSON.stringify( markers ) } );
	}

	function updateArrValues( value: Partial< MapMarker >, index: number ) {
		const markers = parseMapMarkers( mapMarkers );
		setMarkers( updateMarkerAt( markers, index, value ) );
	}

	function getCurrentWindow() {
		return mapRef.current?.ownerDocument.defaultView as
			| GoogleMapsRuntime
			| null
			| undefined;
	}

	function addGoogleAPIScript() {
		const currentDocument = mapRef.current?.ownerDocument;

		if ( ! currentDocument ) {
			return;
		}

		if ( jQuery( currentDocument ).find( '#google_api_js' ).length ) {
			changeState( 'readyState', true );
			return;
		}

		const script = currentDocument.createElement( 'script' );
		script.type = 'text/javascript';
		script.src = `https://maps.googleapis.com/maps/api/js?key=${
			runtimeGlobal.Getwid?.settings?.google_api_key || ''
		}`;
		script.id = 'google_api_js';
		currentDocument
			.getElementsByTagName( 'head' )[ 0 ]
			.appendChild( script );

		script.onload = script.onreadystatechange = () => {
			changeState( 'readyState', true );
		};
	}

	function removeGoogleAPIScript() {
		const currentDocument = mapRef.current?.ownerDocument;

		if ( ! currentDocument ) {
			return;
		}

		jQuery( currentDocument ).find( '#google_api_js' ).remove();
		jQuery( currentDocument )
			.find( "script[src*='maps.googleapis.com']" )
			.each( ( _index, value ) => {
				jQuery( value ).remove();
			} );

		const currentWindow = currentDocument.defaultView as GoogleMapsRuntime;
		currentWindow.google = undefined;
	}

	function manageGoogleAPIKey(
		event: { preventDefault?: () => void },
		option: 'set' | 'delete'
	) {
		event.preventDefault?.();

		jQuery.post(
			runtimeGlobal.Getwid?.ajax_url || '',
			{
				action: 'get_google_api_key',
				data: state.checkApiKey,
				option,
				nonce: runtimeGlobal.Getwid?.nonces?.google_api_key || '',
			},
			( response: { success: boolean; data?: string } ) => {
				if ( ! response.success ) {
					changeState( 'error', response.data || '' );
					return;
				}

				switch ( option ) {
					case 'set':
						runtimeGlobal.Getwid!.settings!.google_api_key =
							state.checkApiKey;
						removeGoogleAPIScript();
						addGoogleAPIScript();
						break;
					case 'delete':
						runtimeGlobal.Getwid!.settings!.google_api_key = '';
						removeGoogleAPIScript();
						setState( ( current ) => ( {
							...current,
							checkApiKey: '',
							googleApiKey: '',
							mapObj: null,
							markerArrTemp: [],
							readyState: false,
							firstInit: true,
						} ) );
						break;
				}
			}
		);
	}

	function initMapEvents( googleMap: GoogleMap ) {
		const currentWindow = getCurrentWindow();
		const google = currentWindow?.google;

		if ( ! google ) {
			return;
		}

		const geocoder = new google.maps.Geocoder();

		googleMap.addListener( 'click', ( event ) => {
			const currentState = stateRef.current;

			if ( currentState.action === 'drop' && event?.latLng ) {
				const latLng = {
					lat: event.latLng.lat(),
					lng: event.latLng.lng(),
				};

				geocoder.geocode( { location: latLng }, ( results, status ) => {
					if ( status === 'OK' && results[ 0 ] ) {
						updateArrValues(
							{ description: results[ 0 ].formatted_address },
							currentState.currentMarker || 0
						);
					}
				} );

				updateArrValues(
					{ coords: latLng },
					currentState.currentMarker || 0
				);
				changeState( 'editModal', true );
			} else {
				changeState( 'currentMarker', null );
			}
		} );

		googleMap.addListener( 'zoom_changed', () => {
			setAttributes( { mapZoom: googleMap.getZoom() } );
		} );

		googleMap.addListener( 'dragend', () => {
			setAttributes( {
				mapCenter: {
					lat: googleMap.getCenter().lat(),
					lng: googleMap.getCenter().lng(),
				},
			} );
		} );
	}

	function attachMessage(
		markerId: number,
		marker: GoogleMarker,
		message: string,
		opened: boolean,
		maxWidth: number | string,
		refreshMarker: boolean
	) {
		const currentWindow = getCurrentWindow();
		const google = currentWindow?.google;

		if ( ! google ) {
			return;
		}

		let popUp: GoogleInfoWindow;

		if ( ! refreshMarker || ! marker.popUp ) {
			popUp = new google.maps.InfoWindow( {
				content: message,
				maxWidth,
			} );
			marker.popUp = popUp;
		} else {
			popUp = marker.popUp;
			popUp.setContent( message );
			popUp.setOptions( { maxWidth } );
		}

		if ( refreshMarker ) {
			popUp.close();
		}

		if ( opened ) {
			popUp.open( marker.get( 'map' ), marker );
		}

		marker.addListener( 'click', () => {
			if ( popUp.content !== '' ) {
				popUp.open( marker.get( 'map' ), marker );
			}
			changeState( 'currentMarker', marker.id );
		} );

		marker.addListener( 'rightclick', () => {
			if ( marker.getAnimation() !== null ) {
				marker.setAnimation( null );
				updateArrValues( { bounce: false }, marker.id );
			} else {
				marker.setAnimation( google.maps.Animation.BOUNCE );
				updateArrValues( { bounce: true }, marker.id );
			}
		} );

		marker.addListener( 'dragend', ( event ) => {
			updateArrValues(
				{
					coords: {
						lat: event.latLng.lat(),
						lng: event.latLng.lng(),
					},
				},
				marker.id
			);
		} );
	}

	function initMarkers(
		firstInit = false,
		refreshMarker = false,
		markerId = 0,
		googleMap: GoogleMap | null = null
	) {
		const currentWindow = getCurrentWindow();
		const google = currentWindow?.google;
		const markers = parseMapMarkers( mapMarkers );
		const markerData = markers[ markerId ];

		if ( ! google || ! markerData ) {
			return;
		}

		const latLng = markerData.coords;
		let marker: GoogleMarker;

		if ( ! refreshMarker ) {
			marker = new google.maps.Marker( {
				id: markerId,
				position: latLng,
				map: googleMap,
				draggable: true,
				animation: firstInit ? google.maps.Animation.DROP : null,
			} );

			setState( ( current ) => {
				const nextMarkerArrTemp = [ ...current.markerArrTemp ];
				nextMarkerArrTemp[ markerId ] = marker;

				return {
					...current,
					markerArrTemp: nextMarkerArrTemp,
				};
			} );

			if ( markerData.bounce ) {
				setTimeout(
					() => marker.setAnimation( google.maps.Animation.BOUNCE ),
					2000
				);
			}
		} else {
			marker = state.markerArrTemp[ markerId ];
			marker.setPosition( latLng );
		}

		const message =
			markerData.description !== ''
				? `
				<div class='getwid-poi-info-window'>
					${ markerData.description }
				</div>
			`
				: '';

		attachMessage(
			markerId,
			marker,
			message,
			markerData.popUpOpen,
			markerData.popUpMaxWidth,
			refreshMarker
		);
	}

	function initMap( prevAttributes?: MapEditProps[ 'attributes' ] ) {
		const currentWindow = getCurrentWindow();
		const google = currentWindow?.google;
		const markers = parseMapMarkers( mapMarkers );
		const mapCenterChanged =
			JSON.stringify( attributes.mapCenter ) !==
			JSON.stringify( prevAttributes?.mapCenter );

		if ( ! google || ! mapRef.current ) {
			return;
		}

		if ( state.firstInit && state.readyState ) {
			if ( waitLoadGoogle.current ) {
				clearInterval( waitLoadGoogle.current );
			}

			waitLoadGoogle.current = setInterval( () => {
				const current = getCurrentWindow();

				if ( ! current?.google || ! mapRef.current ) {
					return;
				}

				if ( waitLoadGoogle.current ) {
					clearInterval( waitLoadGoogle.current );
				}

				const mapContainer =
					mapRef.current.querySelector< HTMLElement >(
						`.${ baseClass }__container`
					);

				if ( ! mapContainer ) {
					return;
				}

				jQuery( mapRef.current ).on( 'keydown', ( event ) => {
					const currentState = stateRef.current;
					if (
						event.keyCode === 46 &&
						currentState.currentMarker !== null &&
						currentState.action !== 'drop' &&
						window.confirm( __( 'Delete Marker', 'getwid' ) )
					) {
						onDeleteMarker( currentState.currentMarker );
					}
				} );

				const googleMap = new current.google.maps.Map( mapContainer, {
					center: mapCenter,
					styles: getMapStyles(
						attributes.mapStyle,
						attributes.customStyle
					),
					gestureHandling: 'cooperative',
					zoomControl,
					mapTypeControl,
					streetViewControl,
					fullscreenControl,
					zoom: mapZoom,
				} );

				setState( ( currentState ) => ( {
					...currentState,
					mapObj: googleMap,
					firstInit: false,
				} ) );

				markers.forEach( ( _marker, index ) => {
					initMarkers( true, false, index, googleMap );
				} );

				initMapEvents( googleMap );
			}, 100 );
			return;
		}

		const googleMap = state.mapObj;

		if ( googleMap ) {
			googleMap.setOptions( {
				styles: getMapStyles(
					attributes.mapStyle,
					attributes.customStyle
				),
				zoomControl,
				mapTypeControl,
				streetViewControl,
				fullscreenControl,
			} );

			if ( mapCenterChanged ) {
				googleMap.panTo( mapCenter );
			}
		}
	}

	function cancelMarker() {
		const markers = parseMapMarkers( mapMarkers );

		setMarkers(
			markers.filter(
				( _marker, index ) => index !== state.currentMarker
			)
		);
		changeState( 'currentMarker', null );
	}

	function onAddMarker() {
		const markers = parseMapMarkers( mapMarkers );
		const nextMarkers = [ ...markers, markerDefaults( markers.length ) ];
		const nextMarkerId =
			nextMarkers.length === 1 ? 0 : nextMarkers.length - 1;

		setMarkers( nextMarkers );
		changeState( 'currentMarker', nextMarkerId );
		changeState( 'action', 'drop' );
	}

	function onDeleteMarker( markerId = 0 ) {
		const markers = parseMapMarkers( mapMarkers );
		const marker = state.markerArrTemp[ markerId ];
		const nextMarkers = markers.filter(
			( _marker, index ) => index !== markerId
		);
		const nextMarkerArrTemp = state.markerArrTemp
			.filter( ( _marker, index ) => index !== markerId )
			.map( ( item, index ) => {
				item.id = index;
				return item;
			} );

		marker?.setMap( null );
		changeState( 'currentMarker', null );
		changeState( 'markerArrTemp', nextMarkerArrTemp );
		setMarkers( nextMarkers );
	}

	useEffect( () => {
		if ( state.googleApiKey !== '' ) {
			addGoogleAPIScript();
		}

		return () => {
			if ( waitLoadGoogle.current ) {
				clearInterval( waitLoadGoogle.current );
			}
		};
		// Match legacy mount/unmount script behavior.
	}, [] );

	useEffect( () => {
		if (
			runtimeGlobal.Getwid?.settings?.google_api_key !== '' &&
			( ( state.firstInit && state.readyState ) || state.mapObj )
		) {
			initMap();
		}
		// initMap depends on mutable Google map instances and mirrors legacy componentDidUpdate.
	}, [ attributes, state.readyState ] );

	if ( runtimeGlobal.Getwid?.settings?.google_api_key === '' ) {
		if ( ! runtimeGlobal.Getwid?.current_user?.can_manage_options ) {
			return (
				<div>
					<p>
						{ __(
							'Contact the site administrator to set up the required keys.',
							'getwid'
						) }
					</p>
				</div>
			);
		}

		return (
			<form
				className={ `${ baseClass }__key-form` }
				onSubmit={ ( event ) => manageGoogleAPIKey( event, 'set' ) }
			>
				<span className="form-title">
					{ __( 'Google Maps API key.', 'getwid' ) }{ ' ' }
					<a
						href={ googleMapsApiKeyHelpUrl }
						target="_blank"
						rel="noreferrer"
					>
						{ __( 'Get your key.', 'getwid' ) }
					</a>
				</span>

				<div className="form-wrapper">
					<TextControl
						placeholder={ __( 'Google Maps API Key', 'getwid' ) }
						value={ state.checkApiKey }
						onChange={ ( value ) =>
							changeState( 'checkApiKey', value )
						}
						__nextHasNoMarginBottom
					/>

					<Button
						isPrimary
						type="submit"
						disabled={ state.checkApiKey === '' }
					>
						{ __( 'Save API Key', 'getwid' ) }
					</Button>
				</div>
				{ state.error && (
					<span className="form-description">{ state.error }</span>
				) }
				<div ref={ mapRef } />
			</form>
		);
	}

	const blockProps = useBlockProps( {
		className: classnames( {
			[ `${ baseClass }--dropMarker` ]: state.action === 'drop',
		} ),
	} );

	return (
		<>
			<BlockControls>
				<BlockAlignmentToolbar
					value={ blockAlignment }
					controls={ [ 'wide', 'full' ] }
					onChange={ ( value ) =>
						setAttributes( { blockAlignment: value } )
					}
				/>
				<ToolbarGroup>
					<ToolbarButton
						isDisabled={ state.currentMarker !== null }
						onClick={ () => {
							if ( state.action !== 'drop' ) {
								onAddMarker();
							}
						} }
					>
						{ __( 'Drop Marker', 'getwid' ) }
					</ToolbarButton>
				</ToolbarGroup>
				<ToolbarGroup>
					<ToolbarButton
						isDisabled={
							state.currentMarker === null ||
							state.action === 'drop'
						}
						isPressed={ state.action === 'edit' && state.editModal }
						onClick={ () => {
							changeState( 'action', 'edit' );
							changeState( 'editModal', true );
						} }
					>
						{ __( 'Edit Marker', 'getwid' ) }
					</ToolbarButton>
					<ToolbarButton
						icon="trash"
						title={ __( 'Delete Marker', 'getwid' ) }
						isDisabled={
							state.currentMarker === null ||
							state.action === 'drop'
						}
						onClick={ () => {
							onDeleteMarker( state.currentMarker || 0 );
						} }
					/>
				</ToolbarGroup>
			</BlockControls>
			<Inspector
				{ ...props }
				initMarkers={ initMarkers }
				cancelMarker={ cancelMarker }
				onDeleteMarker={ onDeleteMarker }
				updateArrValues={ updateArrValues }
				changeState={ changeState }
				getState={ getState }
				manageGoogleAPIKey={ manageGoogleAPIKey }
				removeGoogleAPIScript={ removeGoogleAPIScript }
			/>
			<div { ...blockProps } ref={ mapRef }>
				<div
					style={ { height: `${ mapHeight }px` } }
					className={ `${ baseClass }__container` }
				/>
			</div>
		</>
	);
}
