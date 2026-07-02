// import type { ComponentType } from '@wordpress/element';

declare const Getwid: {
	disabled_blocks: string[];
	options_url: {
		blocks: string;
	};
	settings?: {
		iconList?: string[];
		image_sizes?: Array< {
			label: string;
			value: string;
		} >;
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
