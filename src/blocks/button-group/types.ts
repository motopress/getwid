export type ButtonGroupAttributes = {
	spacing: string;
	alignment: string;
	alignmentTablet: string;
	alignmentMobile: string;
	direction: string;
	directionTablet: string;
	directionMobile: string;
	width: string;
	widthTablet: string;
	widthMobile: string;
	className?: string;
};

export type ButtonGroupEditProps = {
	attributes: ButtonGroupAttributes;
	setAttributes: ( attributes: Partial< ButtonGroupAttributes > ) => void;
};
