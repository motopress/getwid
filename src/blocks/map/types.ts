import type { BlockEditProps } from '@wordpress/blocks';

export type MapCenter = {
	lat: number;
	lng: number;
};

export type MapMarker = {
	name: string;
	description: string;
	popUpOpen: boolean;
	popUpMaxWidth: number | string;
	bounce: boolean;
	coords: MapCenter;
};

export type MapAttributes = {
	mapHeight: number;
	mapCenter: MapCenter;
	mapZoom: number;
	interaction: string;
	zoomControl: boolean;
	mapTypeControl: boolean;
	streetViewControl: boolean;
	fullscreenControl: boolean;
	mapStyle: string;
	customStyle?: string;
	blockAlignment?: string;
	mapMarkers: string;
	className?: string;
};

export type MapState = {
	currentMarker: number | null;
	googleApiKey: string;
	checkApiKey: string;
	mapObj: GoogleMap | null;
	markerArrTemp: GoogleMarker[];
	action: false | 'drop' | 'edit';
	editModal: boolean;
	firstInit: boolean;
	readyState: boolean;
	error?: string;
};

export type MapEditProps = BlockEditProps< MapAttributes > & {
	className?: string;
};

export type MapInspectorProps = MapEditProps & {
	initMarkers: (
		firstInit?: boolean,
		refreshMarker?: boolean,
		markerId?: number,
		googleMap?: GoogleMap | null
	) => void;
	cancelMarker: () => void;
	onDeleteMarker: ( markerId?: number ) => void;
	updateArrValues: ( value: Partial< MapMarker >, index: number ) => void;
	changeState: < K extends keyof MapState >(
		key: K,
		value: MapState[ K ]
	) => void;
	getState: < K extends keyof MapState >( key: K ) => MapState[ K ];
	manageGoogleAPIKey: (
		event: { preventDefault?: () => void },
		option: 'set' | 'delete'
	) => void;
	removeGoogleAPIScript: () => void;
	currentWindow: GoogleMapsRuntime | null | undefined;
};

export type GoogleMapsRuntime = Window & {
	google?: GoogleNamespace;
	Getwid?: {
		ajax_url: string;
		current_user?: {
			can_manage_options?: boolean;
		};
		settings?: {
			google_api_key?: string;
		};
		nonces?: {
			google_api_key?: string;
		};
	};
};

export type GoogleNamespace = {
	maps: {
		Map: new (
			element: HTMLElement,
			options: Record< string, unknown >
		) => GoogleMap;
		Marker: new ( options: Record< string, unknown > ) => GoogleMarker;
		InfoWindow: new (
			options: Record< string, unknown >
		) => GoogleInfoWindow;
		Geocoder: new () => GoogleGeocoder;
		Animation: {
			DROP: unknown;
			BOUNCE: unknown;
		};
		event: {
			clearInstanceListeners: ( instance: unknown ) => void;
		};
	};
};

export type GoogleLatLng = {
	lat: () => number;
	lng: () => number;
};

export type GoogleMap = {
	addListener: (
		eventName: string,
		callback: ( event?: { latLng: GoogleLatLng } ) => void
	) => void;
	getCenter: () => GoogleLatLng;
	getZoom: () => number;
	panTo: ( center: MapCenter ) => void;
	setOptions: ( options: Record< string, unknown > ) => void;
	setZoom: ( zoom: number ) => void;
};

export type GoogleMarker = {
	id: number;
	popUp?: GoogleInfoWindow;
	addListener: (
		eventName: string,
		callback: ( event: { latLng: GoogleLatLng } ) => void
	) => void;
	get: ( key: string ) => GoogleMap;
	getAnimation: () => unknown;
	setAnimation: ( animation: unknown | null ) => void;
	setMap: ( map: GoogleMap | null ) => void;
	setPosition: ( center: MapCenter ) => void;
};

export type GoogleInfoWindow = {
	content?: string;
	close: () => void;
	open: ( map: GoogleMap, marker: GoogleMarker ) => void;
	setContent: ( content: string ) => void;
	setOptions: ( options: Record< string, unknown > ) => void;
};

export type GoogleGeocoder = {
	geocode: (
		request: { location: MapCenter },
		callback: (
			results: Array< { formatted_address: string } >,
			status: string
		) => void
	) => void;
};

export type StylesGlobal = Window & {
	stylesArr?: Record< string, unknown[] >;
};
