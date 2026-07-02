
const { useEffect, useState, useRef } = wp.element;

const createLink = ( fonts ) => {

	const families = fonts.reduce((acc, font) => {
		const family = font.font.replace(/ +/g, '+');
		const weights = (font.weights || []).join(',');

		return [
			...acc,
			family + (weights && `:${weights}`),
		];
	}, []).join('|');

	const link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = `https://fonts.googleapis.com/css?family=${families}`;

	return link;
};

const GoogleFontLoader = ( { blockRef, fonts } ) => {

	const [ link, setLink ] = useState( createLink( fonts ) );

	const fontsRef = useRef( fonts );

	useEffect( () => {

		const _link = blockRef.current.ownerDocument.head.appendChild( link );

		return () => {
			_link.remove();
		};
	}, [ link ] );

	useEffect( () => {
		if ( JSON.stringify( fontsRef.current ) !== JSON.stringify( fonts ) ) {
			setLink( createLink( fonts ) );
			fontsRef.current = fonts;
		}
	}, [ fonts ] );

	return null;
};

export default GoogleFontLoader;
