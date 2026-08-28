import type { BlockEditProps } from '@wordpress/blocks';

export type VideoPopupAttributes = {
	titleColor?: string;
	customTitleColor?: string;
	iconColor?: string;
	customIconColor?: string;
	buttonColorHEX?: string;
	buttonColor?: string;
	customButtonColor?: string;
	overlayColor?: string;
	customOverlayColor?: string;
	imageSize: string;
	id?: number;
	url?: string;
	title?: string;
	text?: string;
	link?: string;
	align?: 'left' | 'center' | 'right' | 'wide' | 'full' | string;
	minHeight?: string;
	buttonMaxWidth?: string;
	overlayOpacity: number;
	imageAnimation: string;
	buttonStyle: 'default' | 'bordered' | 'outline' | 'fill' | string;
	buttonAnimation: 'none' | 'pulse' | string;
	buttonSize: 'default' | 'small' | 'normal' | 'large' | string;
	className?: string;
};

export type MediaObject = {
	id?: number;
	url?: string;
	media_type?: string;
	type?: string;
	media_details?: {
		sizes?: Record< string, { source_url?: string } >;
	};
	sizes?: Record< string, { url?: string } >;
};

export type ColorValue = {
	color?: string;
	class?: string;
};

export type VideoPopupEditProps = BlockEditProps< VideoPopupAttributes > & {
	titleColor: ColorValue;
	iconColor: ColorValue;
	buttonColor: ColorValue;
	overlayColor: ColorValue;
	setTitleColor: ( value?: string ) => void;
	setIconColor: ( value?: string ) => void;
	setButtonColor: ( value?: string ) => void;
	setOverlayColor: ( value?: string ) => void;
};
