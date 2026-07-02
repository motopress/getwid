import { InnerBlocks, RichText } from '@wordpress/block-editor';
import type { BlockDeprecation } from '@wordpress/blocks';

import type { TabsItemAttributes } from './types';

function DeprecatedSave( {
	attributes: { outerParent, title },
}: {
	attributes: TabsItemAttributes;
} ) {
	const Tag = outerParent?.attributes?.headerTag ?? 'span';

	return (
		<>
			<li className="wp-block-getwid-tabs__nav-link">
				{ title && (
					<Tag className="wp-block-getwid-tabs__title-wrapper">
						{  }
						<a href="#">
							<RichText.Content
								tagName="span"
								className="wp-block-getwid-tabs__title"
								value={ title }
							/>
						</a>
					</Tag>
				) }
			</li>
			<div className="wp-block-getwid-tabs__tab-content">
				<InnerBlocks.Content />
			</div>
		</>
	);
}

export const deprecated: BlockDeprecation< TabsItemAttributes >[] = [
	{
		attributes: {
			outerParent: { type: 'object' },
			title: {
				type: 'string',
				source: 'html',
				selector: '.wp-block-getwid-tabs__title',
			},
		},
		save: DeprecatedSave,
	},
];
