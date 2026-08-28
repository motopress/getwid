import type { BlockConfiguration } from '@wordpress/blocks';
import clsx from 'clsx';

import { attributes } from './attributes';
import type { MapAttributes } from './types';
import { parseMapMarkers } from './utils';

function escapeAttribute( value: string ) {
	return value
		.replace( /&/g, '&amp;' )
		.replace( /"/g, '&quot;' )
		.replace( /'/g, '&#39;' )
		.replace( /</g, '&lt;' )
		.replace( />/g, '&gt;' );
}

function DeprecatedSave( {
	attributes: blockAttributes,
}: {
	attributes: MapAttributes;
} ) {
	const markers = parseMapMarkers( blockAttributes.mapMarkers );
	const wrapperClass = clsx(
		'wp-block-getwid-map',
		blockAttributes.className,
		blockAttributes.blockAlignment
			? `align${ blockAttributes.blockAlignment }`
			: null
	);

	return (
		<div
			data-map-zoom={ blockAttributes.mapZoom }
			data-interaction={ blockAttributes.interaction }
			data-map-style={ blockAttributes.mapStyle }
			data-custom-style={ blockAttributes.customStyle }
			data-map-center={ JSON.stringify( blockAttributes.mapCenter ) }
			data-zoom-control={ blockAttributes.zoomControl }
			data-type-control={ blockAttributes.mapTypeControl }
			data-street-view-control={ blockAttributes.streetViewControl }
			data-full-screen-control={ blockAttributes.fullscreenControl }
			data-map-markers={ escapeAttribute( blockAttributes.mapMarkers ) }
			className={ wrapperClass }
		>
			<div
				style={ { height: `${ blockAttributes.mapHeight }px` } }
				className="wp-block-getwid-map__container"
			/>
			{ markers.length !== 0 && (
				<ul className="wp-block-getwid-map__points">
					{ markers.map( ( marker, index ) => (
						<li key={ index }>
							<a
								href={ `https://maps.google.com/?q=${ marker.coords.lat },${ marker.coords.lng }&ll=${ marker.coords.lat },${ marker.coords.lng }&z=${ blockAttributes.mapZoom }` }
							>
								{ marker.name }
							</a>
						</li>
					) ) }
				</ul>
			) }
		</div>
	);
}

export const deprecated: BlockConfiguration< MapAttributes >[] = [
	{
		attributes,
		save: ( props ) => <DeprecatedSave { ...props } />,
	},
];
