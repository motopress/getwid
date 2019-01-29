const { __ } = wp.i18n;

const attributes = {
	mapHeight: {
		type: 'number',
		default: 600,
	},
	mapCenter: {
		type: 'object',
		default:{
			lat: 40.71226440769226,
			lng: -74.00230754210543,
		},
	},
	mapZoom: {
		type: 'number',
		default: 13,
		selector: '.wp-block-getwid-map',
		attribute: 'data-map-zoom',
	},
	interaction: {
		type: 'string',
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
		default: 'default',
		selector: '.wp-block-getwid-map',
		attribute: 'data-map-style',
	},
	customStyle: {
		type: 'string',
		selector: '.wp-block-getwid-map',
		attribute: 'data-custom-style',
	},	
	blockAlignment: {
		type: 'string',
		default: 'none',
	},
	markersArrays: {
		type: 'string',
		default: '',
		// type: 'array',
/*		default: [],
		source: 'query',
		selector: '.wp-block-getwid-map .wp-block-getwid-map__points li',
		query:{
			name:{
				source: 'attribute',
				attribute: 'data-name',
			},
			description:{
				type: 'string',
				source: 'html',
				selector: 'a',
			},
			popUpOpen:{
				source: 'attribute',
				attribute: 'data-pop-up-open',
			},
			popUpMaxWidth:{
				source: 'attribute',
				attribute: 'data-pop-up-max-width',
			},
			bounce:{
				source: 'attribute',
				attribute: 'data-bounce',
			},
			coords: {
				source: 'attribute',
				attribute: 'data-coords',
			},

		},*/
	},
};
export default attributes;