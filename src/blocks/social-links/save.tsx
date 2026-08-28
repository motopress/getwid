import { getColorClassName, useBlockProps } from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import clsx from 'clsx';

import type { ColorValue, SocialLinksAttributes } from './types';
import {
	baseClass,
	getBlockClassName,
	getListClassName,
	getWrapperClassName,
	getWrapperStyle,
} from './utils';

export default function Save( {
	attributes,
}: BlockSaveProps< SocialLinksAttributes > ) {
	const {
		icons,
		iconsStyle,
		iconsSize,
		backgroundColor,
		textColor,
		customBackgroundColor,
		customTextColor,
	} = attributes;
	const backgroundColorValue: ColorValue = {
		color: backgroundColor,
		class: getColorClassName( 'background-color', backgroundColor ),
	};
	const textColorValue: ColorValue = {
		color: textColor,
		class: getColorClassName( 'color', textColor ),
	};
	const blockProps = useBlockProps.save( {
		className: clsx( getBlockClassName( attributes ) ),
		style: {
			fontSize: iconsSize,
		},
	} );

	return (
		<div { ...blockProps }>
			<ul className={ getListClassName( attributes ) }>
				{ icons.map( ( item, index ) => (
					<li key={ index } className={ `${ baseClass }__item` }>
						<a
							className={ `${ baseClass }__link` }
							href={
								item.link && item.link !== '' ? item.link : '#'
							}
							target={
								item.linkTarget === '_blank'
									? item.linkTarget
									: undefined
							}
							rel={ item.rel || undefined }
						>
							<span
								className={ getWrapperClassName(
									item,
									iconsStyle,
									backgroundColorValue,
									textColorValue,
									customBackgroundColor,
									customTextColor,
									'save'
								) }
								style={ getWrapperStyle(
									iconsStyle,
									backgroundColorValue,
									textColorValue,
									customBackgroundColor,
									customTextColor
								) }
							>
								<i className={ item.icon } />
							</span>
						</a>
					</li>
				) ) }
			</ul>
		</div>
	);
}
