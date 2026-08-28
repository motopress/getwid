import type { BlockEditProps } from '@wordpress/blocks';

export type FieldAttributes = {
	label: string | null;
	required: boolean;
	placeholder: string;
	id: string;
};

export type FieldEditProps = BlockEditProps< FieldAttributes >;
