export type AdvancedSpacerAttributes = {
	height: string;
	isHideDesktop: boolean;
	isHideTablet: boolean;
	isHideMobile: boolean;
	className?: string;
};

export type AdvancedSpacerEditProps = {
	attributes: AdvancedSpacerAttributes;
	className?: string;
	isSelected: boolean;
	setAttributes: ( attributes: Partial< AdvancedSpacerAttributes > ) => void;
	toggleSelection: ( isSelected: boolean ) => void;
};
