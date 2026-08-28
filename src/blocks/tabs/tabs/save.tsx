import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import clsx from 'clsx';

import type { TabsAttributes } from './types';

import './style.scss';

export default function Save( {
	attributes,
}: BlockSaveProps< TabsAttributes > ) {
	const { align, active, type } = attributes;
	const blockProps = useBlockProps.save( {
		className: clsx(
			{
				[ `has-layout-${ type }` ]: type !== '',
			},
			align ? `align${ align }` : undefined
		),
		'data-active-tab': active ?? '0',
	} );

	return (
		<div { ...blockProps }>
			<ul className="wp-block-getwid-tabs__nav-links"></ul>
			<InnerBlocks.Content />
		</div>
	);
}
