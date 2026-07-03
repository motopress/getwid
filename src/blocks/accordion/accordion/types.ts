export type AccordionAttributes = {
	active?: string;
	iconPosition: 'left' | 'right';
	iconOpen: string;
	iconClose: string;
	headerTag: 'span' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
};

export type AccordionDeprecatedAttributes = {
	align?: string;
	titles: Array< {
		content: string;
	} >;
	items: Array< {
		content: string;
	} >;
	active?: string;
	iconPosition: 'left' | 'right' | string;
	iconOpen?: string;
	iconClose?: string;
	headerTag?: 'span' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | string;
	className?: string;
};
