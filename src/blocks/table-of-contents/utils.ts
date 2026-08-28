import type { TableOfContentsHeading } from './types';

function moveChildren(
	headings: TableOfContentsHeading[],
	heading: TableOfContentsHeading
) {
	if ( headings.length === 0 || headings[ 0 ].level === heading.level ) {
		headings.push( { ...heading } );
		return;
	}

	const previousHeading = headings[ headings.length - 1 ];

	if ( previousHeading.level < heading.level ) {
		if ( ! previousHeading.children ) {
			previousHeading.children = [ { ...heading } ];
			return;
		}

		moveChildren( previousHeading.children, heading );
	}
}

export function getHeadingTree(
	headings: TableOfContentsHeading[],
	allowedTags: boolean[]
) {
	const headingTree: TableOfContentsHeading[] = [];

	headings
		.filter( ( heading ) => allowedTags[ heading.level ] )
		.forEach( ( heading ) => moveChildren( headingTree, heading ) );

	return headingTree;
}
