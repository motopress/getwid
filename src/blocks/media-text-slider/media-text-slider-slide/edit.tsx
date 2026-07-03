import { InnerBlocks, useBlockProps } from '@wordpress/block-editor';

import {
	convertHorizontalAlignToStyle,
	convertVerticalAlignToStyle,
} from '../media-text-slider/utils';
import type { MediaTextSliderSlideEditProps } from './types';

const allowedBlocks = [ 'getwid/media-text-slider-slide-content' ];
const template = [ [ 'getwid/media-text-slider-slide-content' ] ];
const baseClass = 'wp-block-getwid-media-text-slider-slide';

export default function Edit( { attributes }: MediaTextSliderSlideEditProps ) {
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
	const contentInnerWrapperStyle = {
		maxWidth: parentAttributes?.contentMaxWidth ?? undefined,
		width: '100%',
	};
	const blockProps = useBlockProps();

	return (
		<div { ...blockProps }>
			<div
				className={ `${ baseClass }__content-wrapper slide-${ slideId }` }
			>
				<div
					style={ contentStyle }
					className={ `${ baseClass }__content` }
				>
					<div style={ contentInnerWrapperStyle }>
						<InnerBlocks
							templateLock="all"
							template={ template }
							templateInsertUpdatesSelection={ false }
							allowedBlocks={ allowedBlocks }
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
