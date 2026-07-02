import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import {
	convertHorizontalAlignToStyle,
	convertVerticalAlignToStyle,
} from '../media-text-slider/utils';
import type { MediaTextSliderSlideAttributes } from './types';

const baseClass = 'wp-block-getwid-media-text-slider-slide';

const deprecatedAttributes = {
	id: {
		type: 'number',
		default: 1,
	},
	outerParent: {
		type: 'object',
	},
	mediaId: {
		type: 'number',
	},
	url: {
		type: 'string',
	},
};

function DeprecatedSave( {
	attributes,
}: {
	attributes: MediaTextSliderSlideAttributes;
} ) {
	const { id, outerParent } = attributes;
	const parentAttributes = outerParent?.attributes;
	const contentStyle = {
		paddingTop: parentAttributes?.paddingTop,
		paddingBottom: parentAttributes?.paddingBottom,
		paddingLeft: parentAttributes?.paddingLeft,
		paddingRight: parentAttributes?.paddingRight,
		justifyContent: convertHorizontalAlignToStyle(
			parentAttributes?.horizontalAlign
		),
		alignItems: convertVerticalAlignToStyle(
			parentAttributes?.verticalAlign
		),
	};
	const contentWrapperStyle = {
		minHeight: parentAttributes?.minHeight,
	};
	const blockProps = useBlockProps.save( {
		style: contentWrapperStyle,
		className: `${ baseClass }__content-wrapper slide-${ id }`,
	} );

	return (
		<div { ...blockProps }>
			<div style={ contentStyle } className={ `${ baseClass }__content` }>
				<InnerBlocks.Content />
			</div>
		</div>
	);
}

const deprecated = [
	{
		attributes: deprecatedAttributes,
		migrate( attributes: MediaTextSliderSlideAttributes ) {
			return {
				...attributes,
				slideId: attributes.id,
			};
		},
		save: DeprecatedSave,
	},
];

export default deprecated;
