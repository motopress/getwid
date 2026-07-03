import { InnerBlocks, RichText } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';

import type { AccordionItemAttributes } from './types';

export default function Save( {
	attributes,
}: BlockSaveProps< AccordionItemAttributes > ) {
	const { outerParent, title } = attributes;
	const Tag =
		( outerParent?.attributes?.headerTag as
			| keyof JSX.IntrinsicElements
			| undefined ) ?? 'span';
	const iconOpen = outerParent?.attributes?.iconOpen ?? 'fas fa-minus';
	const iconClose = outerParent?.attributes?.iconClose ?? 'fas fa-plus';

	return (
		<>
			<div className="wp-block-getwid-accordion__header-wrapper">
				{ title && (
					<Tag className="wp-block-getwid-accordion__header">
						{  }
						<a href="#">
							<RichText.Content
								tagName="span"
								className="wp-block-getwid-accordion__header-title"
								value={ title }
							/>
							<span className="wp-block-getwid-accordion__icon is-active">
								<i className={ iconClose } />
							</span>
							<span className="wp-block-getwid-accordion__icon is-passive">
								<i className={ iconOpen } />
							</span>
						</a>
					</Tag>
				) }
			</div>
			<div className="wp-block-getwid-accordion__content-wrapper">
				<div className="wp-block-getwid-accordion__content">
					<InnerBlocks.Content />
				</div>
			</div>
		</>
	);
}
