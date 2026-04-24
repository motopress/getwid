function tryParseJson( value ) {
	try {
		return JSON.parse( value );
	} catch ( error ) {
		return null;
	}
}

function normalizeLegacyStyleLiteral( value ) {
	// Reject executable syntax and obvious global references up front.
	if ( /(?:\bfunction\b|=>|\bwindow\b|\bdocument\b|\bthis\b|`|;)/.test( value ) ) {
		return null;
	}

	return value
		.replace( /([{,]\s*)([A-Za-z_$][\w$]*)(\s*:)/g, '$1"$2"$3' )
		.replace( /'([^'\\]*(?:\\.[^'\\]*)*)'/g, ( match, inner ) => {
			return `"${ inner.replace( /"/g, '\\"' ) }"`;
		} )
		.replace( /,\s*([}\]])/g, '$1' );
}

export function parseCustomMapStyle( customStyle ) {
	if ( typeof customStyle !== 'string' ) {
		return null;
	}

	const normalizedStyle = customStyle.trim();

	if ( normalizedStyle === '' ) {
		return null;
	}

	const parsedStyle = tryParseJson( normalizedStyle );

	if ( Array.isArray( parsedStyle ) ) {
		return parsedStyle;
	}

	const normalizedLegacyStyle = normalizeLegacyStyleLiteral( normalizedStyle );

	if ( ! normalizedLegacyStyle ) {
		return null;
	}

	const parsedLegacyStyle = tryParseJson( normalizedLegacyStyle );

	return Array.isArray( parsedLegacyStyle ) ? parsedLegacyStyle : null;
}
