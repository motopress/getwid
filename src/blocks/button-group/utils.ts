import clsx from 'clsx';

import type { ButtonGroupAttributes } from './types';

export const baseClass = 'wp-block-getwid-button-group';

export function getWrapperClasses( attributes: ButtonGroupAttributes ) {
	const {
		spacing,
		alignment,
		alignmentTablet,
		alignmentMobile,
		direction,
		directionTablet,
		directionMobile,
		width,
		widthTablet,
		widthMobile,
	} = attributes;

	return clsx( `${ baseClass }__wrapper`, {
		[ `has-spacing-${ spacing }` ]: spacing !== '',
		[ `has-alignment-${ alignment }` ]: alignment !== 'left',
		[ `has-alignment-tablet-${ alignmentTablet }` ]: alignmentTablet !== '',
		[ `has-alignment-mobile-${ alignmentMobile }` ]: alignmentMobile !== '',
		[ `has-direction-${ direction }` ]: direction !== 'row',
		[ `has-direction-tablet-${ directionTablet }` ]: directionTablet !== '',
		[ `has-direction-mobile-${ directionMobile }` ]: directionMobile !== '',
		[ `has-width-${ width }` ]: width !== 'auto',
		[ `has-width-tablet-${ widthTablet }` ]: widthTablet !== 'auto',
		[ `has-width-mobile-${ widthMobile }` ]: widthMobile !== 'auto',
	} );
}
