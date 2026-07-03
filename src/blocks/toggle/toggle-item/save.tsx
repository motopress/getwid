import { InnerBlocks, RichText } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import clsx from 'clsx';

import type { ToggleItemAttributes } from './types';

export default function Save( {
	attributes: { outerParent, title, active },
}: BlockSaveProps< ToggleItemAttributes > ) {
	const Tag = outerParent?.attributes?.headerTag ?? 'span';
	const iconOpen = outerParent?.attributes?.iconOpen ?? 'fas fa-minus';
	const iconClose = outerParent?.attributes?.iconClose ?? 'fas fa-plus';

	return (
		<div
			className={ clsx( 'wp-block-getwid-toggle__row', {
				'is-active': active,
			} ) }
		>
			<div className="wp-block-getwid-toggle__header-wrapper">
				{ title && (
					<Tag className="wp-block-getwid-toggle__header">
						<a href="#">
							<RichText.Content
								tagName="span"
								className="wp-block-getwid-toggle__header-title"
								value={ title }
							/>
							<span className="wp-block-getwid-toggle__icon is-active">
								<i className={ iconClose } />
							</span>
							<span className="wp-block-getwid-toggle__icon is-passive">
								<i className={ iconOpen } />
							</span>
						</a>
					</Tag>
				) }
			</div>

			<div className="wp-block-getwid-toggle__content-wrapper">
				<div className="wp-block-getwid-toggle__content">
					<InnerBlocks.Content />
				</div>
			</div>
		</div>
	);
}
