import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import clsx from 'clsx';

import type { ToggleAttributes } from './types';

import './style.scss';

export default function Save( {
	attributes: { align, iconPosition },
}: BlockSaveProps< ToggleAttributes > ) {
	const blockProps = useBlockProps.save( {
		className: clsx( {
			'has-icon-left': iconPosition === 'left',
			[ `align${ align }` ]: align,
		} ),
	} );

	return (
		<div { ...blockProps }>
			<InnerBlocks.Content />
		</div>
	);
}
