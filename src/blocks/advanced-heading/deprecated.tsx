import { getColorClassName, RichText } from '@wordpress/block-editor';
import type { BlockConfiguration } from '@wordpress/blocks';
import clsx from 'clsx';

import type { AdvancedHeadingAttributes } from './types';

const baseClass = 'wp-block-getwid-advanced-heading';

const attributes = {
	content: {
		type: 'string',
		source: 'html',
		selector: '.wp-block-getwid-advanced-heading__content',
		default: '',
	},
	backgroundColor: {
		type: 'string',
	},
	textColor: {
		type: 'string',
	},
	customBackgroundColor: {
		type: 'string',
	},
	customTextColor: {
		type: 'string',
	},
	titleTag: {
		type: 'string',
		default: 'span',
	},
	anchor: {
		type: 'string',
	},
	fontGroupID: {
		type: 'string',
		default: '',
	},
	fontFamily: {
		type: 'string',
		default: '',
	},
	fontSize: {
		type: 'string',
	},
	fontSizeTablet: {
		type: 'string',
		default: 'fs-tablet-100',
	},
	fontSizeMobile: {
		type: 'string',
		default: 'fs-mobile-100',
	},
	fontWeight: {
		type: 'string',
	},
	fontStyle: {
		type: 'string',
	},
	textTransform: {
		type: 'string',
	},
	lineHeight: {
		type: 'string',
	},
	letterSpacing: {
		type: 'string',
	},
	align: {
		type: 'string',
	},
	textAlignment: {
		type: 'string',
	},
	paddingTop: {
		type: 'string',
	},
	paddingBottom: {
		type: 'string',
	},
	paddingLeft: {
		type: 'string',
	},
	paddingRight: {
		type: 'string',
	},
	marginTop: {
		type: 'string',
	},
	marginBottom: {
		type: 'string',
	},
	marginLeft: {
		type: 'string',
	},
	marginRight: {
		type: 'string',
	},
};

function DeprecatedSave( {
	attributes: blockAttributes,
}: {
	attributes: AdvancedHeadingAttributes;
} ) {
	const {
		content,
		titleTag,
		fontFamily,
		fontSize,
		fontWeight,
		fontStyle,
		textTransform,
		lineHeight,
		letterSpacing,
		align,
		textAlignment,
		paddingTop,
		paddingBottom,
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
		anchor,
		className,
	} = blockAttributes;
	const textClass = getColorClassName( 'color', textColor );
	const backgroundClass = getColorClassName(
		'background-color',
		backgroundColor
	);
	const wrapperClass = clsx( className, {
		alignfull: align === 'full',
		alignwide: align === 'wide',
	} );
	const wrapperContentClass = clsx( `${ baseClass }__content`, {
		'has-text-color': textColor || customTextColor,
		[ textClass ?? '' ]: textClass,
		'has-background': backgroundColor || customBackgroundColor,
		[ backgroundClass ?? '' ]: backgroundClass,
	} );

	return (
		<div
			className={ wrapperClass }
			id={ anchor }
			style={ {
				marginTop,
				marginBottom,
			} }
		>
			<RichText.Content
				className={ wrapperContentClass }
				tagName={ titleTag }
				value={ content }
				style={ {
					textAlign: textAlignment,
					fontFamily: fontFamily ? `"${ fontFamily }"` : undefined,
					fontSize,
					fontWeight:
						fontWeight && fontWeight !== ''
							? fontWeight
							: undefined,
					fontStyle,
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

export const deprecated: BlockConfiguration< AdvancedHeadingAttributes >[] = [
	{
		attributes,
		save: ( props ) => <DeprecatedSave { ...props } />,
	},
];
