import { isBlobURL } from '@wordpress/blob';
import { Spinner } from '@wordpress/components';
import clsx from 'clsx';

import type { SliderImage } from './types';
import { baseClass } from './utils';

type MediaContainerProps = {
	image: SliderImage;
};

export default function MediaContainer( { image }: MediaContainerProps ) {
	return (
		<>
			<figure>
				<img
					className={ `${ baseClass }__image` }
					src={ image.url }
					alt={ image.alt }
					data-custom-link={
						image.custom_link ? image.custom_link : undefined
					}
					data-link-target={
						image.custom_link_target
							? image.custom_link_target
							: undefined
					}
					data-link-rel={
						image.custom_link_rel
							? image.custom_link_rel
							: undefined
					}
					data-original-link={
						image.original_url ? image.original_url : undefined
					}
					data-id={ image.id }
					tabIndex={ 0 }
				/>
				{ image.caption && (
					<figcaption
						className={ clsx( `${ baseClass }_item-caption` ) }
					>
						{ image.caption }
					</figcaption>
				) }
			</figure>
			{ image.url && isBlobURL( image.url ) && <Spinner /> }
		</>
	);
}
