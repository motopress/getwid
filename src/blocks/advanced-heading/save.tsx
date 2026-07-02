import {
	getColorClassName,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import clsx from 'clsx';

import type { AdvancedHeadingAttributes } from './types';

const baseClass = 'wp-block-getwid-advanced-heading';

export default function Save( {
	attributes,
}: BlockSaveProps< AdvancedHeadingAttributes > ) {
	const {
		paddingLeft,
		paddingRight,
		marginTop,
		marginBottom,
		marginLeft,
		marginRight,
		backgroundColor,
		textColor,
		customBackgroundColor,
		customTextColor,
		textTransform,
		lineHeight,
		letterSpacing,
		align,
		textAlignment,
		paddingTop,
		paddingBottom,
		content,
		anchor,
		titleTag,
		fontFamily,
		fontSize,
		fontSizeTablet,
		fontSizeMobile,
		fontWeight,
		fontStyle,
	} = attributes;
	const textClass = getColorClassName( 'color', textColor );
	const backgroundClass = getColorClassName(
		'background-color',
		backgroundColor
	);
	const blockProps = useBlockProps.save( {
		className: clsx( {
			alignfull: align === 'full',
			alignwide: align === 'wide',
			'has-custom-font-size': fontSize !== undefined,
			[ fontSizeTablet ]:
				fontSizeTablet && fontSizeTablet !== 'fs-tablet-100',
			[ fontSizeMobile ]:
				fontSizeMobile && fontSizeMobile !== 'fs-mobile-100',
		} ),
		id: anchor,
		style: {
			fontSize: fontSize !== undefined ? fontSize : undefined,
			marginBottom,
			marginTop,
		},
	} );
	const wrapperContentClass = clsx( `${ baseClass }__content`, {
		'has-text-color': textColor || customTextColor,
		[ textClass ?? '' ]: textClass,
		'has-background': backgroundColor || customBackgroundColor,
		[ backgroundClass ?? '' ]: backgroundClass,
	} );

	return (
		<div { ...blockProps }>
			<RichText.Content
				className={ wrapperContentClass }
				tagName={ titleTag }
				value={ content }
				style={ {
					textAlign: textAlignment,
					fontFamily: fontFamily ? `"${ fontFamily }"` : undefined,
					fontWeight:
						fontWeight && fontWeight !== ''
							? fontWeight
							: undefined,
					fontStyle: fontStyle !== 'normal' ? fontStyle : undefined,
					textTransform,
					lineHeight,
					letterSpacing,
					paddingTop,
					paddingBottom,
					paddingLeft,
					paddingRight,
					marginLeft,
					marginRight,
					color:
						typeof textColor !== 'undefined'
							? undefined
							: customTextColor,
					backgroundColor: backgroundColor
						? undefined
						: customBackgroundColor,
				} }
			/>
		</div>
	);
}
