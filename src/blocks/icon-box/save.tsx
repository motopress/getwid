import {
	getColorClassName,
	InnerBlocks,
	useBlockProps,
} from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import clsx from 'clsx';

import type { IconBoxAttributes } from './types';
import {
	getBlockClassName,
	getIconContainerClassName,
	prepareWrapperStyle,
} from './utils';

const baseClass = 'wp-block-getwid-icon-box';

export default function Save( {
	attributes,
}: BlockSaveProps< IconBoxAttributes > ) {
	const {
		icon,
		link,
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
		iconStyle,
	} = attributes;
	const textClass = getColorClassName( 'color', textColor );
	const backgroundClass = getColorClassName(
		'background-color',
		backgroundColor
	);
	const blockProps = useBlockProps.save( {
		className: clsx( getBlockClassName( attributes ) ),
		'data-animation': attributes.hoverAnimation || undefined,
	} );
	const iconContainerClassName = clsx(
		`${ baseClass }__icon-container`,
		getIconContainerClassName( attributes )
	);
	const iconContainerStyle = {
		marginTop,
		marginBottom,
		marginLeft,
		marginRight,
	};
	const iconWrapperProps = {
		className: clsx( `${ baseClass }__icon-wrapper`, {
			'has-background':
				( backgroundColor || customBackgroundColor ) &&
				iconStyle === 'stacked',
			[ backgroundClass || '' ]:
				!! backgroundClass && iconStyle === 'stacked',
			'has-text-color': textColor || customTextColor,
			[ textClass || '' ]: textClass,
		} ),
		style: prepareWrapperStyle( { attributes }, 'save' ),
	};

	return (
		<div { ...blockProps }>
			<div
				style={ iconContainerStyle }
				className={ iconContainerClassName }
			>
				{ link ? (
					<a
						href={ link }
						target={ linkTarget }
						rel={ rel }
						{ ...iconWrapperProps }
					>
						<i className={ icon } />
					</a>
				) : (
					<div { ...iconWrapperProps }>
						<i className={ icon } />
					</div>
				) }
			</div>
			<div className={ `${ baseClass }__content` }>
				<InnerBlocks.Content />
			</div>
		</div>
	);
}
