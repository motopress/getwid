import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import {
	convertHorizontalAlignToStyle,
	convertVerticalAlignToStyle,
} from '../media-text-slider/utils';
import type { MediaTextSliderSlideAttributes } from './types';

const baseClass = 'wp-block-getwid-media-text-slider-slide';

type SaveProps = {
	attributes: MediaTextSliderSlideAttributes;
};

export default function Save( { attributes }: SaveProps ) {
	const { slideId, outerParent } = attributes;
	const parentAttributes = outerParent?.attributes;
	const contentStyle = parentAttributes
		? {
				paddingTop: parentAttributes.paddingTop,
				paddingBottom: parentAttributes.paddingBottom,
				paddingLeft: parentAttributes.paddingLeft,
				paddingRight: parentAttributes.paddingRight,
				minHeight: parentAttributes.minHeight,
				justifyContent: convertHorizontalAlignToStyle(
					parentAttributes.horizontalAlign
				),
				alignItems: convertVerticalAlignToStyle(
					parentAttributes.verticalAlign
				),
		  }
		: {};
	const contentWrapperStyle = parentAttributes
		? { minHeight: parentAttributes.minHeight }
		: {};
	const blockProps = useBlockProps.save( {
		style: contentWrapperStyle,
		className: `${ baseClass }__content-wrapper slide-${ slideId }`,
	} );

	return (
		<div { ...blockProps }>
			<div style={ contentStyle } className={ `${ baseClass }__content` }>
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
