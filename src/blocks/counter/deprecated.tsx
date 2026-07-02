import {
	RichText,
	getColorClassName,
	useBlockProps,
} from '@wordpress/block-editor';
import classnames from 'classnames';

import metadata from './block.json';
import Save from './save';
import type { CounterAttributes } from './types';
import { sanitizeInlineAttribute } from './utils';

const baseClass = 'wp-block-getwid-counter';

type SaveProps = {
	attributes: CounterAttributes;
};

function DeprecatedSave( { attributes }: SaveProps ) {
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
	} = attributes;
	const textColorClass = getColorClassName( 'color', textColor );
	const blockProps = useBlockProps.save();
	const wrapperProps = {
		className: `${ baseClass }__wrapper`,
		'data-start': start,
		'data-end': end,
		'data-decimal-places': decimalPlaces,
		'data-duration': duration,
		'data-use-easing': useEasing,
		'data-use-grouping': useGrouping,
		'data-separator': separator,
		'data-decimal': decimal,
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

const deprecated = [
	{
		attributes: metadata.attributes,
		save: Save,
		migrate: ( attributes: CounterAttributes ) => ( {
			...attributes,
			separator: sanitizeInlineAttribute( attributes.separator ),
			decimal: sanitizeInlineAttribute( attributes.decimal ),
		} ),
	},
	{
		attributes: metadata.attributes,
		save: DeprecatedSave,
	},
];

export default deprecated;
