import { __ } from '@wordpress/i18n';

export const baseClass = 'wp-block-getwid-map';
export const googleMapsApiKeyHelpUrl =
	'https://developers.google.com/maps/documentation/embed/get-api-key';

export const mapStyleOptions = [
	{ value: 'default', label: __( 'Default', 'getwid' ) },
	{ value: 'silver', label: __( 'Silver', 'getwid' ) },
	{ value: 'retro', label: __( 'Retro', 'getwid' ) },
	{ value: 'dark', label: __( 'Dark', 'getwid' ) },
	{ value: 'night', label: __( 'Night', 'getwid' ) },
	{ value: 'aubergine', label: __( 'Aubergine', 'getwid' ) },
	{ value: 'blue_water', label: __( 'Blue Water', 'getwid' ) },
	{ value: 'ultra_light', label: __( 'Ultra Light', 'getwid' ) },
	{ value: 'dark_silver', label: __( 'Dark Silver', 'getwid' ) },
	{ value: 'shades_of_grey', label: __( 'Shades of Grey', 'getwid' ) },
	{ value: 'no_labels', label: __( 'No Labels', 'getwid' ) },
	{ value: 'wild_west', label: __( 'Wild West', 'getwid' ) },
	{ value: 'vintage', label: __( 'Vintage', 'getwid' ) },
	{ value: 'wireframe', label: __( 'Wireframe', 'getwid' ) },
	{ value: 'light_dream', label: __( 'Light Dream', 'getwid' ) },
	{ value: 'custom', label: __( 'Custom', 'getwid' ) },
];
