export type AnchorAttributes = {
	anchor?: string;
	className?: string;
};

export type AnchorEditProps = {
	attributes: AnchorAttributes;
	setAttributes: ( attributes: Partial< AnchorAttributes > ) => void;
};
