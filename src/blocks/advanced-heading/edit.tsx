import {
	AlignmentToolbar,
	BlockControls,
	RichText,
	useBlockProps,
	withColors,
} from '@wordpress/block-editor';
import { useRef, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { GoogleFontLoader } from 'getwid-components';
import clsx from 'clsx';

import Inspector from './inspector';
import type { AdvancedHeadingEditProps, LockState } from './types';

const baseClass = 'wp-block-getwid-advanced-heading';
const allowedFormats = [
	'core/bold',
	'core/italic',
	'core/link',
	'core/image',
	'core/strikethrough',
	'core/text-color',
];

function Edit( props: AdvancedHeadingEditProps ) {
	const { attributes, backgroundColor, className, setAttributes, textColor } =
		props;
	const [ lockState, setLockState ] = useState< LockState >( {
		isLockedMargins: false,
		isLockedPaddings: false,
	} );
	const advancedHeadingRef = useRef< HTMLDivElement >( null );
	const {
		content,
		titleTag,
		fontGroupID,
		fontFamily,
		fontWeight,
		fontStyle,
		textTransform,
		lineHeight,
		letterSpacing,
		paddingLeft,
		paddingRight,
		marginTop,
		marginBottom,
		marginLeft,
		marginRight,
		customTextColor,
		fontSize,
		fontSizeTablet,
		fontSizeMobile,
		align,
		textAlignment,
		paddingTop,
		paddingBottom,
		customBackgroundColor,
	} = attributes;
	const blockProps = useBlockProps( {
		className: clsx( className, {
			alignfull: align === 'full',
			alignwide: align === 'wide',
			'has-custom-font-size': fontSize !== undefined,
			[ fontSizeTablet ]:
				fontSizeTablet && fontSizeTablet !== 'fs-tablet-100',
			[ fontSizeMobile ]:
				fontSizeMobile && fontSizeMobile !== 'fs-mobile-100',
		} ),
		style: {
			fontSize: fontSize !== undefined ? fontSize : undefined,
			marginBottom,
			marginTop,
		},
	} );
	const wrapperContentClass = clsx( `${ baseClass }__content`, {
		'has-text-color': textColor.color,
		[ textColor.class ?? '' ]: textColor.class,
		'has-background': backgroundColor.color,
		[ backgroundColor.class ?? '' ]: backgroundColor.class,
	} );
	const shouldLoadGoogleFonts =
		!! fontFamily && [ '', 'google-fonts' ].includes( fontGroupID );
	const Tag = titleTag;

	return (
		<>
			{ shouldLoadGoogleFonts && (
				<GoogleFontLoader
					blockRef={ advancedHeadingRef }
					fonts={ [
						{
							font: fontFamily,
							weights: [ fontWeight ],
						},
					] }
				/>
			) }
			<BlockControls>
				<AlignmentToolbar
					value={ textAlignment }
					onChange={ ( nextTextAlignment ) =>
						setAttributes( {
							textAlignment: nextTextAlignment,
						} )
					}
				/>
			</BlockControls>
			<Inspector
				{ ...props }
				{ ...lockState }
				changeState={ ( key, value ) =>
					setLockState( ( currentLockState ) => ( {
						...currentLockState,
						[ key ]: value,
					} ) )
				}
			/>
			<div ref={ advancedHeadingRef } { ...blockProps }>
				<RichText
					className={ wrapperContentClass }
					tagName={ Tag }
					value={ content }
					onChange={ ( nextContent ) =>
						setAttributes( { content: nextContent } )
					}
					style={ {
						textAlign: textAlignment,
						fontFamily: fontFamily ? `"${ fontFamily }"` : '',
						fontWeight:
							fontWeight && fontWeight !== ''
								? fontWeight
								: undefined,
						fontStyle:
							fontStyle !== 'normal' ? fontStyle : undefined,
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
							attributes.textColor !== undefined &&
							textColor.class === undefined
								? textColor.color
								: customTextColor || undefined,
						backgroundColor:
							backgroundColor.color || customBackgroundColor,
					} }
					placeholder={ __( 'Write heading…', 'getwid' ) }
					allowedFormats={ allowedFormats }
				/>
			</div>
		</>
	);
}

export default withColors( 'backgroundColor', { textColor: 'color' } )( Edit );
