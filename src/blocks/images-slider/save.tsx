import type { BlockSaveProps } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import clsx from 'clsx';

import type { ImagesSliderAttributes, SliderImage } from './types';
import {
	baseClass,
	getContainerClassName,
	getImageHref,
	getItemProps,
	getSliderData,
} from './utils';

type ImageContentProps = {
	image: SliderImage;
};

function ImageContent( { image }: ImageContentProps ) {
	return (
		<figure>
			<img
				src={ image.url }
				alt={ image.alt }
				data-id={ image.id }
				data-link={ image.link }
				data-link-target={
					image.custom_link_target
						? image.custom_link_target
						: undefined
				}
				data-link-rel={
					image.custom_link_rel ? image.custom_link_rel : undefined
				}
				data-original-link={
					image.original_url ? image.original_url : undefined
				}
				data-custom-link={
					image.custom_link ? image.custom_link : undefined
				}
				className={ `${ baseClass }__image ${
					image.id ? `wp-image-${ image.id }` : ''
				}` }
			/>
			{ image.caption && (
				<figcaption className={ clsx( `${ baseClass }__caption` ) }>
					{ image.caption }
				</figcaption>
			) }
		</figure>
	);
}

export default function Save( {
	attributes,
}: BlockSaveProps< ImagesSliderAttributes > ) {
	const blockProps = useBlockProps.save( {
		className: getContainerClassName( attributes ),
	} );
	const itemProps = getItemProps( attributes );
	const sliderData = getSliderData( attributes );

	return (
		<div { ...blockProps }>
			<div className={ `${ baseClass }__wrapper` } { ...sliderData }>
				{ attributes.images.map( ( image ) => {
					const href = getImageHref( image, attributes.linkTo );
					const img = <ImageContent image={ image } />;

					return (
						<div key={ image.id || image.url } { ...itemProps }>
							{ href ? (
								<a
									href={ href }
									target={
										image.custom_link_target
											? image.custom_link_target
											: undefined
									}
									rel={
										image.custom_link_rel
											? image.custom_link_rel
											: undefined
									}
								>
									{ img }
								</a>
							) : (
								img
							) }
						</div>
					);
				} ) }
			</div>
		</div>
	);
}
