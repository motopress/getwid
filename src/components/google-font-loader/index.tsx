import { useRefEffect } from '@wordpress/compose';
import { useMemo } from '@wordpress/element';

type FontRequest = {
	font: string;
	weights: Array< string | undefined >;
};

type GoogleFontLoaderProps = {
	fonts: FontRequest[];
};

function createGoogleFontsUrl( fonts: FontRequest[] ) {
	const families = fonts
		.map( ( font ) => {
			const family = font.font.trim().replace( / +/g, '+' );
			const weights = font.weights.filter( Boolean ).join( ',' );

			return family + ( weights ? `:${ weights }` : '' );
		} )
		.join( '|' );

	return `https://fonts.googleapis.com/css?family=${ families }`;
}

export default function GoogleFontLoader( { fonts }: GoogleFontLoaderProps ) {
	const href = useMemo( () => {
		return createGoogleFontsUrl( fonts );
	}, [ JSON.stringify( fonts ) ] );

	const ref = useRefEffect(
		( element ) => {
			const head = element.ownerDocument?.head;

			if ( ! head || ! href ) {
				return;
			}

			const currentLink = element.ownerDocument.createElement( 'link' );
			currentLink.rel = 'stylesheet';
			currentLink.href = href;

			head.appendChild( currentLink );

			return () => {
				currentLink.remove();
			};
		},
		[ href ]
	);

	return <div ref={ ref } />;
}
