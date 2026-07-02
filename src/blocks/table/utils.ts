import clsx from 'clsx';

import type {
	CellStyleObject,
	TableAttributes,
	TableCell,
	TableSectionName,
} from './types';

export const baseClass = 'wp-block-getwid-table';

export function parseCellStyles(
	styles?: string | CellStyleObject
): CellStyleObject | undefined {
	if ( ! styles ) {
		return undefined;
	}

	if ( typeof styles !== 'string' ) {
		return { ...styles };
	}

	const styleObject: CellStyleObject = {};

	styles
		.split( ';' )
		.map( ( style ) => style.trim() )
		.filter( Boolean )
		.forEach( ( style ) => {
			const separatorIndex = style.indexOf( ':' );

			if ( separatorIndex === -1 ) {
				return;
			}

			const property = style.slice( 0, separatorIndex ).trim();
			const value = style.slice( separatorIndex + 1 ).trim();

			if ( ! property ) {
				return;
			}

			const camelProperty = property.replace(
				/-([a-z])/g,
				( _, character: string ) => character.toUpperCase()
			);

			styleObject[ camelProperty ] = value;
		} );

	return Object.keys( styleObject ).length ? styleObject : undefined;
}

export function normalizeCell( cell: TableCell ): TableCell {
	return {
		...cell,
		styles: parseCellStyles( cell.styles ),
	};
}

export function normalizeSection( rows: { cells: TableCell[] }[] ) {
	return rows.map( ( row ) => ( {
		cells: row.cells.map( normalizeCell ),
	} ) );
}

export function isEmptyTableSection( section: { cells: TableCell[] }[] ) {
	return section.every( ( row ) => ! row.cells.length );
}

export function getBlockClassName( attributes: TableAttributes ) {
	return clsx( {
		[ `has-table-layout-${ attributes.tableLayout }` ]:
			!! attributes.tableLayout,
		[ `has-border-collapse-${ attributes.borderCollapse }` ]:
			!! attributes.borderCollapse,
		[ `has-horizontal-align-${ attributes.horizontalAlign }` ]:
			!! attributes.horizontalAlign,
		[ `has-vertical-align-${ attributes.verticalAlign }` ]:
			!! attributes.verticalAlign,
	} );
}

export function getCellTagName( section: TableSectionName ) {
	return section === 'head' ? 'th' : 'td';
}

export function getParsedNumericValue( value?: string | number ) {
	if ( value === undefined || value === null || value === '' ) {
		return undefined;
	}

	const parsedValue =
		typeof value === 'number' ? value : Number.parseInt( value, 10 );

	return Number.isNaN( parsedValue ) ? undefined : parsedValue;
}

export function getBorderColor( styles?: CellStyleObject ) {
	if ( ! styles ) {
		return '#000';
	}

	return (
		( styles.borderColor as string | undefined ) ||
		( styles.borderTopColor as string | undefined ) ||
		( styles.borderRightColor as string | undefined ) ||
		( styles.borderBottomColor as string | undefined ) ||
		( styles.borderLeftColor as string | undefined ) ||
		'#000'
	);
}

export function getBorderWidth( styles?: CellStyleObject ) {
	const value =
		styles?.borderWidth ??
		styles?.borderTopWidth ??
		styles?.borderRightWidth ??
		styles?.borderBottomWidth ??
		styles?.borderLeftWidth;

	return getParsedNumericValue(
		typeof value === 'string' ? value.replace( 'px', '' ) : value
	);
}
