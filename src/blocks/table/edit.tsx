import {
	BlockControls,
	BlockIcon,
	RichText,
	withColors,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	Button,
	Placeholder,
	TextControl,
	ToolbarDropdownMenu,
	ToolbarGroup,
} from '@wordpress/components';
import { useEffect, useMemo, useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import clsx from 'clsx';

import Inspector from './inspector';
import TableModel from './table';
import type {
	CellStyleObject,
	IndexRange,
	RangeSelection,
	TableEditProps,
	TableRow,
	TableSectionName,
	TableSelectionCell,
} from './types';
import {
	baseClass,
	getBlockClassName,
	getBorderColor,
	getBorderWidth,
	getCellTagName,
	isEmptyTableSection,
	normalizeSection,
	parseCellStyles,
} from './utils';

import './editor.scss';
import './style.scss';

const allowedFormats = [
	'core/bold',
	'core/italic',
	'core/link',
	'core/image',
	'core/strikethrough',
	'core/text-color',
];

function Edit( props: TableEditProps ) {
	const {
		attributes,
		setAttributes,
		className,
		isSelected,
		backgroundColor,
		textColor,
	} = props;
	const [ rowCount, setRowCount ] = useState( 5 );
	const [ columnCount, setColumnCount ] = useState( 5 );
	const [ indexRange, setIndexRange ] = useState< IndexRange | null >( null );
	const [ rangeSelected, setRangeSelected ] =
		useState< RangeSelection | null >( null );
	const [ multiSelected, setMultiSelected ] = useState<
		TableSelectionCell[] | null
	>( null );
	const [ selectedCell, setSelectedCell ] =
		useState< TableSelectionCell | null >( null );
	const [ selectedSection, setSelectedSection ] =
		useState< TableSectionName | null >( null );

	const blockProps = useBlockProps( {
		className: clsx(
			className,
			baseClass,
			getBlockClassName( attributes )
		),
	} );

	const normalizedAttributes = useMemo(
		() => ( {
			...attributes,
			head: normalizeSection( attributes.head ),
			body: normalizeSection( attributes.body ),
			foot: normalizeSection( attributes.foot ),
		} ),
		[ attributes ]
	);

	function inRange(
		rowIndex: number,
		cellIndices: { minColIdx: number; maxColIdx: number }
	) {
		if ( ! indexRange ) {
			return false;
		}

		return (
			rowIndex >= indexRange.minRowIdx &&
			rowIndex <= indexRange.maxRowIdx &&
			cellIndices.minColIdx >= indexRange.minColIdx &&
			cellIndices.maxColIdx <= indexRange.maxColIdx
		);
	}

	const tableModel = useMemo( () => {
		const model = new TableModel( inRange );
		( [ 'head', 'body', 'foot' ] as TableSectionName[] ).forEach(
			( section ) => {
				if ( normalizedAttributes[ section ].length ) {
					model.calculateIndices(
						normalizedAttributes[ section ],
						section
					);
				}
			}
		);

		return model;
	}, [ normalizedAttributes, indexRange ] );

	useEffect( () => {
		if ( ! isSelected ) {
			clearSelection();
		}
	}, [ isSelected ] );

	function clearSelection() {
		setSelectedCell( null );
		setRangeSelected( null );
		setMultiSelected( null );
		setIndexRange( null );
		setSelectedSection( null );
	}

	function isRangeSelected() {
		return !! rangeSelected?.toCell;
	}

	function isMultiSelected() {
		return !! multiSelected && multiSelected.length > 1;
	}

	function calculateIndexRange(
		toCell: NonNullable< RangeSelection[ 'toCell' ] >
	) {
		if ( ! rangeSelected ) {
			return;
		}

		const { fromCell } = rangeSelected;

		setIndexRange( {
			minRowIdx: Math.min( fromCell.fromRowIdx, toCell.toRowIdx ),
			maxRowIdx: Math.max(
				fromCell.fromRowIdx + fromCell.fromRowSpan - 1,
				toCell.toRowIdx + toCell.toRowSpan - 1
			),
			minColIdx: Math.min( fromCell.fromMinColIdx, toCell.toMinColIdx ),
			maxColIdx: Math.max( fromCell.fromMaxColIdx, toCell.toMaxColIdx ),
		} );
		setRangeSelected( {
			...rangeSelected,
			toCell,
		} );
		setMultiSelected( null );
		setSelectedCell( null );
	}

	function getSelectedCell() {
		if ( ! selectedCell ) {
			return null;
		}

		const currentCell =
			normalizedAttributes[ selectedCell.section ][ selectedCell.rowIdx ]
				?.cells[ selectedCell.columnIdx ];

		if ( ! currentCell ) {
			return null;
		}

		const styles = parseCellStyles( currentCell.styles );

		return {
			...selectedCell,
			styles,
			borderColor: getBorderColor( styles ),
		};
	}

	function getCellStyle( style: string ) {
		if ( selectedCell && selectedSection ) {
			const cell =
				normalizedAttributes[ selectedSection ][ selectedCell.rowIdx ]
					?.cells[ selectedCell.columnIdx ];
			const styles = parseCellStyles( cell?.styles );

			if ( style === 'borderWidth' ) {
				return getBorderWidth( styles );
			}

			const value = styles?.[ style ];

			return typeof value === 'string' && /px/.test( value )
				? Number.parseInt( value, 10 )
				: value;
		}

		if ( ( isRangeSelected() || isMultiSelected() ) && selectedSection ) {
			const selectedCells: Array< { styles?: CellStyleObject } > = [];

			normalizedAttributes[ selectedSection ].forEach(
				( { cells }, rowIndex ) => {
					cells.forEach( ( cell, cellIndex ) => {
						const indices = tableModel.getIndices(
							selectedSection,
							rowIndex,
							cellIndex
						);

						if (
							( indices && inRange( rowIndex, indices ) ) ||
							inMulti( rowIndex, cellIndex )
						) {
							selectedCells.push( {
								styles: parseCellStyles( cell.styles ),
							} );
						}
					} );
				}
			);

			if ( ! selectedCells.length ) {
				return undefined;
			}

			const firstStyles = selectedCells[ 0 ].styles;
			const selectedValue =
				style === 'borderWidth'
					? getBorderWidth( firstStyles )
					: firstStyles?.[ style ];

			const hasCommonStyle = selectedCells.every( ( cell ) => {
				const value =
					style === 'borderWidth'
						? getBorderWidth( cell.styles )
						: cell.styles?.[ style ];

				return selectedValue === value;
			} );

			return hasCommonStyle ? selectedValue : undefined;
		}

		return undefined;
	}

	function inMulti( rowIndex: number, columnIndex: number ) {
		if ( ! multiSelected ) {
			return false;
		}

		return multiSelected.some(
			( cell ) =>
				cell.rowIdx === rowIndex && cell.columnIdx === columnIndex
		);
	}

	function updateSection(
		section: TableSectionName,
		updater: ( rows: TableRow[] ) => TableRow[]
	) {
		setAttributes( {
			[ section ]: updater( normalizeSection( attributes[ section ] ) ),
		} );
	}

	function updateCellsStyles(
		style: Record< string, string | number | undefined >
	) {
		if (
			! selectedCell &&
			! isRangeSelected() &&
			! isMultiSelected() &&
			! selectedSection
		) {
			return;
		}

		const section = selectedSection as TableSectionName;

		updateSection( section, ( rows ) =>
			rows.map( ( { cells }, rowIndex ) => ( {
				cells: cells.map( ( cell, cellIndex ) => {
					let shouldChange = false;

					if (
						selectedCell &&
						selectedCell.rowIdx === rowIndex &&
						selectedCell.columnIdx === cellIndex
					) {
						shouldChange = true;
					}

					if ( isRangeSelected() ) {
						const indices = tableModel.getIndices(
							section,
							rowIndex,
							cellIndex
						);
						shouldChange =
							!! indices && inRange( rowIndex, indices );
					}

					if ( isMultiSelected() ) {
						shouldChange = inMulti( rowIndex, cellIndex );
					}

					if ( ! shouldChange ) {
						return cell;
					}

					const styles = parseCellStyles( cell.styles ) || {};

					if ( 'borderColor' in style ) {
						const nextBorderColor = style.borderColor || '#000';

						[
							'borderTopColor',
							'borderRightColor',
							'borderBottomColor',
							'borderLeftColor',
							'borderColor',
						].forEach( ( borderStyleKey ) => {
							if ( styles[ borderStyleKey ] !== undefined ) {
								styles[ borderStyleKey ] = nextBorderColor;
							}
						} );
					} else if ( 'setBorder' in style ) {
						const borderColor = getBorderColor( styles );
						const borderTarget = style.setBorder;

						if ( styles.borderColor && borderTarget !== 'all' ) {
							delete styles.borderColor;
						}

						const borderMap = {
							top: [ 'borderTopColor', 'borderTopWidth' ],
							right: [ 'borderRightColor', 'borderRightWidth' ],
							bottom: [
								'borderBottomColor',
								'borderBottomWidth',
							],
							left: [ 'borderLeftColor', 'borderLeftWidth' ],
						} as const;

						if (
							borderTarget === 'top' ||
							borderTarget === 'right' ||
							borderTarget === 'bottom' ||
							borderTarget === 'left'
						) {
							const [ colorKey, widthKey ] =
								borderMap[ borderTarget ];
							if ( styles[ colorKey ] ) {
								delete styles[ colorKey ];
								delete styles[ widthKey ];
							} else {
								styles[ colorKey ] = borderColor;
								const width = getBorderWidth( styles );
								if ( width ) {
									styles[ widthKey ] = `${ width }px`;
								}
							}
						}

						if ( borderTarget === 'all' ) {
							const width = getBorderWidth( styles );

							[
								'borderTopColor',
								'borderRightColor',
								'borderBottomColor',
								'borderLeftColor',
								'borderTopWidth',
								'borderRightWidth',
								'borderBottomWidth',
								'borderLeftWidth',
							].forEach(
								( styleKey ) => delete styles[ styleKey ]
							);

							styles.borderColor = borderColor;
							if ( width ) {
								styles.borderWidth = `${ width }px`;
							}
						}

						if ( borderTarget === 'none' ) {
							[
								'borderStyle',
								'borderWidth',
								'borderTopWidth',
								'borderRightWidth',
								'borderBottomWidth',
								'borderLeftWidth',
								'borderColor',
								'borderTopColor',
								'borderRightColor',
								'borderBottomColor',
								'borderLeftColor',
							].forEach(
								( styleKey ) => delete styles[ styleKey ]
							);
						}
					} else if ( 'borderWidth' in style ) {
						const widthValue =
							style.borderWidth !== undefined
								? `${ style.borderWidth }px`
								: undefined;

						if ( styles.borderColor ) {
							styles.borderWidth = widthValue;
						}

						[ 'top', 'right', 'bottom', 'left' ].forEach(
							( direction ) => {
								const colorKey = `border${ direction.replace(
									/^[a-z]/,
									( char ) => char.toUpperCase()
								) }Color`;
								const widthKey = `border${ direction.replace(
									/^[a-z]/,
									( char ) => char.toUpperCase()
								) }Width`;

								if ( styles[ colorKey ] ) {
									styles[ widthKey ] = widthValue;
								}
							}
						);
					} else {
						Object.entries( style ).forEach( ( [ key, value ] ) => {
							if ( value === undefined || value === '' ) {
								delete styles[ key ];
							} else {
								styles[ key ] = value;
							}
						} );
					}

					return {
						...cell,
						styles: Object.keys( styles ).length
							? styles
							: undefined,
					};
				} ),
			} ) )
		);
	}

	function onCreateTable( event?: { preventDefault?: () => void } ) {
		event?.preventDefault?.();
		setAttributes( {
			body: Array.from( { length: rowCount }, () => ( {
				cells: Array.from( { length: columnCount }, () => ( {
					content: '',
				} ) ),
			} ) ),
		} );
	}

	function toggleSection( section: TableSectionName ) {
		if ( ! attributes[ section ].length ) {
			const firstRow = normalizeSection( attributes.body )[ 0 ];

			setAttributes( {
				[ section ]: [
					{
						cells: firstRow.cells.map( ( { colSpan } ) => ( {
							content: '',
							colSpan,
						} ) ),
					},
				],
			} );
			return;
		}

		setAttributes( { [ section ]: [] } );

		if ( selectedSection === section ) {
			clearSelection();
		}
	}

	function onUpdateTableContent(
		section: TableSectionName,
		rowIdx: number,
		columnIdx: number,
		content: string
	) {
		updateSection( section, ( rows ) =>
			rows.map( ( row, currentRowIdx ) =>
				currentRowIdx !== rowIdx
					? row
					: {
							cells: row.cells.map( ( cell, currentColumnIdx ) =>
								currentColumnIdx !== columnIdx
									? cell
									: { ...cell, content }
							),
					  }
			)
		);
	}

	function canSplit() {
		return !! (
			selectedCell &&
			( selectedCell.rowSpan || selectedCell.colSpan )
		);
	}

	function onMergeCells() {
		if ( ! indexRange || ! selectedSection ) {
			return;
		}

		updateSection( selectedSection, ( rows ) =>
			tableModel.mergeCells( rows, indexRange, selectedSection )
		);
		clearSelection();
	}

	function onSplitMergedCells() {
		if ( ! selectedCell || ! selectedSection ) {
			return;
		}

		updateSection( selectedSection, ( rows ) =>
			tableModel.splitMergedCells(
				rows,
				{
					...selectedCell,
					rowIdx: selectedCell.rowIdx,
					columnIdx: selectedCell.columnIdx,
					maxColIdx: selectedCell.maxColIdx,
				},
				selectedSection
			)
		);
		clearSelection();
	}

	function onInsertRow( position: 'before' | 'after' ) {
		if ( ! selectedCell || ! selectedSection ) {
			return;
		}

		updateSection( selectedSection, ( rows ) =>
			tableModel.insertRow( rows, selectedCell, position )
		);
		clearSelection();
	}

	function onDeleteRow() {
		if ( ! selectedCell || ! selectedSection ) {
			return;
		}

		updateSection( selectedSection, ( rows ) =>
			tableModel.deleteRow( rows, selectedCell, selectedSection )
		);
		clearSelection();
	}

	function onInsertColumn( position: 'before' | 'after' ) {
		if ( ! selectedCell ) {
			return;
		}

		( [ 'head', 'body', 'foot' ] as TableSectionName[] ).forEach(
			( section ) => {
				setAttributes( {
					[ section ]: tableModel.insertColumn(
						normalizeSection( attributes[ section ] ),
						selectedCell,
						position,
						section
					),
				} );
			}
		);

		clearSelection();
	}

	function onDeleteColumn() {
		if ( ! selectedCell ) {
			return;
		}

		const nextSections: Partial< typeof attributes > = {};

		( [ 'head', 'body', 'foot' ] as TableSectionName[] ).forEach(
			( section ) => {
				const nextSection = tableModel.deleteColumn(
					normalizeSection( attributes[ section ] ),
					selectedCell,
					section
				);

				nextSections[ section ] = isEmptyTableSection( nextSection )
					? []
					: nextSection;
			}
		);

		setAttributes( nextSections );
		clearSelection();
	}

	function getTableControls() {
		return [
			{
				icon: 'table-row-delete',
				title: __( 'Delete Row', 'getwid' ),
				isDisabled:
					! selectedCell || isRangeSelected() || isMultiSelected(),
				onClick: onDeleteRow,
			},
			{
				icon: 'table-row-before',
				title: __( 'Add Row Before', 'getwid' ),
				isDisabled:
					! selectedCell || isRangeSelected() || isMultiSelected(),
				onClick: () => onInsertRow( 'before' ),
			},
			{
				icon: 'table-row-after',
				title: __( 'Add Row After', 'getwid' ),
				isDisabled:
					! selectedCell || isRangeSelected() || isMultiSelected(),
				onClick: () => onInsertRow( 'after' ),
			},
			{
				icon: 'table-col-delete',
				title: __( 'Delete Column', 'getwid' ),
				isDisabled:
					! selectedCell || isRangeSelected() || isMultiSelected(),
				onClick: onDeleteColumn,
			},
			{
				icon: 'table-col-before',
				title: __( 'Add Column Before', 'getwid' ),
				isDisabled:
					! selectedCell || isRangeSelected() || isMultiSelected(),
				onClick: () => onInsertColumn( 'before' ),
			},
			{
				icon: 'table-col-after',
				title: __( 'Add Column After', 'getwid' ),
				isDisabled:
					! selectedCell || isRangeSelected() || isMultiSelected(),
				onClick: () => onInsertColumn( 'after' ),
			},
			{
				icon: (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 512 512"
					>
						<path d="M472 317v135c0 11-9 20-20 20H313v40h139c33.1 0 60-26.9 60-60V317h-40z" />
						<path d="M452 0H313v40h139c11 0 20 9 20 20v137h40V60c0-33.1-26.9-60-60-60z" />
						<path d="M60 472c-11 0-20-9-20-20V317H0v135c0 33.1 26.9 60 60 60h139v-40H60z" />
						<path d="M60 0C26.9 0 0 26.9 0 60v137h40V60c0-11 9-20 20-20h139V0H60z" />
						<polygon points="512,237 364.3,237 418.1,183.1 389.9,154.9 287.8,256.9 389.8,360.1 418.2,331.9 363.9,277 512,277 " />
						<polygon points="122.1,154.9 93.9,183.1 147.7,237 0,237 0,277 148.1,277 93.8,331.9 122.2,360.1 224.2,256.9 " />
					</svg>
				),
				title: __( 'Merge Cells', 'getwid' ),
				isDisabled: ! isRangeSelected() || isMultiSelected(),
				onClick: onMergeCells,
			},
			{
				icon: (
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 512 512"
					>
						<polygon points="194.05,236.016 76.428,236.016 130.243,182.201 101.982,153.94 0,255.92 101.902,358.98 130.322,330.878 76.045,275.984 194.05,275.984" />
						<polygon points="410.019,153.94 381.758,182.201 435.572,236.016 317.951,236.016 317.951,275.984 435.955,275.984 381.678,330.878 410.098,358.98 512,255.92" />
						<path d="M511.796,145.089V60.156c0-33.058-26.895-59.952-59.952-59.952H60.157c-33.058,0-59.952,26.895-59.952,59.952v84.932h39.968V60.156c0-11.019,8.965-19.984,19.984-19.984h175.859v431.655H60.157c-11.019,0-19.984-8.965-19.984-19.984v-85.931H0.205v85.931c0,33.058,26.895,59.952,59.952,59.952h391.687c33.058,0,59.952-26.895,59.952-59.952v-85.931h-39.968v85.931c0,11.019-8.965,19.984-19.984,19.984H275.985V40.172h175.859c11.019,0,19.984,8.965,19.984,19.984v84.932H511.796z" />
					</svg>
				),
				title: __( 'Split Cells', 'getwid' ),
				isDisabled:
					! canSplit() || isRangeSelected() || isMultiSelected(),
				onClick: onSplitMergedCells,
			},
		];
	}

	function renderInitTableForm() {
		return (
			<div { ...blockProps }>
				<Placeholder
					label={ __( 'Table', 'getwid' ) }
					icon={ <BlockIcon icon="editor-table" showColors /> }
					instructions={ __(
						'Hint: Hold Ctrl/Cmd key to select multiple cells. Hold Shift key to select range.',
						'getwid'
					) }
				>
					<form
						className={ `${ baseClass }__placeholder-form` }
						onSubmit={ onCreateTable }
					>
						<TextControl
							type="number"
							className={ `${ baseClass }__placeholder-input` }
							label={ __( 'Rows', 'getwid' ) }
							value={ rowCount }
							onChange={ ( value ) =>
								setRowCount( Number.parseInt( value, 10 ) || 1 )
							}
							min="1"
						/>
						<TextControl
							type="number"
							className={ `${ baseClass }__placeholder-input` }
							label={ __( 'Columns', 'getwid' ) }
							value={ columnCount }
							onChange={ ( value ) =>
								setColumnCount(
									Number.parseInt( value, 10 ) || 1
								)
							}
							min="1"
						/>
						<Button
							className={ `${ baseClass }__placeholder-button` }
							variant="primary"
							type="submit"
						>
							{ __( 'Create', 'getwid' ) }
						</Button>
					</form>
				</Placeholder>
			</div>
		);
	}

	function renderSection( section: TableSectionName ) {
		return normalizedAttributes[ section ].map( ( { cells }, rowIdx ) => (
			<tr key={ rowIdx }>
				{ cells.map( ( cell, columnIdx ) => {
					const Tag = getCellTagName( section );
					const indices = tableModel.getIndices(
						section,
						rowIdx,
						columnIdx
					);
					const cellSelection: TableSelectionCell = {
						rowIdx,
						columnIdx,
						rowSpan: cell.rowSpan,
						colSpan: cell.colSpan,
						section,
						minColIdx: indices?.minColIdx || 0,
						maxColIdx: indices?.maxColIdx || 0,
					};

					let isCellSelected =
						!! selectedCell &&
						rowIdx === selectedCell.rowIdx &&
						columnIdx === selectedCell.columnIdx &&
						section === selectedSection;

					if ( isRangeSelected() && indices ) {
						isCellSelected =
							inRange( rowIdx, indices ) &&
							section === selectedSection;
					}

					if ( isMultiSelected() ) {
						isCellSelected =
							inMulti( rowIdx, columnIdx ) &&
							section === multiSelected?.[ 0 ]?.section;
					}

					return (
						<Tag
							key={ columnIdx }
							className={
								isCellSelected ? 'selected' : undefined
							}
							colSpan={ cell.colSpan }
							rowSpan={ cell.rowSpan }
							style={ parseCellStyles( cell.styles ) }
							onClick={ ( event: React.MouseEvent ) => {
								if (
									( event.target as HTMLElement ).closest(
										'.components-popover'
									)
								) {
									return;
								}

								if ( event.shiftKey ) {
									if ( ! rangeSelected ) {
										return;
									}

									if (
										section !==
										rangeSelected.fromCell.section
									) {
										window.alert(
											__(
												'Such type of selection is not available',
												'getwid'
											)
										);
										return;
									}

									calculateIndexRange( {
										toRowIdx: rowIdx,
										toRowSpan:
											Number.parseInt(
												String( cell.rowSpan || 1 ),
												10
											) || 1,
										toMinColIdx: cellSelection.minColIdx,
										toMaxColIdx: cellSelection.maxColIdx,
										section,
									} );
									return;
								}

								if ( event.ctrlKey || event.metaKey ) {
									const currentMulti = multiSelected
										? [ ...multiSelected ]
										: [];

									if (
										currentMulti.length &&
										currentMulti[ 0 ].section !== section
									) {
										window.alert(
											__(
												'Such type of selection is not available',
												'getwid'
											)
										);
										return;
									}

									currentMulti.push( cellSelection );
									setMultiSelected( currentMulti );
									setIndexRange( null );
									setRangeSelected( null );
									setSelectedCell( null );
									setSelectedSection( section );
									return;
								}

								setSelectedCell( cellSelection );
								setSelectedSection( section );
								setRangeSelected( {
									fromCell: {
										fromRowIdx: rowIdx,
										fromRowSpan:
											Number.parseInt(
												String( cell.rowSpan || 1 ),
												10
											) || 1,
										fromMinColIdx: cellSelection.minColIdx,
										fromMaxColIdx: cellSelection.maxColIdx,
										section,
									},
								} );
								setMultiSelected( [ cellSelection ] );
							} }
						>
							<RichText
								className={ `${ baseClass }__cell` }
								value={ cell.content }
								onChange={ ( value ) =>
									onUpdateTableContent(
										section,
										rowIdx,
										columnIdx,
										value
									)
								}
								allowedFormats={
									selectedCell ? allowedFormats : []
								}
							/>
						</Tag>
					);
				} ) }
			</tr>
		) );
	}

	const isEmpty =
		isEmptyTableSection( normalizedAttributes.head ) &&
		isEmptyTableSection( normalizedAttributes.body ) &&
		isEmptyTableSection( normalizedAttributes.foot );

	if ( isEmpty ) {
		return renderInitTableForm();
	}

	return (
		<>
			<BlockControls>
				<ToolbarGroup>
					<ToolbarDropdownMenu
						hasArrowIndicator
						icon="edit"
						label={ __( 'Edit Table', 'getwid' ) }
						controls={ getTableControls() }
					/>
				</ToolbarGroup>
			</BlockControls>

			<Inspector
				{ ...props }
				getCellStyle={ getCellStyle }
				toggleSection={ toggleSection }
				updateCellsStyles={ updateCellsStyles }
				getSelectedCell={ getSelectedCell }
				isRangeSelected={ isRangeSelected }
				isMultiSelected={ isMultiSelected }
				clearSelection={ clearSelection }
				selectedSection={ selectedSection }
			/>

			<div { ...blockProps }>
				<table
					style={ {
						backgroundColor: backgroundColor.color,
						color: textColor.color,
					} }
				>
					{ !! normalizedAttributes.head.length && (
						<thead>{ renderSection( 'head' ) }</thead>
					) }
					<tbody>{ renderSection( 'body' ) }</tbody>
					{ !! normalizedAttributes.foot.length && (
						<tfoot>{ renderSection( 'foot' ) }</tfoot>
					) }
				</table>

				<RichText
					tagName="figcaption"
					placeholder={ __( 'Write caption…', 'getwid' ) }
					value={ attributes.caption }
					onChange={ ( value ) =>
						setAttributes( { caption: value } )
					}
					unstableOnFocus={ clearSelection }
					onFocus={ clearSelection }
				/>
			</div>
		</>
	);
}

export default withColors( 'backgroundColor', { textColor: 'color' } )( Edit );
