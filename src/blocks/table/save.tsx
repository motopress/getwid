import {
	RichText,
	getColorClassName,
	useBlockProps,
} from '@wordpress/block-editor';
import type { BlockSaveProps } from '@wordpress/blocks';
import clsx from 'clsx';

import type { TableAttributes, TableSectionName } from './types';
import {
	baseClass,
	getBlockClassName,
	getCellTagName,
	parseCellStyles,
} from './utils';

function renderSection(
	attributes: TableAttributes,
	section: TableSectionName
) {
	return attributes[ section ].map( ( { cells }, rowIndex ) => (
		<tr key={ rowIndex }>
			{ cells.map(
				( { content, colSpan, rowSpan, styles }, cellIndex ) => (
					<RichText.Content
						tagName={ getCellTagName( section ) }
						key={ cellIndex }
						colSpan={ colSpan }
						rowSpan={ rowSpan }
						style={ parseCellStyles( styles ) }
						value={ content }
					/>
				)
			) }
		</tr>
	) );
}

export default function Save( {
	attributes,
}: BlockSaveProps< TableAttributes > ) {
	const {
		head,
		foot,
		backgroundColor,
		textColor,
		customBackgroundColor,
		customTextColor,
		caption,
	} = attributes;
	const blockProps = useBlockProps.save( {
		className: clsx( baseClass, getBlockClassName( attributes ) ),
	} );
	const textClass = getColorClassName( 'color', textColor );
	const backgroundClass = getColorClassName(
		'background-color',
		backgroundColor
	);
	const hasBackground = !! backgroundColor || !! customBackgroundColor;
	const hasTextColor = !! textColor || !! customTextColor;
	const hasCaption = ! RichText.isEmpty( caption );

	return (
		<div { ...blockProps }>
			<table
				className={
					hasBackground || hasTextColor
						? clsx( {
								'has-background': hasBackground,
								'has-text-color': hasTextColor,
								[ backgroundClass || '' ]: !! backgroundClass,
								[ textClass || '' ]: !! textClass,
						  } )
						: undefined
				}
				style={ {
					backgroundColor: ! backgroundColor
						? customBackgroundColor
						: undefined,
					color: ! textColor ? customTextColor : undefined,
				} }
			>
				{ !! head.length && (
					<thead>{ renderSection( attributes, 'head' ) }</thead>
				) }
				<tbody>{ renderSection( attributes, 'body' ) }</tbody>
				{ !! foot.length && (
					<tfoot>{ renderSection( attributes, 'foot' ) }</tfoot>
				) }
			</table>

			{ hasCaption && (
				<RichText.Content tagName="figcaption" value={ caption } />
			) }
		</div>
	);
}
