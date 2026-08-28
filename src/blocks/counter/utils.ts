import type { CountUpOptions, CounterAttributes } from './types';

export function parseBooleanString( value: string | undefined ) {
	return value === 'true';
}

export function sanitizeInlineAttribute( value: string | undefined ) {
	const nextValue = value ?? '';
	const decodeEntities = window.wp?.htmlEntities?.decodeEntities;
	const safeHTML = window.wp?.dom?.safeHTML;
	const decodedValue = decodeEntities
		? decodeEntities( nextValue )
		: nextValue;

	return safeHTML ? safeHTML( decodedValue ) : decodedValue;
}

export function getEasingFunction( attributes: CounterAttributes ) {
	if ( ! parseBooleanString( attributes.useEasing ) ) {
		return null;
	}

	if ( attributes.easing === 'outQuintic' ) {
		return ( t: number, b: number, c: number, d: number ) => {
			return c * ( ( t = t / d - 1 ) * t * t * t * t + 1 ) + b;
		};
	}

	if ( attributes.easing === 'outCubic' ) {
		return ( t: number, b: number, c: number, d: number ) => {
			return c * ( ( t = t / d - 1 ) * t * t + 1 ) + b;
		};
	}

	return ( t: number, b: number, c: number, d: number ) => {
		return (
			( c * ( -Math.pow( 2, ( -10 * t ) / d ) + 1 ) * 1024 ) / 1023 + b
		);
	};
}

export function getNumerals( numerals: string | undefined ) {
	if ( numerals === 'eastern_arabic' ) {
		return [ '٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩' ];
	}

	if ( numerals === 'farsi' ) {
		return [ '۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹' ];
	}

	return null;
}

export function getCountUpOptions(
	attributes: CounterAttributes
): CountUpOptions {
	return {
		startVal: Number.parseFloat( attributes.start ),
		decimalPlaces: Number.parseInt( attributes.decimalPlaces, 10 ),
		duration: Number.parseInt( attributes.duration, 10 ),
		useEasing: parseBooleanString( attributes.useEasing ),
		useGrouping: parseBooleanString( attributes.useGrouping ),
		separator: sanitizeInlineAttribute( attributes.separator ),
		decimal: sanitizeInlineAttribute( attributes.decimal ),
		easingFn: getEasingFunction( attributes ),
		numerals: getNumerals( attributes.numerals ),
	};
}
