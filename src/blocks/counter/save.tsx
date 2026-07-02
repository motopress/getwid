import {
	RichText,
	getColorClassName,
	useBlockProps,
} from '@wordpress/block-editor';
import classnames from 'classnames';

import type { CounterAttributes } from './types';
import { sanitizeInlineAttribute } from './utils';

const baseClass = 'wp-block-getwid-counter';

type SaveProps = {
	attributes: CounterAttributes;
};

export default function Save( { attributes }: SaveProps ) {
	const {
		customTextColor,
		decimal,
		decimalPlaces,
		duration,
		easing,
		end,
		numerals,
		prefix,
		separator,
		start,
		suffix,
		textColor,
		useEasing,
		useGrouping,
		wrapperAlign,
	} = attributes;
	const textColorClass = getColorClassName( 'color', textColor );
	const blockProps = useBlockProps.save();
	const wrapperProps = {
		className: `${ baseClass }__wrapper`,
		style: {
			textAlign: wrapperAlign || undefined,
		},
		'data-start': start,
		'data-end': end,
		'data-decimal-places': decimalPlaces,
		'data-duration': duration,
		'data-use-easing': useEasing,
		'data-use-grouping': useGrouping,
		'data-separator': sanitizeInlineAttribute( separator ),
		'data-decimal': sanitizeInlineAttribute( decimal ),
		'data-easing-fn': easing,
		'data-numerals': numerals,
	};
	const numberProps = {
		className: classnames( `${ baseClass }__number`, {
			'has-text-color': textColorClass || customTextColor,
			[ textColorClass || '' ]: textColorClass,
		} ),
		style: {
			color: textColorClass ? undefined : customTextColor,
		},
	};

	return (
		<div { ...blockProps }>
			<div { ...wrapperProps }>
				{ prefix && (
					<RichText.Content
						tagName="p"
						className={ `${ baseClass }__prefix` }
						value={ prefix }
					/>
				) }
				<span { ...numberProps }>0</span>
				{ suffix && (
					<RichText.Content
						tagName="p"
						className={ `${ baseClass }__suffix` }
						value={ suffix }
					/>
				) }
			</div>
		</div>
	);
}
