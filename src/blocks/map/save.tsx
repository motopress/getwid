import { useBlockProps } from '@wordpress/block-editor';
import clsx from 'clsx';

import { baseClass } from './constants';
import type { MapAttributes } from './types';
import { getMapDataAttributes, parseMapMarkers } from './utils';
import { safeHTML } from '@wordpress/dom';
import { decodeEntities } from '@wordpress/html-entities';

type SaveProps = {
	attributes: MapAttributes;
};

export default function Save( { attributes }: SaveProps ) {
	const markers = parseMapMarkers( attributes.mapMarkers ).map(
		( marker ) => ( {
			...marker,
			name: safeHTML( decodeEntities( marker.name ) ),
			description: safeHTML( decodeEntities( marker.description ) ),
		} )
	);

	const blockProps = useBlockProps.save( {
		...getMapDataAttributes( {
			...attributes,
			mapMarkers: JSON.stringify( markers ),
		} ),
		className: clsx(
			attributes.className,
			attributes.blockAlignment
				? `align${ attributes.blockAlignment }`
				: null
		),
	} );

	return (
		<div { ...blockProps }>
			<div
				style={ { height: `${ attributes.mapHeight }px` } }
				className={ `${ baseClass }__container` }
			/>
			{ markers.length !== 0 && (
				<ul className={ `${ baseClass }__points` }>
					{ markers.map( ( marker, index ) => (
						<li key={ index }>
							<a
								href={ `https://maps.google.com/?q=${ marker.coords.lat },${ marker.coords.lng }&ll=${ marker.coords.lat },${ marker.coords.lng }&z=${ attributes.mapZoom }` }
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
