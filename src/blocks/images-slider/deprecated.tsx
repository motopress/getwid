import type { BlockSaveProps } from '@wordpress/blocks';
import { useBlockProps } from '@wordpress/block-editor';
import clsx from 'clsx';

import metadata from './block.json';
import type { ImagesSliderAttributes, SliderImage } from './types';
import { baseClass, getImageHref, getItemProps, getSliderData } from './utils';

function getDeprecatedContainerClassName(
	attributes: ImagesSliderAttributes,
	version: 'legacy' | 'custom-link' | 'caption-with-figure'
) {
	const {
		showCaption,
		captionStyle,
		captionPosition,
		align,
		imageCrop,
		imageFit,
		imageAlignment,
		sliderSlidesToShow,
		sliderSpacing,
		sliderArrows,
		sliderDots,
		slideHeight,
	} = attributes;

	return clsx(
		`has-arrows-${ sliderArrows }`,
		`has-dots-${ sliderDots }`,
		{
			'has-captions':
				version === 'caption-with-figure' && showCaption === true,
			[ `captions-style-${ captionStyle }` ]:
				version === 'caption-with-figure' && showCaption === true,
			[ `captions-${ captionPosition }` ]:
				version === 'caption-with-figure' && showCaption === true,
			'is-carousel': Number( sliderSlidesToShow ) > 1,
			[ `has-slides-gap-${ sliderSpacing }` ]:
				Number( sliderSlidesToShow ) > 1,
			[ `has-images-${ imageAlignment }` ]: !! imageAlignment,
		},
		version === 'legacy'
			? imageCrop
				? 'has-cropped-images'
				: null
			: imageFit === 'fill' || imageCrop
			? 'has-cropped-images'
			: null,
		slideHeight ? 'has-fixed-height' : null,
		align ? `align${ align }` : null
	);
}

function DeprecatedImage( {
	image,
	version,
}: {
	image: SliderImage;
	version: 'legacy' | 'custom-link' | 'caption-with-figure';
} ) {
	if ( version === 'legacy' ) {
		return (
			<img
				src={ image.url }
				alt={ image.alt }
				data-id={ image.id }
				data-link={ image.link }
				className={ `${ baseClass }__image${
					image.id ? ` wp-image-${ image.id }` : null
				}` }
			/>
		);
	}

	const imageElement = (
		<img
			src={ image.url }
			alt={ image.alt }
			data-id={ image.id }
			data-link={ image.link }
			data-link-target={
				image.custom_link_target ? image.custom_link_target : undefined
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
	);

	if ( version === 'custom-link' ) {
		return imageElement;
	}

	return (
		<figure>
			{ imageElement }
			{ image.caption && (
				<figcaption className={ clsx( `${ baseClass }__caption` ) }>
					{ image.caption }
				</figcaption>
			) }
		</figure>
	);
}

function DeprecatedSave( {
	attributes,
	version,
}: BlockSaveProps< ImagesSliderAttributes > & {
	version: 'legacy' | 'custom-link' | 'caption-with-figure';
} ) {
	const blockProps = useBlockProps.save( {
		className: getDeprecatedContainerClassName( attributes, version ),
	} );
	const itemProps = getItemProps( attributes );
	const sliderData = getSliderData( attributes );

	return (
		<div { ...blockProps }>
			<div className={ `${ baseClass }__wrapper` } { ...sliderData }>
				{ attributes.images.map( ( image ) => {
					const href =
						version === 'legacy'
							? attributes.linkTo === 'media'
								? image.original_url
								: attributes.linkTo === 'attachment'
								? image.link
								: undefined
							: getImageHref( image, attributes.linkTo );
					const img = (
						<DeprecatedImage image={ image } version={ version } />
					);

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

const deprecatedParams = {
	attributes: metadata.attributes,
	isEligible: () => true,
	migrate: ( attributes: ImagesSliderAttributes ) => ( {
		...attributes,
		sliderArrows:
			attributes.sliderArrows === 'ouside'
				? 'outside'
				: attributes.sliderArrows,
		sliderDots:
			attributes.sliderDots === 'ouside'
				? 'outside'
				: attributes.sliderDots,
	} ),
};

export default [
	{
		attributes: {
			...metadata.attributes,
			imageCrop: {
				type: 'boolean',
				default: true,
			},
		},
		migrate: ( attributes: ImagesSliderAttributes ) => ( {
			...attributes,
			imageFit: ! attributes.imageCrop ? 'default' : 'fill',
		} ),
		save: ( props: BlockSaveProps< ImagesSliderAttributes > ) => (
			<DeprecatedSave { ...props } version="caption-with-figure" />
		),
	},
	{
		...deprecatedParams,
		save: ( props: BlockSaveProps< ImagesSliderAttributes > ) => (
			<DeprecatedSave { ...props } version="legacy" />
		),
	},
	{
		...deprecatedParams,
		save: ( props: BlockSaveProps< ImagesSliderAttributes > ) => (
			<DeprecatedSave { ...props } version="custom-link" />
		),
	},
];
