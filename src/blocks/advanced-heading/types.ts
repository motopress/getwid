export type HeadingTag = 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

export type AdvancedHeadingAttributes = {
	content?: string;
	backgroundColor?: string;
	textColor?: string;
	customBackgroundColor?: string;
	customTextColor?: string;
	titleTag: HeadingTag;
	anchor?: string;
	fontGroupID: string;
	fontFamily: string;
	fontSize?: string;
	fontSizeTablet: string;
	fontSizeMobile: string;
	fontWeight?: string;
	fontStyle?: string;
	textTransform?: string;
	lineHeight?: string;
	letterSpacing?: string;
	align?: 'wide' | 'full' | string;
	textAlignment?: 'left' | 'center' | 'right' | string;
	paddingTop?: string;
	paddingBottom?: string;
	paddingLeft?: string;
	paddingRight?: string;
	marginTop?: string;
	marginBottom?: string;
	marginLeft?: string;
	marginRight?: string;
	className?: string;
};

export type ColorValue = {
	color?: string;
	class?: string;
};

export type AdvancedHeadingEditProps = {
	attributes: AdvancedHeadingAttributes;
	className?: string;
	setAttributes: ( attributes: Partial< AdvancedHeadingAttributes > ) => void;
	backgroundColor: ColorValue;
	textColor: ColorValue;
	setBackgroundColor: ( color?: string ) => void;
	setTextColor: ( color?: string ) => void;
};

export type LockState = {
	isLockedMargins: boolean;
	isLockedPaddings: boolean;
};

export type ChangeLockState = < Key extends keyof LockState >(
	key: Key,
	value: LockState[ Key ]
) => void;
