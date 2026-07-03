import { sprintf, __ } from '@wordpress/i18n';

import type {
	MediaTextSliderAttributes,
	ParentAttributesPayload,
} from './types';

export const baseClass = 'wp-block-getwid-media-text-slider';

export function parseSliderLabels( sliderArrays?: string ): string[] {
	if ( ! sliderArrays ) {
		return [];
	}

	try {
		const parsed = JSON.parse( sliderArrays.replace( /u0022/g, '"' ) );

		if ( ! Array.isArray( parsed ) ) {
			return [];
		}

		return parsed.map( ( item, index ) => {
			if ( typeof item === 'string' ) {
				return item;
			}

			if ( item && typeof item.text === 'string' ) {
				return item.text;
			}

			return sprintf(
				/* translators: %d is a counter 1, 2, 3. */
				__( 'Slide %d', 'getwid' ),
				index + 1
			);
		} );
	} catch ( error ) {
		return [];
	}
}

export function getParentAttributes(
	attributes: MediaTextSliderAttributes
): ParentAttributesPayload {
	const {
		contentMaxWidth,
		minHeight,
		verticalAlign,
		horizontalAlign,
		paddingTop,
		paddingBottom,
		paddingLeft,
		paddingRight,
		textColor,
		overlayColor,
		overlayOpacity,
		imageSize,
	} = attributes;

	return {
		attributes: {
			contentMaxWidth,
			minHeight,
			verticalAlign,
			horizontalAlign,
			paddingTop,
			paddingBottom,
			paddingLeft,
			paddingRight,
			textColor,
			overlayColor,
			overlayOpacity,
			imageSize,
		},
	};
}

export function convertHorizontalAlignToStyle( align?: string ) {
	if ( align === 'left' ) {
		return 'flex-start';
	}

	if ( align === 'right' ) {
		return 'flex-end';
	}

	return align || undefined;
}

export function convertVerticalAlignToStyle( align?: string ) {
	if ( align === 'top' ) {
		return 'flex-start';
	}

	if ( align === 'bottom' ) {
		return 'flex-end';
	}

	return align || undefined;
}
