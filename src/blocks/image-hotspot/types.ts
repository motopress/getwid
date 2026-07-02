import type { BlockEditProps } from '@wordpress/blocks';

export type HotspotPosition = {
	x: string | number;
	y: string | number;
};

export type ImageHotspotPoint = {
	link: string;
	icon: string;
	title: string;
	color: string;
	content: string;
	backgroundColor: string;
	newTab: boolean;
	popUpOpen: boolean;
	popUpWidth: number | string;
	placement: 'top' | 'right' | 'bottom' | 'left';
	position: HotspotPosition;
};

export type ImageHotspotAttributes = {
	imageSize: string;
	id?: number;
	url?: string;
	alt?: string;
	tooltipTrigger: string;
	tooltipTheme: string;
	tooltipArrow: boolean;
	tooltipAnimation: string;
	dotIcon: string;
	dotSize: number;
	dotPaddings: number;
	dotColor?: string;
	dotBackground?: string;
	dotOpacity: number;
	dotPulse: string;
	dotAppearanceAnimation: string;
	align?: string;
	hoverAnimation: string;
	imagePoints: string;
};

export type MediaObject = {
	id: number;
	alt?: string;
	url: string;
	media_details?: {
		sizes?: Record< string, { source_url: string } >;
	};
	sizes?: Record< string, { url: string } >;
};

export type ImageHotspotEditProps = BlockEditProps< ImageHotspotAttributes >;

export type ImageHotspotState = {
	currentPoint: number | null;
	action: false | 'drop' | 'edit';
	editModal: boolean;
	recentlyAddedPoint: number | null;
	updatePoints?: boolean;
	highlightDot?: boolean;
};

export type ChangeState = {
	( values: Partial< ImageHotspotState > ): void;
	< Key extends keyof ImageHotspotState >(
		key: Key,
		value: ImageHotspotState[ Key ]
	): void;
};

export type GetState = < Key extends keyof ImageHotspotState >(
	key: Key
) => ImageHotspotState[ Key ];

export type RuntimeGlobal = Window & {
	Getwid?: {
		settings?: {
			image_sizes?: Array< { value: string; label: string } >;
		};
	};
	tippy?: (
		element: Element,
		options: Record< string, unknown >
	) => { destroy: () => void; show?: () => void };
	Waypoint?: new ( options: {
		element: Element;
		handler: () => void;
		offset: string;
	} ) => unknown;
	_unescape?: ( value: string ) => string;
};
