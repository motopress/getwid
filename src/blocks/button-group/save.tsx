import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';

import type { ButtonGroupAttributes } from './types';
import { getWrapperClasses } from './utils';

import './style.scss';

export default function Save( {
	attributes,
}: BlockSaveProps< ButtonGroupAttributes > ) {
	const blockProps = useBlockProps.save();

	return (
		<div { ...blockProps }>
			<div className={ getWrapperClasses( attributes ) }>
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
