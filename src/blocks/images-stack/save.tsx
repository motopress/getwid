import { useBlockProps } from '@wordpress/block-editor';
import clsx from 'clsx';

import type { ImagesStackAttributes, StackImage } from './types';
import { baseClass, chunkImages, getImageHref } from './utils';

type SaveProps = {
	attributes: ImagesStackAttributes;
	className?: string;
};

export function renderImage( image: StackImage, linkTo: string ) {
	const href = getImageHref( image, linkTo );
	const imageClasses = clsx(
		`${ baseClass }__media`,
		image.id ? `wp-image-${ image.id }` : ''
	);
	const img = (
		<img
			className={ imageClasses }
			src={ image.url }
			alt={ image.alt }
			data-id={ image.id }
			data-link={ image.link }
		/>
	);

	return (
		<div
			key={ image.id || image.url }
			className={ `${ baseClass }__media-wrapper` }
		>
			<div className={ `${ baseClass }__media-inner-wrapper` }>
				{ href ? <a href={ href }>{ img }</a> : img }
			</div>
		</div>
	);
}

export default function Save( { attributes, className }: SaveProps ) {
	const { images, linkTo, stackStyle } = attributes;
	const blockProps = useBlockProps.save( {
		className: clsx( className, {
			[ `is-layout-${ stackStyle }` ]: stackStyle !== 'default',
		} ),
	} );

	return (
		<div { ...blockProps }>
			<div className={ `${ baseClass }__wrapper` }>
				{ chunkImages( images, 3 ).map( ( imageChunk, index ) => (
					<div key={ index } className={ `${ baseClass }__chunk` }>
						{ imageChunk.map( ( image ) =>
							renderImage( image, linkTo )
						) }
					</div>
				) ) }
			</div>
		</div>
	);
}
