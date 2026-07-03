import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import clsx from 'clsx';
import type { AccordionAttributes } from './types';

export default function Save( {
	attributes,
}: BlockSaveProps< AccordionAttributes > ) {
	const { align, iconPosition, active } = attributes;
	const blockProps = useBlockProps.save( {
		className: clsx(
			{
				'has-icon-left': iconPosition === 'left',
			},
			align ? `align${ align }` : undefined
		),
		'data-active-element': active ?? 'none',
	} );

	return (
		<div { ...blockProps }>
			<InnerBlocks.Content />
		</div>
	);
}
