const { __ } = wp.i18n;

const attributes = {
	mapHeight: {
		type: 'number',
		default: 600,
	},
	mapCenter: {
		type: 'object',
		default: {
			lat: 40.71226440769226,
			lng: -74.00230754210543,
		},
	},
	mapZoom: {
		type: 'number',
		default: 13,
	},
	interaction: {
		type: 'string',
		default: 'cooperative',
	},
	zoomControl: {
		type: 'boolean',
		default: true,
	},
	mapTypeControl: {
		type: 'boolean',
		default: true,
	},
	streetViewControl: {
		type: 'boolean',
		default: true,
	},
	fullscreenControl: {
		type: 'boolean',
		default: true,
	},		
	mapStyle: {
		type: 'string',
		default: null,
	},
	customStyle: {
		type: 'string',
	},	
	blockAlignment: {
		type: 'string',
		default: 'none',
	},
	markersArrays: {
		type: 'array',
		default: [],
	},
};
export default attributes;