import { useBlockProps } from '@wordpress/block-editor';
import clsx from 'clsx';

import type { ImageHotspotAttributes, ImageHotspotPoint } from './types';
import { baseClass, getBlockClassName, parseImagePoints } from './utils';
import { decodeEntities } from '@wordpress/html-entities';

type SaveProps = {
	attributes: ImageHotspotAttributes;
	className?: string;
};

function getPreparedPoints( imagePoints: string ) {
	return parseImagePoints( imagePoints ).map( ( point ) => ( {
		...point,
		title: decodeEntities( point.title ),
		content: decodeEntities( point.content ),
	} ) );
}

export function renderPoint(
	point: ImageHotspotPoint,
	index: number,
	attributes: ImageHotspotAttributes
) {
	const {
		dotIcon,
		dotSize,
		dotPaddings,
		dotColor,
		dotBackground,
		dotOpacity,
		dotPulse,
	} = attributes;
	const dotClass = clsx( `${ baseClass }__dot`, {
		[ `has-animation-${ dotPulse }` ]: dotPulse !== 'none',
	} );
	const dotStyle = {
		padding: dotPaddings && dotPaddings !== 6 ? dotPaddings : undefined,
		opacity:
			dotOpacity && dotOpacity !== 100 ? dotOpacity / 100 : undefined,
		left: point.position.x || undefined,
		top: point.position.y || undefined,
		backgroundColor: point.backgroundColor || dotBackground || undefined,
	};
	const innerDotStyle = {
		color: point.color || dotColor || undefined,
		fontSize: dotSize && dotSize !== 16 ? dotSize : undefined,
	};
	const linkAttributes = {
		target: point.newTab ? '_blank' : undefined,
		rel: point.newTab ? 'noopener noreferrer' : undefined,
	};
	const icon = point.icon || dotIcon || undefined;
	const linkHTML =
		point.link !== '' ? (
			<a href={ point.link } { ...linkAttributes }>
				{ point.title }
			</a>
		) : (
			point.title
		);

	return (
		<div
			data-point-id={ index }
			className={ dotClass }
			style={ dotStyle }
			key={ index }
		>
			<div className={ `${ baseClass }__dot-wrapper` }>
				<div
					style={ innerDotStyle }
					className={ `${ baseClass }__dot-content` }
				>
					<i className={ `${ icon } ${ baseClass }__dot-icon` } />
				</div>
			</div>
			<div className={ `${ baseClass }__dot-description` }>
				<div className={ `${ baseClass }__dot-title` }>
					{ linkHTML }
				</div>
			</div>
		</div>
	);
}

export default function Save( { attributes, className }: SaveProps ) {
	const {
		id,
		url,
		alt,
		hoverAnimation,
		dotAppearanceAnimation,
		tooltipTrigger,
		tooltipTheme,
		tooltipArrow,
		tooltipAnimation,
		imagePoints,
	} = attributes;
	const points = getPreparedPoints( imagePoints );
	const blockProps = useBlockProps.save( {
		className: clsx( className, getBlockClassName( attributes ) ),
		'data-animation': hoverAnimation || undefined,
		'data-appearance-animation': dotAppearanceAnimation || undefined,
		'data-image-points': JSON.stringify( points ),
		'data-trigger': tooltipTrigger,
		'data-theme': tooltipTheme,
		'data-tooltip-animation': tooltipAnimation,
		'data-arrow': tooltipArrow,
	} );

	return (
		<div { ...blockProps }>
			<div className={ `${ baseClass }__wrapper` }>
				{ url && (
					<img
						src={ url }
						alt={ typeof alt !== 'undefined' ? alt : undefined }
						className={ `${ baseClass }__image ${
							id ? `wp-image-${ id }` : ''
						}` }
					/>
				) }
				{ points.map( ( point, index ) =>
					renderPoint( point, index, attributes )
				) }
			</div>
		</div>
	);
}
