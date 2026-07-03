import type { BlockEditProps } from '@wordpress/blocks';

export type MediaTextSliderAttributes = {
	slideCount: number;
	imageSize: string;
	align?: string;
	contentMaxWidth?: number;
	minHeight?: string;
	verticalAlign?: string;
	horizontalAlign?: string;
	paddingTop?: string;
	paddingBottom?: string;
	paddingLeft?: string;
	paddingRight?: string;
	textColor?: string;
	overlayColor?: string;
	overlayOpacity?: number;
	contentAnimation?: string;
	contentAnimationDuration?: string;
	contentAnimationDelay?: string;
	sliderAnimationEffect?: string;
	sliderAutoplay: boolean;
	pauseOnHover: boolean;
	sliderAutoplaySpeed?: string | number;
	sliderAnimationSpeed?: string | number;
	sliderArrays: string;
	sliderArrows?: string;
	sliderDots?: string;
};

export type MediaTextSliderEditProps =
	BlockEditProps< MediaTextSliderAttributes > & {
		className?: string;
	};

export type ParentAttributesPayload = {
	attributes: Pick<
		MediaTextSliderAttributes,
		| 'contentMaxWidth'
		| 'minHeight'
		| 'verticalAlign'
		| 'horizontalAlign'
		| 'paddingTop'
		| 'paddingBottom'
		| 'paddingLeft'
		| 'paddingRight'
		| 'textColor'
		| 'overlayColor'
		| 'overlayOpacity'
		| 'imageSize'
	>;
};

export type MediaTextSliderContextValue = {
	updateContentAttributes: ( contentBlockId: string ) => void;
};
