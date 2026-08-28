import { useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';

import TableOfContentsList from './list';
import type { TableOfContentsAttributes } from './types';
import { getHeadingTree } from './utils';

import './style.scss';

export default function Save( {
	attributes,
}: BlockSaveProps< TableOfContentsAttributes > ) {
	const { headings, allowedTags, listStyle } = attributes;
	const blockProps = useBlockProps.save( {
		className: `is-style-${ listStyle }`,
	} );

	if ( headings.length < 1 ) {
		return null;
	}

	return (
		<div { ...blockProps }>
			<TableOfContentsList
				headings={ getHeadingTree( headings, allowedTags ) }
				listStyle={ listStyle }
			/>
		</div>
	);
}
