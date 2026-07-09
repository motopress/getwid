// import type { ComponentType } from '@wordpress/element';

declare const Getwid: {
	disabled_blocks: string;
	settings: {
		wide_support: string;
		date_time_utc: string;
		post_type: string;
		google_api_key: string;
		instagram_token_isset: boolean;

		assets_path: string;
		image_sizes: { value: string; label: string };

		excerpt_length: number;
		recaptcha_site_key: string;
		recaptcha_secret_key: string;
		mailchimp_api_key: string;
		debug: boolean;
	};
	templates: {
		name: string;
		new: string;
		view: string;
		edit: string;
	};
	ajax_url: string;
	options_general_url: string;
	get_instagram_token_url: string;
	options_url: {
		general: string;
		appearance: string;
		blocks: string;
	};
	nonces: {
		google_api_key: string;
		recaptcha_v2: string;
		mailchimp_api_key: string;
		check_instagram_token: string;
	};
	acf_exist: boolean;
	current_user: {
		can_manage_options: boolean;
	};
};

declare module '*.css';
declare module '*.scss';

// declare module 'getwid-components' {
// 	export interface IconPickerProps {
// 		value?: string;
// 		onChange?: ( value: string ) => void;
// 	}

// 	export const IconPicker: ComponentType< IconPickerProps >;
// }
