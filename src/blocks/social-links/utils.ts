import { getColorClassName } from '@wordpress/block-editor';
import clsx from 'clsx';

import type {
	ColorValue,
	SocialLinkItem,
	SocialLinksAttributes,
} from './types';

export const baseClass = 'wp-block-getwid-social-links';

export function getBlockClassName( attributes: SocialLinksAttributes ) {
	return clsx( `has-${ attributes.iconsSpacing }-spacing`, {
		'has-icons-stacked': attributes.iconsStyle === 'stacked',
		'has-icons-framed': attributes.iconsStyle === 'framed',
	} );
}

export function getListClassName( attributes: SocialLinksAttributes ) {
	return clsx( `${ baseClass }__list`, {
		'getwid-justify-content-flex-start':
			attributes.textAlignmentDesktop === 'left',
		'getwid-justify-content-center':
			attributes.textAlignmentDesktop === 'center',
		'getwid-justify-content-flex-end':
			attributes.textAlignmentDesktop === 'right',
		'getwid-justify-content-tablet-flex-start':
			attributes.textAlignmentTablet === 'left',
		'getwid-justify-content-tablet-center':
			attributes.textAlignmentTablet === 'center',
		'getwid-justify-content-tablet-flex-end':
			attributes.textAlignmentTablet === 'right',
		'getwid-justify-content-mobile-flex-start':
			attributes.textAlignmentMobile === 'left',
		'getwid-justify-content-mobile-center':
			attributes.textAlignmentMobile === 'center',
		'getwid-justify-content-mobile-flex-end':
			attributes.textAlignmentMobile === 'right',
	} );
}

export function getWrapperClassName(
	item: SocialLinkItem,
	iconsStyle: SocialLinksAttributes[ 'iconsStyle' ],
	backgroundColor: ColorValue,
	textColor: ColorValue,
	customBackgroundColor?: string,
	customTextColor?: string,
	mode: 'edit' | 'save' = 'edit'
) {
	const textClass =
		mode === 'save' ? getColorClassName( 'color', textColor.color ) : null;
	const backgroundClass =
		mode === 'save'
			? getColorClassName( 'background-color', backgroundColor.color )
			: null;

	return clsx( `${ baseClass }__wrapper`, {
		'has-background':
			( backgroundColor.color || customBackgroundColor ) &&
			iconsStyle === 'stacked',
		[ backgroundColor.class || '' ]:
			mode === 'edit' &&
			!! backgroundColor.class &&
			iconsStyle === 'stacked',
		[ backgroundClass || '' ]:
			mode === 'save' && !! backgroundClass && iconsStyle === 'stacked',
		'has-text-color': textColor.color || customTextColor,
		[ textColor.class || '' ]: mode === 'edit' && !! textColor.class,
		[ textClass || '' ]: mode === 'save' && !! textClass,
	} );
}

export function getWrapperStyle(
	iconsStyle: SocialLinksAttributes[ 'iconsStyle' ],
	backgroundColor: ColorValue,
	textColor: ColorValue,
	customBackgroundColor?: string,
	customTextColor?: string
) {
	return {
		color: textColor.color || customTextColor || undefined,
		backgroundColor:
			iconsStyle === 'stacked'
				? backgroundColor.color || customBackgroundColor || undefined
				: undefined,
	};
}

export function reorderIcons(
	icons: SocialLinkItem[],
	from: number,
	to: number
) {
	if (
		from === to ||
		from < 0 ||
		to < 0 ||
		from >= icons.length ||
		to >= icons.length
	) {
		return icons;
	}

	const nextIcons = [ ...icons ];
	const [ movedIcon ] = nextIcons.splice( from, 1 );
	nextIcons.splice( to, 0, movedIcon );

	return nextIcons;
}

export function getDefaultInsertedIcon(): SocialLinkItem {
	return {
		icon: 'fab fa-wordpress',
		link: '#',
		rel: '',
	};
}
