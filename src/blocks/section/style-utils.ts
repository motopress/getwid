import type { CSSProperties } from 'react';

import type { SectionAttributes } from './types';

type Prefix = 'background' | 'foreground';

export function prepareGradientStyle(
	prefix: Prefix,
	attributes: SectionAttributes
) {
	const values = attributes as Record< string, unknown >;
	const directGradient = values[ `${ prefix }Gradient` ] as
		| string
		| undefined;

	if ( directGradient ) {
		return directGradient;
	}

	const type = values[ `${ prefix }GradientType` ] as string | undefined;
	const firstColor = values[ `${ prefix }GradientFirstColor` ] as
		| string
		| undefined;
	const secondColor = values[ `${ prefix }GradientSecondColor` ] as
		| string
		| undefined;

	if ( ! type || ! firstColor ) {
		return undefined;
	}

	const angle = ( values[ `${ prefix }GradientAngle` ] as number ) ?? 180;
	const firstLocation =
		( values[ `${ prefix }GradientFirstColorLocation` ] as number ) ?? 0;
	const secondLocation =
		( values[ `${ prefix }GradientSecondColorLocation` ] as number ) ?? 100;
	const second = secondColor || 'rgba(0,0,0,0)';

	if ( type === 'radial' ) {
		return `radial-gradient(${ firstColor } ${ firstLocation }%,${ second } ${ secondLocation }%)`;
	}

	return `linear-gradient(${ angle }deg,${ firstColor } ${ firstLocation }%,${ second } ${ secondLocation }%)`;
}

export function prepareBackgroundImageStyles(
	prefix: Prefix,
	attributes: SectionAttributes
): CSSProperties {
	const values = attributes as Record< string, unknown >;
	const image = values[ `${ prefix }Image` ] as
		| string
		| { url?: string }
		| undefined;

	if ( ! image ) {
		return {};
	}

	const imageUrl = typeof image === 'object' ? image.url : image;
	const position = values[ `${ prefix }ImagePosition` ] as string | undefined;
	const customPosition = values[ `${ prefix }CustomImagePosition` ] as
		| { x: number; y: number }
		| undefined;

	return {
		backgroundImage: imageUrl ? `url('${ imageUrl }')` : undefined,
		backgroundPosition:
			position === 'custom' && customPosition
				? `${ customPosition.x * 100 }% ${ customPosition.y * 100 }%`
				: position || undefined,
		backgroundRepeat:
			( values[ `${ prefix }ImageRepeat` ] as string ) || undefined,
		backgroundAttachment:
			( values[ `${ prefix }ImageAttachment` ] as string ) || undefined,
		backgroundSize:
			( values[ `${ prefix }ImageSize` ] as string ) || undefined,
	};
}
