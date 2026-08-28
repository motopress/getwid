export type BannerMediaType = 'image' | 'video';

export type ColorValue = {
	color?: string;
	class?: string;
};

export type BannerAttributes = {
	backgroundColor?: string;
	textColor?: string;
	customBackgroundColor?: string;
	customTextColor?: string;
	imageSize: string;
	id?: number;
	url?: string;
	type: BannerMediaType;
	title?: string;
	text?: string;
	link?: string;
	align?: 'wide' | 'full' | string;
	minHeight?: string;
	contentMaxWidth?: string;
	verticalAlign: 'top' | 'center' | 'bottom' | string;
	horizontalAlign: 'left' | 'center' | 'right' | string;
	backgroundOpacity: number;
	blockAnimation: string;
	textAnimation: string;
	linkTarget?: string;
	rel?: string;
	className?: string;
	videoAutoplay?: boolean;
};

export type MediaSize = {
	source_url?: string;
	url?: string;
};

export type MediaObject = {
	id?: number;
	url?: string;
	type?: string;
	media_type?: string;
	media_details?: {
		sizes?: Record< string, MediaSize >;
	};
	sizes?: Record< string, MediaSize >;
};

export type BannerEditProps = {
	attributes: BannerAttributes;
	className?: string;
	isSelected: boolean;
	setAttributes: ( attributes: Partial< BannerAttributes > ) => void;
	backgroundColor: ColorValue;
	textColor: ColorValue;
	setBackgroundColor: ( color?: string ) => void;
	setTextColor: ( color?: string ) => void;
	imgObj?: MediaObject | null;
};
