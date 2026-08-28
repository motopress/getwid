import { InnerBlocks, RichText, useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import clsx from 'clsx';

import type { PersonAttributes } from './types';
import { baseClass } from './utils';

import './style.scss';

export default function Save( {
	attributes,
}: BlockSaveProps< PersonAttributes > ) {
	const { imageCrop, title, subtitle, content, imgId, imgUrl, imgAlt } =
		attributes;
	const blockProps = useBlockProps.save( {
		className: clsx( {
			'is-image-cropped': imageCrop,
		} ),
	} );

	return (
		<div { ...blockProps }>
			{ imgUrl && (
				<>
					<div className={ `${ baseClass }__image` }>
						<img
							src={ imgUrl }
							alt={ imgAlt }
							className={
								imgId ? `wp-image-${ imgId }` : undefined
							}
						/>
					</div>
					<div className={ `${ baseClass }__content-wrapper` }>
						{ ! RichText.isEmpty( title ) && (
							<RichText.Content
								tagName="span"
								value={ title }
								className={ `${ baseClass }__title` }
							/>
						) }
						{ ! RichText.isEmpty( subtitle ) && (
							<RichText.Content
								tagName="span"
								value={ subtitle }
								className={ `${ baseClass }__subtitle` }
							/>
						) }
						{ ! RichText.isEmpty( content ) && (
							<RichText.Content
								tagName="p"
								value={ content }
								className={ `${ baseClass }__content` }
							/>
						) }
						<InnerBlocks.Content />
					</div>
				</>
			) }
		</div>
	);
}
