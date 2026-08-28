import type { BlockEditProps } from '@wordpress/blocks';

export type TemplateAcfBackgroundImageAttributes = {
	customField?: string;
	imageSize: string;
	minHeight?: string;
	contentMaxWidth?: number;
	paddingTopValue?: string;
	paddingBottomValue?: string;
	paddingLeftValue?: string;
	paddingRightValue?: string;
	paddingTop: string;
	paddingBottom: string;
	paddingLeft: string;
	paddingRight: string;
	paddingTopTablet: string;
	paddingBottomTablet: string;
	paddingLeftTablet: string;
	paddingRightTablet: string;
	paddingTopMobile: string;
	paddingBottomMobile: string;
	paddingLeftMobile: string;
	paddingRightMobile: string;
	verticalAlign: string;
	verticalAlignTablet: string;
	verticalAlignMobile: string;
	horizontalAlign: string;
	horizontalAlignTablet: string;
	horizontalAlignMobile: string;
	foregroundOpacity: number;
	foregroundColor?: string;
	foregroundFilter?: string;
	foregroundGradientType?: string;
	foregroundGradientFirstColor?: string;
	foregroundGradientFirstColorLocation: number;
	foregroundGradientSecondColor?: string;
	foregroundGradientSecondColorLocation: number;
	foregroundGradientAngle: number;
	className?: string;
};

export type TemplateAcfBackgroundImageEditProps =
	BlockEditProps< TemplateAcfBackgroundImageAttributes >;

export type ServerSideRenderProps = {
	block: string;
	attributes: TemplateAcfBackgroundImageAttributes;
};
