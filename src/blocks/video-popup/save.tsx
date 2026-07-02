import {
	getColorClassName,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import clsx from 'clsx';

import type { VideoPopupAttributes } from './types';
import { baseClass, getWrapperClassName } from './utils';

import './style.scss';

export default function Save( {
	attributes,
}: BlockSaveProps< VideoPopupAttributes > ) {
	const {
		id,
		url,
		title,
		link,
		minHeight,
		buttonMaxWidth,
		buttonStyle,
		buttonAnimation,
		buttonSize,
		titleColor,
		iconColor,
		buttonColor,
		buttonColorHEX,
		overlayColor,
		customTitleColor,
		customIconColor,
		customButtonColor,
		customOverlayColor,
	} = attributes;
	const hasTitle = ! RichText.isEmpty( title );
	const titleClass = getColorClassName( 'color', titleColor );
	const iconClass = getColorClassName( 'color', iconColor );
	const buttonClass = getColorClassName( 'background-color', buttonColor );
	const overlayClass = getColorClassName( 'background-color', overlayColor );
	const blockProps = useBlockProps.save( {
		className: getWrapperClassName( attributes ),
	} );
	const containerProps = {
		className: clsx( `${ baseClass }__wrapper`, {
			'has-background': !! url && ( overlayColor || customOverlayColor ),
			[ overlayClass ?? '' ]: !! url && overlayClass,
		} ),
		style: {
			backgroundColor:
				!! url && ! overlayColor ? customOverlayColor : undefined,
			minHeight: url !== undefined ? minHeight : undefined,
		},
	};
	const buttonProps = {
		className: clsx(
			`${ baseClass }__button`,
			`is-style-${ buttonStyle }`,
			{
				'has-background':
					buttonStyle === 'fill' &&
					( buttonColor || customButtonColor ),
				[ buttonClass ?? '' ]: buttonStyle === 'fill' && buttonClass,
				[ `has-animation-${ buttonAnimation }` ]:
					buttonAnimation !== 'none',
				[ `is-size-${ buttonSize }` ]: buttonSize !== 'default',
			}
		),
		style: {
			backgroundColor:
				buttonStyle === 'fill' && buttonColor === undefined
					? customButtonColor
					: undefined,
			borderColor:
				buttonColorHEX !== undefined
					? buttonColorHEX
					: customButtonColor,
		},
	};
	const iconProps = {
		className: clsx( `${ baseClass }__icon`, {
			'has-text-color': iconColor || customIconColor,
			[ iconClass ?? '' ]: iconClass,
			'has-background': buttonColor || customButtonColor,
			[ buttonClass ?? '' ]: buttonClass,
		} ),
		style: {
			backgroundColor:
				buttonColor !== undefined ? undefined : customButtonColor,
			color: iconColor !== undefined ? undefined : customIconColor,
			borderColor:
				buttonColorHEX !== undefined
					? buttonColorHEX
					: customButtonColor,
		},
	};
	const titleProps = {
		className: clsx( `${ baseClass }__title`, {
			'has-text-color': titleColor || customTitleColor,
			[ titleClass ?? '' ]: titleClass,
		} ),
		style: {
			color: titleColor !== undefined ? undefined : customTitleColor,
		},
	};
	const linkAttributes = {
		className: `${ baseClass }__link`,
		href: typeof link !== 'undefined' ? link : '',
		style: {
			maxWidth: ! url ? buttonMaxWidth : undefined,
		},
		'aria-label': hasTitle ? title : undefined,
	};
	const imgAttributes = {
		src: url,
		alt: hasTitle ? title : '',
		className: clsx(
			`${ baseClass }__image`,
			`${ baseClass }__source`,
			id ? `wp-image-${ id }` : ''
		),
	};

	return (
		<div { ...blockProps }>
			<a { ...linkAttributes }>
				<div { ...containerProps }>
					{ !! url && <img { ...imgAttributes } /> }
					<div { ...buttonProps }>
						<div { ...iconProps }>
							<i className="fas fa-play" aria-hidden="true"></i>
						</div>
						{ ! url && hasTitle && (
							<div className={ `${ baseClass }__button-caption` }>
								<RichText.Content
									tagName="p"
									{ ...titleProps }
									value={ title }
								/>
							</div>
						) }
					</div>
				</div>
			</a>
			{ url && (
				<div className={ `${ baseClass }__caption` }>
					{ hasTitle && (
						<RichText.Content
							tagName="p"
							{ ...titleProps }
							value={ title }
						/>
					) }
				</div>
			) }
		</div>
	);
}
