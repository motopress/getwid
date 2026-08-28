import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import clsx from 'clsx';

import { sliderAttributeNames, sliderDataAttributes } from './attributes';
import type { ContentSliderAttributes } from './types';

function generateDataAttributes( attributes: ContentSliderAttributes ) {
	return sliderAttributeNames.reduce< Record< string, unknown > >(
		( renderAttributes, item ) => {
			const settings = sliderDataAttributes[ item ];
			const value = attributes[ item as keyof ContentSliderAttributes ];

			if ( value !== settings.default ) {
				renderAttributes[ settings.attribute ] = value;
			}

			return renderAttributes;
		},
		{}
	);
}

export default function Save( {
	attributes,
}: BlockSaveProps< ContentSliderAttributes > ) {
	const dataAttributes = generateDataAttributes( attributes );
	const blockProps = useBlockProps.save( {
		className: clsx(
			`has-arrows-${ attributes.arrows }`,
			`has-dots-${ attributes.dots }`
		),
		...dataAttributes,
	} );

	return (
		<div { ...blockProps }>
			<div className="wp-block-getwid-content-slider__wrapper">
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
