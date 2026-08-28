import clsx from 'clsx';

import metadata from './block.json';
import type { ImageHotspotAttributes } from './types';
import { baseClass, parseImagePoints } from './utils';
import { renderPoint } from './save';

type DeprecatedSaveProps = {
	attributes: ImageHotspotAttributes;
	className?: string;
};

function escapeAttribute( value: string ) {
	return value
		.replace( /&/g, '&amp;' )
		.replace( /"/g, '&quot;' )
		.replace( /'/g, '&#039;' )
		.replace( /</g, '&lt;' )
		.replace( />/g, '&gt;' );
}

function DeprecatedSave( { attributes, className }: DeprecatedSaveProps ) {
	const {
		id,
		url,
		alt,
		hoverAnimation,
		imagePoints,
		tooltipTrigger,
		tooltipTheme,
		tooltipArrow,
		tooltipAnimation,
		dotAppearanceAnimation,
	} = attributes;
	const points = parseImagePoints( imagePoints );
	const wrapperProps = {
		className: clsx( className, {
			'getwid-animation': !! hoverAnimation,
			'has-animated-dots': dotAppearanceAnimation !== 'none',
		} ),
		'data-animation': hoverAnimation || undefined,
		'data-appearance-animation': dotAppearanceAnimation || undefined,
		'data-image-points': escapeAttribute( imagePoints ),
		'data-trigger': tooltipTrigger,
		'data-theme': tooltipTheme,
		'data-tooltip-animation': tooltipAnimation,
		'data-arrow': tooltipArrow,
	};

	return (
		<div { ...wrapperProps }>
			<div className={ `${ baseClass }__wrapper` }>
				{ url && (
					<img
						src={ url }
						alt={ typeof alt !== 'undefined' ? alt : undefined }
						className={ `${ baseClass }__image wp-image-${ id }` }
					/>
				) }
				{ points.map( ( point, index ) =>
					renderPoint( point, index, attributes )
				) }
			</div>
		</div>
	);
}

export default [
	{
		attributes: ( metadata as { attributes: Record< string, unknown > } )
			.attributes,
		save: DeprecatedSave,
	},
];
