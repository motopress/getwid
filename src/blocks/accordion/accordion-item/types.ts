import type { AccordionAttributes } from '../accordion/types';

export type AccordionItemAttributes = {
	outerParent?: {
		attributes?: AccordionAttributes;
	};
	title?: string;
};
