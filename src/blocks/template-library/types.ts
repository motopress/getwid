import type { BlockEditProps } from '@wordpress/blocks';

export type TemplateLibraryAttributes = Record< string, never >;

export type TemplateLibraryEditProps =
	BlockEditProps< TemplateLibraryAttributes >;

export type TemplateType = 'sections';

export type RemoteTemplate = {
	title: string;
	description: string;
	image: string;
	get_content_url: string;
	keywords: string[];
};

export type TemplateCategories = Partial<
	Record< TemplateType, Record< string, string > >
>;

export type TemplateGroups = Partial<
	Record< TemplateType, Record< string, RemoteTemplate[] > >
>;

export type RemoteTemplateData = {
	categories: TemplateCategories;
	templates: TemplateGroups;
	info?: unknown;
};

export type RemoteTemplateResponse = {
	code?: number;
	data?: RemoteTemplateData;
};
