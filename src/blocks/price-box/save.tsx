import {
	getColorClassName,
	InnerBlocks,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import clsx from 'clsx';

import { baseClass } from './constants';
import type { PriceBoxAttributes } from './types';

export default function Save( {
	attributes,
}: BlockSaveProps< PriceBoxAttributes > ) {
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
	} = attributes;
	const textClass = getColorClassName( 'color', textColor );
	const backgroundClass = getColorClassName(
		'background-color',
		backgroundColor
	);
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
			color:
				typeof textColor !== 'undefined' ? undefined : customTextColor,
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
					/>
				) }
				{ amount && (
					<RichText.Content
						tagName="p"
						className={ `${ baseClass }__amount` }
						value={ amount }
					/>
				) }
				{ period && (
					<RichText.Content
						tagName="p"
						className={ `${ baseClass }__period` }
						value={ period }
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
				/>
			) }
			{ displayPrice }
			{ features && (
				<RichText.Content
					tagName="ul"
					className={ `${ baseClass }__features` }
					value={ features }
				/>
			) }
			<InnerBlocks.Content />
		</div>
	);
}
