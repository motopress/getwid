import {
	getColorClassName,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import clsx from 'clsx';

import { baseClass } from './constants';
import type { ProgressBarAttributes } from './types';

export default function Save( {
	attributes,
}: BlockSaveProps< ProgressBarAttributes > ) {
	const {
		fillAmount,
		title,
		isAnimated,
		backgroundColor,
		customBackgroundColor,
		textColor,
		customTextColor,
	} = attributes;
	const textClass = getColorClassName( 'color', textColor );
	const backgroundClass = getColorClassName(
		'background-color',
		backgroundColor
	);
	const blockProps = useBlockProps.save();
	const contentWrapperProps = {
		className: clsx( `${ baseClass }__bar`, {
			'has-background': backgroundColor || customBackgroundColor,
			[ backgroundClass ?? '' ]: backgroundClass,
		} ),
		style: {
			backgroundColor: backgroundColor
				? undefined
				: customBackgroundColor,
		},
	};
	const wrapperContentProps = {
		className: clsx( `${ baseClass }__progress`, {
			'has-text-color': textColor || customTextColor,
			[ textClass ?? '' ]: textClass,
		} ),
		style: {
			color: textColor !== undefined ? undefined : customTextColor,
			width: '0%',
		},
	};

	return (
		<div { ...blockProps }>
			<div
				className={ `${ baseClass }__wrapper` }
				data-fill-amount={ fillAmount }
				data-is-animated={ isAnimated }
			>
				<div
					className={ clsx( `${ baseClass }__header`, {
						'has-no-title': ! title,
					} ) }
				>
					{ title && (
						<RichText.Content
							tagName="p"
							className={ `${ baseClass }__title` }
							value={ title }
						/>
					) }
					<span className={ `${ baseClass }__percent` }>
						{ `${ fillAmount }%` }
					</span>
				</div>

				<div { ...contentWrapperProps }>
					<div { ...wrapperContentProps } />
				</div>
			</div>
		</div>
	);
}
