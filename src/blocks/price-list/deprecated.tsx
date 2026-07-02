import {
	getColorClassName,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import clsx from 'clsx';

import { baseClass } from './constants';
import type { PriceListAttributes } from './types';

const attributes = {
	align: {
		type: 'string',
	},
	textColor: {
		type: 'string',
	},
	customTextColor: {
		type: 'string',
	},
	title: {
		type: 'string',
		source: 'html',
		selector: '.wp-block-getwid-price-list__title',
	},
	amount: {
		type: 'string',
		source: 'html',
		selector: '.wp-block-getwid-price-list__amount',
	},
	currency: {
		type: 'string',
		source: 'html',
		selector: '.wp-block-getwid-price-list__currency',
	},
	description: {
		type: 'string',
		source: 'html',
		selector: '.wp-block-getwid-price-list__description',
	},
	dotted: {
		type: 'boolean',
		default: true,
	},
	id: {
		type: 'number',
	},
	url: {
		type: 'string',
		source: 'attribute',
		selector: '.wp-block-getwid-price-list__image',
		attribute: 'src',
	},
	titleTag: {
		type: 'string',
		default: 'p',
	},
	currencyPosition: {
		type: 'string',
		default: 'currency-before',
	},
};

function DeprecatedSave( {
	attributes: blockAttributes,
}: {
	attributes: PriceListAttributes;
} ) {
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
	} = blockAttributes;
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
							( id ? `wp-image-${ id }` : null )
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

const deprecated = [
	{
		attributes,
		save: DeprecatedSave,
	},
];

export default deprecated;
