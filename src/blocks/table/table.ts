import type { IndexRange, TableRow } from './types';

type CellIndex = {
	minColIdx: number;
	maxColIdx: number;
};

export default class TableModel {
	private readonly inRange: (
		rowIndex: number,
		cellIndex: CellIndex
	) => boolean;

	private indices: Record< string, CellIndex[][] > = {};

	public constructor(
		inRange: ( rowIndex: number, cellIndex: CellIndex ) => boolean
	) {
		this.inRange = inRange;
	}

	public calculateIndices( section: TableRow[], sectionName: string ) {
		const [ firstRow ] = section;

		if ( ! firstRow ) {
			this.indices[ sectionName ] = [];
			return;
		}

		const colCount = firstRow.cells.reduce( ( count, { colSpan } ) => {
			const parsedColSpan = colSpan
				? Number.parseInt( String( colSpan ), 10 )
				: 1;

			return (
				count + ( Number.isNaN( parsedColSpan ) ? 1 : parsedColSpan )
			);
		}, 0 );

		this.indices[ sectionName ] = section
			.map( ( { cells }, rowIndex ) => {
				let colIds = Array.from(
					{ length: colCount },
					( _, index ) => index
				);
				const previousRows = section.filter(
					( _, index ) => index < rowIndex
				);

				if ( previousRows.length ) {
					previousRows.forEach(
						( { cells: previousCells }, previousRowIndex ) => {
							previousCells.forEach(
								( { rowSpan }, cellIndex ) => {
									const currentIndex =
										this.indices[ sectionName ]?.[
											previousRowIndex
										]?.[ cellIndex ];

									if ( ! currentIndex ) {
										return;
									}

									const parsedRowSpan = rowSpan
										? Number.parseInt(
												String( rowSpan ),
												10
										  )
										: 1;

									if (
										parsedRowSpan + previousRowIndex >
										rowIndex
									) {
										colIds = colIds.filter(
											( colIdx ) =>
												colIdx <
													currentIndex.minColIdx ||
												colIdx > currentIndex.maxColIdx
										);
									}
								}
							);
						}
					);
				}

				return {
					cells: cells.map( ( cell ) => {
						const parsedColSpan = cell.colSpan
							? Number.parseInt( String( cell.colSpan ), 10 )
							: 1;
						const span = Number.isNaN( parsedColSpan )
							? 1
							: parsedColSpan;
						const colIdx =
							colIds[ span ] !== undefined ? span : colIds.length;
						const boundaryIds = colIds.slice( 0, colIdx );

						colIds = colIds.slice( colIdx );

						return {
							minColIdx: Math.min( ...boundaryIds ),
							maxColIdx: Math.max( ...boundaryIds ),
						};
					} ),
				};
			} )
			.map( ( { cells } ) => cells );
	}

	public mergeCells(
		section: TableRow[],
		indexRange: IndexRange,
		sectionName: string
	) {
		const { minRowIdx, maxRowIdx, minColIdx, maxColIdx } = indexRange;

		const isMerged = ( rowIndex: number, cellIndex: number ) => {
			const indices = this.getIndices( sectionName, rowIndex, cellIndex );

			return (
				rowIndex === minRowIdx &&
				indices?.minColIdx === minColIdx &&
				indices?.maxColIdx === maxColIdx
			);
		};

		return section.map( ( { cells }, rowIndex ) => {
			if ( rowIndex < minRowIdx || rowIndex > maxRowIdx ) {
				return { cells };
			}

			return {
				cells: cells
					.map( ( cell, cellIndex ) => {
						if ( isMerged( rowIndex, cellIndex ) ) {
							const rowSpan =
								Math.abs( maxRowIdx - minRowIdx ) + 1;
							const colSpan =
								Math.abs( maxColIdx - minColIdx ) + 1;

							return {
								...cell,
								rowSpan: rowSpan > 1 ? rowSpan : undefined,
								colSpan: colSpan > 1 ? colSpan : undefined,
							};
						}

						return cell;
					} )
					.filter(
						( _, cellIndex ) =>
							isMerged( rowIndex, cellIndex ) ||
							! this.inRange(
								rowIndex,
								this.getIndices(
									sectionName,
									rowIndex,
									cellIndex
								) as CellIndex
							)
					),
			};
		} );
	}

	public splitMergedCells(
		section: TableRow[],
		selectedCell: {
			rowSpan?: string | number;
			colSpan?: string | number;
			columnIdx: number;
			rowIdx: number;
			maxColIdx: number;
		},
		sectionName: string
	) {
		const selectedRowSpan = selectedCell.rowSpan
			? Number.parseInt( String( selectedCell.rowSpan ), 10 )
			: 1;
		const selectedColSpan = selectedCell.colSpan
			? Number.parseInt( String( selectedCell.colSpan ), 10 )
			: 1;
		const maxRowIdx = selectedRowSpan + selectedCell.rowIdx - 1;
		const savedContent =
			section[ selectedCell.rowIdx ]?.cells[ selectedCell.columnIdx ]
				?.content || '';

		return section.map( ( { cells }, rowIndex ) => {
			if ( rowIndex < selectedCell.rowIdx || rowIndex > maxRowIdx ) {
				return { cells };
			}

			const fixColIdx = rowIndex === selectedCell.rowIdx ? 1 : 0;
			let findColIdx = selectedCell.columnIdx;

			if ( rowIndex !== selectedCell.rowIdx ) {
				findColIdx = cells.findIndex( ( _, cellIndex ) => {
					const indices = this.getIndices(
						sectionName,
						rowIndex,
						cellIndex
					);

					return indices?.minColIdx === selectedCell.maxColIdx + 1;
				} );

				findColIdx = findColIdx !== -1 ? findColIdx : cells.length;
			}

			return {
				cells: [
					...cells.slice( 0, findColIdx ),
					...Array.from( { length: selectedColSpan }, ( _, index ) =>
						index === 0 && rowIndex === selectedCell.rowIdx
							? { content: savedContent }
							: { content: '' }
					),
					...cells.slice( findColIdx + fixColIdx ),
				],
			};
		} );
	}

	public insertRow(
		section: TableRow[],
		selectedCell: { rowIdx: number },
		position: 'before' | 'after'
	) {
		const [ firstRow ] = section;
		const colCount = firstRow.cells.reduce( ( count, { colSpan } ) => {
			const parsedColSpan = colSpan
				? Number.parseInt( String( colSpan ), 10 )
				: 1;

			return (
				count + ( Number.isNaN( parsedColSpan ) ? 1 : parsedColSpan )
			);
		}, 0 );

		let cellCount = colCount;
		const selectedRowIdx =
			position === 'after'
				? selectedCell.rowIdx
				: selectedCell.rowIdx - 1;

		const newSection =
			selectedRowIdx !== -1
				? section.map( ( { cells }, rowIndex ) => {
						if ( rowIndex <= selectedRowIdx ) {
							return {
								cells: cells.map( ( cell ) => {
									const rowSpan = cell.rowSpan
										? Number.parseInt(
												String( cell.rowSpan ),
												10
										  )
										: 1;
									const colSpan = cell.colSpan
										? Number.parseInt(
												String( cell.colSpan ),
												10
										  )
										: 1;

									if (
										selectedRowIdx <
										rowSpan + rowIndex - 1
									) {
										cell.rowSpan = rowSpan + 1;
										cellCount -= colSpan;
									}

									return cell;
								} ),
							};
						}

						return { cells };
				  } )
				: [];

		return [
			...newSection.slice( 0, selectedRowIdx + 1 ),
			{
				cells: Array.from( { length: cellCount }, () => ( {
					content: '',
				} ) ),
			},
			...section.slice( selectedRowIdx + 1 ),
		];
	}

	public deleteRow(
		section: TableRow[],
		selectedCell: { rowIdx: number },
		sectionName: string
	) {
		const deletedRow = section[ selectedCell.rowIdx ];

		return section
			.map( ( { cells }, rowIndex ) => {
				if ( selectedCell.rowIdx > rowIndex ) {
					return {
						cells: cells.map( ( cell ) => {
							const rowSpan = cell.rowSpan
								? Number.parseInt( String( cell.rowSpan ), 10 )
								: 1;

							if ( selectedCell.rowIdx < rowSpan + rowIndex ) {
								cell.rowSpan = rowSpan - 1;
							}

							return cell;
						} ),
					};
				}

				if ( selectedCell.rowIdx === rowIndex ) {
					return { cells };
				}

				return {
					cells: deletedRow.cells.reduce(
						( reducedRow, { rowSpan, colSpan }, cellIndex ) => {
							const minColIdx = this.getIndices(
								sectionName,
								rowIndex,
								cellIndex
							)?.minColIdx;
							const parsedRowSpan = rowSpan
								? Number.parseInt( String( rowSpan ), 10 )
								: 1;
							const parsedColSpan = colSpan
								? Number.parseInt( String( colSpan ), 10 )
								: 1;

							if ( minColIdx === undefined ) {
								return reducedRow;
							}

							if (
								selectedCell.rowIdx + parsedRowSpan >
								rowIndex
							) {
								let findIdx = cells.findIndex(
									( _, currentCellIndex ) => {
										const indices = this.getIndices(
											sectionName,
											rowIndex,
											currentCellIndex
										);

										return (
											indices?.minColIdx === minColIdx - 1
										);
									}
								);

								findIdx = reducedRow[ findIdx + 1 ]
									? findIdx + 1
									: reducedRow.length;

								return [
									...reducedRow.slice( 0, findIdx ),
									...Array.from(
										{ length: parsedColSpan },
										() => ( {
											content: '',
										} )
									),
									...reducedRow.slice( findIdx ),
								];
							}

							return reducedRow;
						},
						cells
					),
				};
			} )
			.filter( ( _, rowIndex ) => rowIndex !== selectedCell.rowIdx );
	}

	public insertColumn(
		section: TableRow[],
		selectedCell: { minColIdx: number; maxColIdx: number },
		position: 'before' | 'after',
		sectionName: string
	) {
		let countRowSpan = 0;
		let realMaxColIdx = selectedCell.maxColIdx;
		const minSelectedColIdx = selectedCell.minColIdx;
		const isAfter = position === 'after';

		if ( ! isAfter && minSelectedColIdx ) {
			let isFound = false;

			section.forEach( ( { cells }, rowIndex ) => {
				if ( isFound ) {
					return;
				}

				cells.forEach( ( _, cellIndex ) => {
					const maxColIdx = this.getIndices(
						sectionName,
						rowIndex,
						cellIndex
					)?.maxColIdx;

					if ( maxColIdx === minSelectedColIdx - 1 ) {
						realMaxColIdx = maxColIdx;
						isFound = true;
					}
				} );
			} );
		}

		return section.map( ( { cells }, rowIndex ) => {
			if ( ! isAfter && ! minSelectedColIdx ) {
				return { cells: [ { content: '' }, ...cells ] };
			}

			if ( countRowSpan ) {
				countRowSpan--;
				return { cells };
			}

			let findMaxColIdx: number | undefined;
			let findColSpan = 1;
			let findIdx = cells.findIndex( ( { colSpan }, cellIndex ) => {
				findColSpan = colSpan
					? Number.parseInt( String( colSpan ), 10 )
					: 1;
				findMaxColIdx = this.getIndices(
					sectionName,
					rowIndex,
					cellIndex
				)?.maxColIdx;

				return (
					findMaxColIdx === realMaxColIdx ||
					( findMaxColIdx !== undefined &&
						findMaxColIdx > realMaxColIdx )
				);
			} );

			if ( findIdx === -1 ) {
				return { cells: [ ...cells, { content: '' } ] };
			}

			const minIdx = ( findMaxColIdx as number ) - ( findColSpan - 1 );

			if ( findMaxColIdx !== realMaxColIdx && minIdx <= realMaxColIdx ) {
				cells[ findIdx ].colSpan = findColSpan + 1;

				if ( cells[ findIdx ].rowSpan ) {
					countRowSpan =
						Number.parseInt(
							String( cells[ findIdx ].rowSpan ),
							10
						) - 1;
				}

				return { cells };
			}

			findIdx =
				findMaxColIdx !== realMaxColIdx && minIdx > realMaxColIdx
					? findIdx
					: cells[ findIdx + 1 ]
					? findIdx + 1
					: cells.length;

			return {
				cells: [
					...cells.slice( 0, findIdx ),
					{ content: '' },
					...cells.slice( findIdx ),
				],
			};
		} );
	}

	public deleteColumn(
		section: TableRow[],
		selectedCell: {
			colSpan?: string | number;
			minColIdx: number;
			maxColIdx: number;
		},
		sectionName: string
	) {
		const selectedColSpan = selectedCell.colSpan
			? Number.parseInt( String( selectedCell.colSpan ), 10 )
			: 1;
		const minSelectedColIdx = selectedCell.minColIdx;
		const maxSelectedColIdx = selectedCell.maxColIdx;

		const isOutOfRange = ( minIdx: number, maxIdx: number ) =>
			( minIdx < minSelectedColIdx && maxIdx < minSelectedColIdx ) ||
			( minIdx > maxSelectedColIdx && maxIdx > maxSelectedColIdx );
		const crossesLeft = ( minIdx: number, maxIdx: number ) =>
			minIdx < minSelectedColIdx &&
			maxIdx >= minSelectedColIdx &&
			maxIdx <= maxSelectedColIdx;
		const crossesRight = ( minIdx: number, maxIdx: number ) =>
			maxIdx > maxSelectedColIdx &&
			minIdx <= maxSelectedColIdx &&
			minIdx >= minSelectedColIdx;

		return section.reduce< TableRow[] >(
			( reducedRows, { cells }, rowIndex ) => {
				const row = cells.reduce(
					( reducedCells, cell, cellIndex ) => {
						const colSpan = cell.colSpan
							? Number.parseInt( String( cell.colSpan ), 10 )
							: 1;
						const indices = this.getIndices(
							sectionName,
							rowIndex,
							cellIndex
						);

						if ( ! indices ) {
							return reducedCells;
						}

						if (
							isOutOfRange( indices.minColIdx, indices.maxColIdx )
						) {
							return [ ...reducedCells, cell ];
						}

						if (
							crossesLeft( indices.minColIdx, indices.maxColIdx )
						) {
							cell.colSpan =
								colSpan -
								( indices.maxColIdx - minSelectedColIdx + 1 );
							return [ ...reducedCells, cell ];
						}

						if (
							crossesRight( indices.minColIdx, indices.maxColIdx )
						) {
							cell.colSpan =
								colSpan -
								( maxSelectedColIdx - indices.minColIdx + 1 );
							return [ ...reducedCells, cell ];
						}

						if (
							indices.minColIdx < minSelectedColIdx &&
							indices.maxColIdx > maxSelectedColIdx
						) {
							cell.colSpan = colSpan - selectedColSpan;
							return [ ...reducedCells, cell ];
						}

						return reducedCells;
					},
					[] as TableRow[ 'cells' ]
				);

				return [ ...reducedRows, { cells: row.length ? row : [] } ];
			},
			[]
		);
	}

	public getIndices( section: string, rowIndex: number, cellIndex: number ) {
		return this.indices[ section ]?.[ rowIndex ]?.[ cellIndex ];
	}
}
