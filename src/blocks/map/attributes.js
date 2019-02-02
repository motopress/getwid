const { __ } = wp.i18n;

const attributes = {
	mapHeight: {
		type: 'number',
		default: 600,
	},
	mapCenter: {
		type: 'object',
		default:{
			lat: 37.9106161839889,
			lng: 25.1221243506071,
		},
	},
	mapZoom: {
		type: 'number',
		default: 2,
	},
	interaction: {
		type: 'string',
		source: 'attribute',
		default: 'cooperative',
		selector: '.wp-block-getwid-map',
		attribute: 'data-interaction',
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
		source: 'attribute',
		default: 'default',
		selector: '.wp-block-getwid-map',
		attribute: 'data-map-style',
	},
	customStyle: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-map',
		attribute: 'data-custom-style',
	},	
	blockAlignment: {
		type: 'string',
		default: 'none',
	},
	mapMarkers: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-map',
		attribute: 'data-map-markers',
		default: '',
	},
};
export default attributes;