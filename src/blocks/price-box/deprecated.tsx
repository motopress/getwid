import {
	getColorClassName,
	InnerBlocks,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import clsx from 'clsx';

import { baseClass } from './constants';
import type { PriceBoxAttributes } from './types';

const attributes = {
	align: { type: 'string' },
	backgroundColor: { type: 'string' },
	textColor: { type: 'string' },
	customBackgroundColor: { type: 'string' },
	customTextColor: { type: 'string' },
	title: {
		type: 'string',
		source: 'html',
		selector: '.wp-block-getwid-price-box__title',
	},
	currency: {
		type: 'string',
		source: 'html',
		selector: '.wp-block-getwid-price-box__currency',
	},
	amount: {
		type: 'string',
		source: 'html',
		selector: '.wp-block-getwid-price-box__amount',
	},
	period: {
		type: 'string',
		source: 'html',
		selector: '.wp-block-getwid-price-box__period',
	},
	features: {
		type: 'string',
		source: 'html',
		selector: '.wp-block-getwid-price-box__features',
	},
	headerTag: {
		type: 'string',
		default: 'p',
	},
};

function DeprecatedSave( {
	attributes: blockAttributes,
}: {
	attributes: PriceBoxAttributes;
} ) {
	const {
		title,
		currency,
		amount,
		period,
		features,
		headerTag,
		backgroundColor,
		textColor,
		customBackgroundColor,
		customTextColor,
	} = blockAttributes;
	const textClass = getColorClassName( 'color', textColor );
	const backgroundClass = getColorClassName(
		'background-color',
		backgroundColor
	);
	const textStyle = {
		color: typeof textColor !== 'undefined' ? undefined : customTextColor,
	};
	const blockProps = useBlockProps.save( {
		className: clsx( {
			'has-background': backgroundColor || customBackgroundColor,
			[ backgroundClass ?? '' ]: backgroundClass,
			'has-text-color': textColor || customTextColor,
			[ textClass ?? '' ]: textClass,
		} ),
		style: {
			backgroundColor: backgroundColor
				? undefined
				: customBackgroundColor,
		},
	} );
	const displayPrice =
		! currency && ! amount && ! period ? null : (
			<div className={ `${ baseClass }__pricing` }>
				{ currency && (
					<RichText.Content
						tagName="p"
						className={ `${ baseClass }__currency` }
						value={ currency }
						style={ textStyle }
					/>
				) }
				{ amount && (
					<RichText.Content
						tagName="p"
						className={ `${ baseClass }__amount` }
						value={ amount }
						style={ textStyle }
					/>
				) }
				{ period && (
					<RichText.Content
						tagName="p"
						className={ `${ baseClass }__period` }
						value={ period }
						style={ textStyle }
					/>
				) }
			</div>
		);

	return (
		<div { ...blockProps }>
			{ title && (
				<RichText.Content
					tagName={ headerTag }
					className={ `${ baseClass }__title` }
					value={ title }
					style={ textStyle }
				/>
			) }
			{ displayPrice }
			{ features && (
				<RichText.Content
					tagName="ul"
					className={ `${ baseClass }__features` }
					value={ features }
					style={ textStyle }
				/>
			) }
			<InnerBlocks.Content />
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
