export type CircleProgressBarAttributes = {
	align?: string;
	wrapperAlign?: string;
	backgroundColor?: string;
	textColor?: string;
	fillAmount: string;
	value?: string;
	isAnimated: string;
	size: string;
	thickness: string;
	className?: string;
};

export type CircleProgressBarEditProps = {
	attributes: CircleProgressBarAttributes;
	className?: string;
	isSelected: boolean;
	setAttributes: (
		attributes: Partial< CircleProgressBarAttributes >
	) => void;
};
