import type { CSSProperties } from 'react';

import type { TemplateAcfBackgroundImageAttributes } from './types';

export function prepareGradientStyle(
	attributes: TemplateAcfBackgroundImageAttributes
) {
	const {
		foregroundGradientType,
		foregroundGradientFirstColor,
		foregroundGradientFirstColorLocation,
		foregroundGradientSecondColor,
		foregroundGradientSecondColorLocation,
		foregroundGradientAngle,
	} = attributes;

	if ( ! foregroundGradientType || ! foregroundGradientFirstColor ) {
		return undefined;
	}

	const secondColor = foregroundGradientSecondColor || 'rgba(0,0,0,0)';

	if ( foregroundGradientType === 'radial' ) {
		return `radial-gradient(${ foregroundGradientFirstColor } ${ foregroundGradientFirstColorLocation }%,${ secondColor } ${ foregroundGradientSecondColorLocation }%)`;
	}

	return `linear-gradient(${ foregroundGradientAngle }deg,${ foregroundGradientFirstColor } ${ foregroundGradientFirstColorLocation }%,${ secondColor } ${ foregroundGradientSecondColorLocation }%)`;
}

export function getCustomPaddingStyle(
	attributes: TemplateAcfBackgroundImageAttributes
): CSSProperties {
	const {
		paddingTop,
		paddingBottom,
		paddingLeft,
		paddingRight,
		paddingTopValue,
		paddingBottomValue,
		paddingLeftValue,
		paddingRightValue,
	} = attributes;

	return {
		...( paddingTop === 'custom' ? { paddingTop: paddingTopValue } : {} ),
		...( paddingBottom === 'custom'
			? { paddingBottom: paddingBottomValue }
			: {} ),
		...( paddingLeft === 'custom'
			? { paddingLeft: paddingLeftValue }
			: {} ),
		...( paddingRight === 'custom'
			? { paddingRight: paddingRightValue }
			: {} ),
	};
}
