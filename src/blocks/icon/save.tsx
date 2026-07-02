import { getColorClassName, useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import clsx from 'clsx';

import type { IconAttributes } from './types';
import { getIconClassName, prepareWrapperStyle } from './utils';

const baseClass = 'wp-block-getwid-icon';

export default function Save( {
	attributes,
}: BlockSaveProps< IconAttributes > ) {
	const {
		icon,
		iconStyle,
		link,
		hoverAnimation,
		rel,
		linkTarget,
		marginTop,
		marginBottom,
		marginLeft,
		marginRight,
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
		className: clsx( getIconClassName( attributes ) ),
		style: {
			marginTop,
			marginBottom,
			marginLeft,
			marginRight,
		},
	} );
	const wrapperProps = {
		className: clsx( `${ baseClass }__wrapper`, {
			'getwid-animation': !! hoverAnimation,
			'has-background':
				( backgroundColor || customBackgroundColor ) &&
				iconStyle === 'stacked',
			[ backgroundClass || '' ]:
				!! backgroundClass && iconStyle === 'stacked',
			'has-text-color': textColor || customTextColor,
			[ textClass || '' ]: textClass,
		} ),
		style: prepareWrapperStyle( { attributes }, 'save' ),
		'data-animation': hoverAnimation || undefined,
	};

	return (
		<div { ...blockProps }>
			{ link ? (
				<a
					href={ link }
					target={ linkTarget }
					rel={ rel }
					{ ...wrapperProps }
				>
					<i className={ icon } />
				</a>
			) : (
				<div { ...wrapperProps }>
					<i className={ icon } />
				</div>
			) }
		</div>
	);
}
