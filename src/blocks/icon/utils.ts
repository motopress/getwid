import jQuery from 'jquery';

import type { ColorValue, IconAttributes } from './types';

type WrapperStyleProps = {
	attributes: IconAttributes;
	backgroundColor?: ColorValue;
	textColor?: ColorValue;
};

export function getIconClassName( attributes: IconAttributes ) {
	const { iconStyle, textAlignment } = attributes;

	return {
		'has-layout-stacked': iconStyle === 'stacked',
		'has-layout-framed': iconStyle === 'framed',
		[ `is-aligned-${ textAlignment }` ]: textAlignment !== undefined,
	};
}

export function prepareWrapperStyle(
	props: WrapperStyleProps,
	callFrom: 'edit' | 'save'
) {
	const {
		attributes: {
			iconStyle,
			iconSize,
			padding,
			borderWidth,
			borderRadius,
			textColor,
			customTextColor,
		},
	} = props;
	let textColorProcessed: string | undefined;
	let backgroundColorProcessed: string | undefined;
	let borderColorProcessed: string | undefined;

	if ( callFrom === 'edit' ) {
		if (
			typeof textColor !== 'undefined' &&
			typeof props.textColor?.class === 'undefined'
		) {
			textColorProcessed = props.textColor?.color;
		} else {
			textColorProcessed = customTextColor || undefined;
		}

		backgroundColorProcessed =
			iconStyle === 'stacked'
				? props.backgroundColor?.color ||
				  props.attributes.customBackgroundColor
				: undefined;
		borderColorProcessed =
			iconStyle === 'framed'
				? props.textColor?.color || props.attributes.customTextColor
				: undefined;
	} else if ( callFrom === 'save' ) {
		backgroundColorProcessed =
			iconStyle === 'stacked'
				? props.attributes.backgroundColor
					? undefined
					: props.attributes.customBackgroundColor
				: undefined;
		textColorProcessed =
			typeof textColor !== 'undefined' ? undefined : customTextColor;
	}

	return {
		fontSize: iconSize !== undefined ? iconSize : undefined,
		padding: padding !== undefined ? `${ padding }px` : undefined,
		color: textColorProcessed,
		backgroundColor: backgroundColorProcessed,
		borderColor: borderColorProcessed,
		borderWidth: iconStyle === 'framed' ? borderWidth : undefined,
		borderRadius:
			iconStyle === 'framed' || iconStyle === 'stacked'
				? borderRadius !== 50
					? `${ borderRadius }%`
					: undefined
				: undefined,
	};
}

export function animateElement(
	element: JQuery< HTMLElement >,
	animationSettings: {
		animation?: string;
		duration?: string;
		delay?: string;
	},
	callback?: () => void
) {
	const animationEnd = ( () => {
		const elementStyle = document.createElement( 'div' ).style;
		const animations = {
			animation: 'animationend',
			OAnimation: 'oAnimationEnd',
			MozAnimation: 'mozAnimationEnd',
			WebkitAnimation: 'webkitAnimationEnd',
		};

		for ( const key in animations ) {
			if ( key in elementStyle ) {
				return animations[ key as keyof typeof animations ];
			}
		}

		return 'animationend';
	} )();
	const animationName = animationSettings.animation || '';
	const animationDuration = animationSettings.duration || '1s';
	const animationDelay = animationSettings.delay || '0s';

	element.css( {
		'animation-duration': animationDuration,
		'animation-delay': animationDelay,
		'-webkit-animation-delay': animationDelay,
	} );

	element
		.addClass( `animated ${ animationName }` )
		.one( animationEnd, function () {
			jQuery( this ).removeClass( `animated ${ animationName }` );

			if ( typeof callback === 'function' ) {
				callback();
			}
		} );
}
