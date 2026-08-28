import { useBlockProps, useInnerBlocksProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

import Inspector from './inspector';
import type { TabsItemEditProps } from './types';

export default function Edit( props: TabsItemEditProps ) {
	const blockProps = useBlockProps();
	const innerBlocksProps = useInnerBlocksProps(
		{ className: 'wp-block-getwid-tabs__content' },
		{
			template: [
				[
					'core/paragraph',
					{ placeholder: __( 'Write text…', 'getwid' ) },
				],
			],
			templateInsertUpdatesSelection: false,
			templateLock: false,
		}
	);

	return (
		<>
			<Inspector { ...props } />
			<div { ...blockProps }>
				<div { ...innerBlocksProps } />
			</div>
		</>
	);
}
