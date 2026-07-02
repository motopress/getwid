import {
	getColorClassName,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import clsx from 'clsx';

import { baseClass } from './constants';
import type { PriceListAttributes } from './types';

export default function Save( {
	attributes,
}: BlockSaveProps< PriceListAttributes > ) {
	const {
		title,
		currency,
		amount,
		description,
		currencyPosition,
		id,
		url,
		titleTag,
		textColor,
		customTextColor,
		dotted,
	} = attributes;
	const textClass = getColorClassName( 'color', textColor );
	const blockProps = useBlockProps.save( {
		className: clsx( {
			'has-text-color': textColor || customTextColor,
			[ textClass ?? '' ]: textClass,
			'has-dots': dotted,
		} ),
		style: {
			color: textClass === undefined ? customTextColor : undefined,
		},
	} );
	const wrapperPriceProps = {
		className: clsx( `${ baseClass }__price-wrapper`, {
			'has-currency-after': currencyPosition === 'currency-after',
			'has-currency-after-space':
				currencyPosition === 'currency-after-space',
			'has-currency-before-space':
				currencyPosition === 'currency-before-space',
		} ),
	};
	const hasContent = title || currency || amount || description;

	return (
		<div { ...blockProps }>
			{ url && (
				<div className={ `${ baseClass }__image-wrapper` }>
					<img
						src={ url }
						alt=""
						className={
							`${ baseClass }__image ` +
							( id ? `wp-image-${ id }` : '' )
						}
					/>
				</div>
			) }

			{ hasContent && (
				<div className={ `${ baseClass }__content-wrapper` }>
					<div className={ `${ baseClass }__header` }>
						{ title && (
							<RichText.Content
								tagName={ titleTag }
								className={ `${ baseClass }__title` }
								value={ title }
							/>
						) }

						{ title && (
							<div className={ `${ baseClass }__price-line` } />
						) }

						<div { ...wrapperPriceProps }>
							{ currency && (
								<RichText.Content
									tagName={ titleTag }
									className={ `${ baseClass }__currency` }
									value={ currency }
								/>
							) }

							{ amount && (
								<RichText.Content
									tagName={ titleTag }
									className={ `${ baseClass }__amount` }
									value={ amount }
								/>
							) }
						</div>
					</div>

					{ description && (
						<RichText.Content
							tagName="p"
							className={ `${ baseClass }__description` }
							value={ description }
						/>
					) }
				</div>
			) }
		</div>
	);
}
