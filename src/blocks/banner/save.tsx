import {
	getColorClassName,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import clsx from 'clsx';

import { baseClass, videoBackgroundType } from './constants';
import type { BannerAttributes } from './types';
import { getWrapperClassName } from './utils';

import './style.scss';

export default function Save( {
	attributes,
}: BlockSaveProps< BannerAttributes > ) {
	const {
		id,
		url,
		type,
		title,
		text,
		link,
		minHeight,
		contentMaxWidth,
		rel,
		linkTarget,
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
		className: getWrapperClassName( attributes ),
	} );
	const imageProps = {
		className: clsx( `${ baseClass }__wrapper`, {
			'has-background': backgroundColor || customBackgroundColor,
			[ backgroundClass ?? '' ]: backgroundClass,
		} ),
		style: {
			backgroundColor: backgroundColor
				? undefined
				: customBackgroundColor,
		},
	};
	const captionProps = {
		className: clsx( `${ baseClass }__caption`, {
			'has-text-color': textColor || customTextColor,
			[ textClass ?? '' ]: textClass,
		} ),
		style: {
			color:
				typeof textColor !== 'undefined' ? undefined : customTextColor,
			minHeight,
		},
	};

	return (
		<div { ...blockProps }>
			<a
				href={ typeof link !== 'undefined' ? link : '#' }
				target={ linkTarget }
				rel={ rel }
				className={ `${ baseClass }__link` }
			>
				{ !! url && (
					<div { ...imageProps }>
						{ type === videoBackgroundType && url ? (
							<video
								className={ `${ baseClass }__video ${ baseClass }__source` }
								autoPlay
								muted
								loop
								src={ url }
							/>
						) : (
							<img
								src={ url }
								alt=""
								className={
									`${ baseClass }__image ${ baseClass }__source ` +
									( id ? `wp-image-${ id }` : '' )
								}
							/>
						) }
						<div { ...captionProps }>
							<div
								style={ { maxWidth: contentMaxWidth } }
								className={ `${ baseClass }__caption-wrapper` }
							>
								{ ! RichText.isEmpty( title ) && (
									<RichText.Content
										tagName="span"
										className={ `${ baseClass }__title` }
										value={ title }
									/>
								) }
								{ ! RichText.isEmpty( text ) && (
									<RichText.Content
										tagName="p"
										className={ `${ baseClass }__text` }
										value={ text }
									/>
								) }
							</div>
						</div>
					</div>
				) }
			</a>
		</div>
	);
}
