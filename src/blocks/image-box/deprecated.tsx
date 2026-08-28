import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import clsx from 'clsx';

import metadata from './block.json';
import type { ImageBoxAttributes } from './types';
import {
	baseClass,
	getBlockClassName,
	getImageContainerClassName,
} from './utils';

function DeprecatedSave( {
	attributes,
}: BlockSaveProps< ImageBoxAttributes > ) {
	const {
		id,
		url,
		alt,
		link,
		hoverAnimation,
		marginTop,
		marginBottom,
		marginLeft,
		marginRight,
		rel,
		linkTarget,
	} = attributes;
	const blockProps = useBlockProps.save( {
		className: clsx( getBlockClassName( attributes ) ),
		'data-animation': hoverAnimation || undefined,
	} );
	const imageContainerClassName = clsx(
		`${ baseClass }__image-container`,
		getImageContainerClassName( attributes )
	);
	const imageHTML = url ? (
		<img
			src={ url }
			alt={ typeof alt !== 'undefined' ? alt : undefined }
			className={ `${ baseClass }__image wp-image-${ id }` }
		/>
	) : null;
	const imageContainerStyle = {
		marginTop,
		marginBottom,
		marginLeft,
		marginRight,
	};
	const imageWrapperProps = {
		className: `${ baseClass }__image-wrapper`,
	};

	return (
		<div { ...blockProps }>
			<div
				style={ imageContainerStyle }
				className={ imageContainerClassName }
			>
				{ link ? (
					<a
						href={ link }
						target={ linkTarget }
						rel={ rel }
						{ ...imageWrapperProps }
					>
						{ imageHTML }
					</a>
				) : (
					<div { ...imageWrapperProps }>{ imageHTML }</div>
				) }
			</div>

			<div className={ `${ baseClass }__content` }>
				<InnerBlocks.Content />
			</div>
		</div>
	);
}

export default [
	{
		attributes: metadata.attributes,
		save: DeprecatedSave,
	},
];
