import { InnerBlocks, RichText } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';

import type { TabsItemAttributes } from './types';

export default function Save( {
	attributes: { outerParent, title },
}: BlockSaveProps< TabsItemAttributes > ) {
	const Tag = outerParent?.attributes?.headerTag ?? 'span';

	return (
		<>
			<div className="wp-block-getwid-tabs__nav-link">
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
			</div>
			<div className="wp-block-getwid-tabs__tab-content-wrapper">
				<div className="wp-block-getwid-tabs__tab-content">
					<InnerBlocks.Content />
				</div>
			</div>
		</>
	);
}
