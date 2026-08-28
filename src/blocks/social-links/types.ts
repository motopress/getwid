import type { BlockEditProps } from '@wordpress/blocks';

export type ColorValue = {
	color?: string;
	class?: string;
};

export type SocialLinkItem = {
	icon: string;
	title?: string;
	link?: string;
	linkTarget?: string;
	rel?: string;
};

export type SocialLinksAttributes = {
	backgroundColor?: string;
	textColor?: string;
	customBackgroundColor?: string;
	customTextColor?: string;
	align?: string;
	textAlignmentDesktop?: string;
	textAlignmentTablet?: string;
	textAlignmentMobile?: string;
	icons: SocialLinkItem[];
	iconsStyle: 'default' | 'stacked' | 'framed';
	iconsSize?: number;
	iconsSpacing: 'none' | 'default' | 'small' | 'medium' | 'large';
	className?: string;
};

export type SocialLinksEditProps = BlockEditProps< SocialLinksAttributes > & {
	className?: string;
	backgroundColor: ColorValue;
	textColor: ColorValue;
	setBackgroundColor: ( color?: string ) => void;
	setTextColor: ( color?: string ) => void;
};
