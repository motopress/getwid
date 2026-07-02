import type { BlockEditProps } from '@wordpress/blocks';

export type ContactFormAttributes = {
	align?: string;
	backgroundColor?: string;
	textColor?: string;
	customBackgroundColor?: string;
	customTextColor?: string;
	subject?: string;
	text?: string;
	recaptchaTheme?: string;
};

export type ContactFormEditProps = BlockEditProps< ContactFormAttributes > & {
	backgroundColor: {
		color?: string;
		class?: string;
	};
	textColor: {
		color?: string;
		class?: string;
	};
	setBackgroundColor: ( color?: string ) => void;
	setTextColor: ( color?: string ) => void;
	contactFormClass: string;
};

export type FieldAttributes = {
	label: string | null;
	required: boolean;
	placeholder: string;
	id: string;
};

export type FieldEditProps = BlockEditProps< FieldAttributes >;
