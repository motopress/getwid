import { Spinner } from '@wordpress/components';

import type { StackImage } from './types';
import { baseClass, getImageHref } from './utils';

type MediaContainerProps = {
	image: StackImage;
	linkTo: string;
};

export default function MediaContainer( {
	image,
	linkTo,
}: MediaContainerProps ) {
	const href = getImageHref( image, linkTo );
	const img = (
		<>
			<img
				className={ `${ baseClass }__media` }
				src={ image.url }
				alt={ image.alt }
				data-id={ image.id }
				data-link={ image.link }
				tabIndex={ 0 }
			/>
			{ image.url?.startsWith( 'blob:' ) && <Spinner /> }
		</>
	);

	return href ? <a href={ href }>{ img }</a> : img;
}
