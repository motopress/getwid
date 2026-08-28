export type QueryValues = {
	postsToShow?: number;
	offset?: number;
	pagination?: boolean;
	ignoreSticky?: boolean;
	filterById?: string;
	excludeById?: string;
	excludeCurrentPost?: boolean;
	childPagesCurrentPage?: boolean;
	parentPageId?: string;
	postType?: string;
	taxonomy?: string[];
	terms?: string[];
	relation?: string;
	order?: string;
	orderBy?: string;
	metaQuery: MetaQueryGroup[];
};

export type MetaQueryCondition = {
	key: string;
	compare: string;
	value: string[];
	type: string;
};

export type MetaQueryGroup = {
	relation: string;
	children: Array< MetaQueryGroup | MetaQueryCondition >;
};

export type PostTypeOption = {
	value: string;
	label: string;
};

export type TermGroup = {
	group_name: string;
	group_value: PostTypeOption[];
};

export type ApiFetch = < T = unknown >( options: {
	path: string;
	method?: string;
	data?: Record< string, unknown >;
} ) => Promise< T >;

export type AddQueryArgs = (
	path: string,
	args: Record< string, string | undefined >
) => string;

export function isMetaQueryGroup(
	query: MetaQueryGroup | MetaQueryCondition
): query is MetaQueryGroup {
	return 'children' in query;
}
