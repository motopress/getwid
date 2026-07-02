import { useEffect, useRef, useState } from '@wordpress/element';

type FontRequest = {
	font: string;
	weights: Array< string | undefined >;
};

type GoogleFontLoaderProps = {
	blockRef: React.RefObject< HTMLElement >;
	fonts: FontRequest[];
};

function createLink( fonts: FontRequest[] ) {
	const families = fonts
		.map( ( font ) => {
			const family = font.font.replace( / +/g, '+' );
			const weights = font.weights.filter( Boolean ).join( ',' );

			return family + ( weights ? `:${ weights }` : '' );
		} )
		.join( '|' );

	const link = document.createElement( 'link' );
	link.rel = 'stylesheet';
	link.href = `https://fonts.googleapis.com/css?family=${ families }`;

	return link;
}

export default function GoogleFontLoader( {
	blockRef,
	fonts,
}: GoogleFontLoaderProps ) {
	const [ link, setLink ] = useState( () => createLink( fonts ) );
	const fontsRef = useRef( fonts );

	useEffect( () => {
		const head = blockRef.current?.ownerDocument.head;

		if ( ! head ) {
			return;
		}

		const currentLink = head.appendChild( link );

		return () => {
			currentLink.remove();
		};
	}, [ blockRef, link ] );

	useEffect( () => {
		if ( JSON.stringify( fontsRef.current ) !== JSON.stringify( fonts ) ) {
			setLink( createLink( fonts ) );
			fontsRef.current = fonts;
		}
	}, [ fonts ] );

	return null;
}
