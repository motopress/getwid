export function stripHtmlTags( value: string ): string {
	return value.replace( /<[^>]*>/g, '' );
}

export function filterTitles(
	titles: Array< {
		content?: string;
	} >
): string[] {
	return titles.map( ( item ) => stripHtmlTags( item.content ?? '' ) );
}
