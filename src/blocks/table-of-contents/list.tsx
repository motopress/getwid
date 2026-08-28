import type { TableOfContentsHeading, TableOfContentsListStyle } from './types';

type ListProps = {
	headings: TableOfContentsHeading[];
	listStyle: TableOfContentsListStyle;
	isRoot?: boolean;
};

export default function TableOfContentsList( {
	headings,
	listStyle,
	isRoot = true,
}: ListProps ) {
	const items = headings.map( ( heading ) => (
		<li key={ heading.anchor }>
			<a href={ `#${ heading.anchor }` }>{ heading.content }</a>
			{ heading.children && (
				<TableOfContentsList
					headings={ heading.children }
					listStyle={ listStyle }
					isRoot={ false }
				/>
			) }
		</li>
	) );

	if ( listStyle === 'ordered' ) {
		return (
			<ol
				className={
					isRoot
						? 'wp-block-getwid-table-of-contents__list'
						: undefined
				}
			>
				{ items }
			</ol>
		);
	}

	return (
		<ul
			className={
				isRoot ? 'wp-block-getwid-table-of-contents__list' : undefined
			}
		>
			{ items }
		</ul>
	);
}
