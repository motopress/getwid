/**
* External dependencies
*/
import { times, isEqual, min, max } from 'lodash';

export default class Table {
    constructor(inRange) {
        this.getIndices = this.getIndices.bind( this );

        this.inRange = inRange;
        this.indices = {};
    }

    calculateIndices(section, sectionName) {

        const [firstRow, ...rest] = section;
        const colCount = firstRow.cells.reduce( (count, { colSpan }) => count += colSpan ? parseInt( colSpan ) : 1, 0 );

        this.indices[sectionName] = section.map( ({ cells }, rIndex) => {

            let colIds = times( colCount, index => index );
            const prevRows = section.filter( (row, index) => index < rIndex );

            if ( prevRows.length ) {

                prevRows.forEach( ({ cells }, index) => {
                    cells.forEach( ({ rowSpan, minColIdx, maxColIdx }) => {

                        if ( rowSpan && parseInt( rowSpan ) + index > rIndex ) {
                            colIds = colIds.filter( colIdx =>
                                colIdx < minColIdx
                                || colIdx > maxColIdx
                            );
                        }
                    } );
                } );
            }

            return {
                cells: cells.map( cell => {
                    let colIdx = cell.colSpan
                        ? parseInt( cell.colSpan )
                        : 1;

                    colIdx = colIds[colIdx] ? colIdx : colIds.length;

                    const boundaryIds = colIds.slice( 0, colIdx );
                    colIds = colIds.slice( colIdx, colIds.length );

                    cell.minColIdx = min( boundaryIds );
                    cell.maxColIdx = max( boundaryIds );
                    return cell;
                } )
            }
        } ).map( ({ cells }) => 
            cells.map( ({ minColIdx, maxColIdx }) => ({
                minColIdx: minColIdx,
                maxColIdx: maxColIdx
            }) )
        );
    }
    
    /* #region Manage Cells */
    mergeCells(section, indexRange, sectionName) {
		const {
            minRowIdx,
            maxRowIdx,
            minColIdx,
            maxColIdx
        } = indexRange;

		const isMerged = (rIndex, cIndex) =>
			isEqual( rIndex, minRowIdx )
				&& isEqual( this.getIndices(
                    sectionName,
                    rIndex,
                    cIndex
                ).minColIdx, minColIdx
            );
		
		return section.map( ({ cells }, rIndex) => {
            if ( rIndex < minRowIdx || rIndex > maxRowIdx ) {
                return { cells };
            }

            return {
                cells: cells.map( (cell, cIndex) => {
                    if ( isMerged( rIndex, cIndex ) ) {

                        const rowSpan = Math.abs( maxRowIdx - minRowIdx ) + 1;
                        const colSpan = Math.abs( maxColIdx - minColIdx ) + 1;

                        return {
                            ...cell,
                            rowSpan: rowSpan > 1 ? rowSpan : undefined,
                            colSpan: colSpan > 1 ? colSpan : undefined
                        }
                    }
                    return cell;
                } ).filter( (cell, cIndex) =>
                        isMerged( rIndex, cIndex )
                        || !this.inRange(
                            rIndex,
                            this.getIndices(
                                sectionName,
                                rIndex,
                                cIndex
                            )
                        ) )
            };
        } );
    }
    
    splitMergedCells(section, selectedCell, sectionName) {
		const {
            rowSpan,
            colSpan,
            columnIdx,
            rowIdx: minRowIdx
        } = selectedCell;

        const selectedRowSpan = rowSpan
            ? parseInt( rowSpan )
            : 1;
            
        const selectedColSpan = colSpan
            ? parseInt( colSpan )
            : 1;

		const maxRowIdx = selectedRowSpan + minRowIdx - 1;
		const savedContent = section[minRowIdx].cells[columnIdx].content;

        return section.map( ({ cells }, rIndex) => {
            if ( rIndex >= minRowIdx && rIndex <= maxRowIdx ) {

                const fixColIdx = isEqual( rIndex, minRowIdx ) ? 1 : 0;
                
                let findColIdx = columnIdx;
                if ( !isEqual( rIndex, minRowIdx ) ) {
                    findColIdx = cells.findIndex( (cell, cIndex) =>
                        isEqual( this.getIndices(
                                sectionName,
                                rIndex,
                                cIndex
                            ).minColIdx,
                            selectedCell.maxColIdx + 1
                        ) );
                    findColIdx = !isEqual( findColIdx, -1 )
                        ? findColIdx
                        : cells.length;
                }

                return {
                    cells: [
                        ...cells.slice( 0, findColIdx ),
                        ...times( selectedColSpan, index => !index && isEqual( rIndex, minRowIdx ) ? ({ content: savedContent }) : ({ content: '' }) ),
                        ...cells.slice( findColIdx + fixColIdx )
                    ]
                }
            }
            return { cells };
        });
	}
    /* #endregion */

    /* #region Manage Rows */
	insertRow(section, selectedCell, position) {

		const [firstRow, ...rest] = section;
		const colCount = firstRow.cells.reduce( (count, { colSpan }) => count += colSpan ? parseInt( colSpan ) : 1, 0 );

		let cellCount = colCount;
		let selectedRowIdx = isEqual( position, 'after' )
			? selectedCell.rowIdx
			: selectedCell.rowIdx - 1;

		const newSection = !isEqual( selectedRowIdx, -1 )
			? section.map( ({ cells }, rIndex) => {
				if ( rIndex <= selectedRowIdx ) {
					return {
						cells: cells.map( cell => {
							const rowSpan = cell.rowSpan ? parseInt( cell.rowSpan ) : 1;
							const colSpan = cell.colSpan ? parseInt( cell.colSpan ) : 1;

							if ( selectedRowIdx < rowSpan + rIndex - 1 ) {
								cell.rowSpan = rowSpan + 1;
								cellCount -= colSpan;
							}
							return cell;
						} )
					}	
				}
				return { cells }
			} ) : [];

		return [
            ...newSection.slice( 0, selectedRowIdx + 1 ),
            { cells: times( cellCount, () => ({ content: '' }) ) },
            ...section.slice( selectedRowIdx + 1 )
        ];
	}

	deleteRow(section, selectedCell, sectionName) {

        const deletedRow = section[selectedCell.rowIdx];
        
		return section.map( ({ cells }, rIndex) => {
            if ( selectedCell.rowIdx > rIndex ) {
                return {
                    cells: cells.map( cell => {
                        const rowSpan = cell.rowSpan ? parseInt( cell.rowSpan ) : 1;
                        selectedCell.rowIdx < rowSpan + rIndex
                            ? cell.rowSpan = rowSpan - 1
                            : null;
                        return cell;
                    } )
                }
            }

            if ( isEqual( selectedCell.rowIdx, rIndex ) ) {
                return { cells }
            }

            return {
                cells: deletedRow.cells.reduce( (reducedRow, { rowSpan, colSpan }, cIndex) => {
                    const minColIdx = this.getIndices( sectionName, rIndex, cIndex );

                    rowSpan = rowSpan ? parseInt( rowSpan ) : 1;
                    colSpan = colSpan ? parseInt( colSpan ) : 1;

                    if ( selectedCell.rowIdx + rowSpan > rIndex ) {
                        let findIdx = cells.findIndex( (cell, cIndex) =>
                            isEqual( this.getIndices(
                                    sectionName,
                                    rIndex,
                                    cIndex
                                ), minColIdx - 1
                            )
                        );
                        findIdx = cells[findIdx + 1]
                            ? findIdx + 1
                            : cells.length;

                        return [
                            ...reducedRow.slice( 0, findIdx ),
                            ...times( colSpan, () => ({ content: '' }) ),
                            ...reducedRow.slice( findIdx )
                        ];
                    }
                    return reducedRow;
                }, cells )
            }
        } ).filter( (cell, index) => !isEqual( index, selectedCell.rowIdx ) )
	}
	/* #endregion */

    /* #region Manage Columns */
    insertColumn(section, selectedCell, position, sectionName) {

		let countRowSpan = 0;
		let realMaxColIdx = selectedCell.maxColIdx;

		const minSelColIdx = selectedCell.minColIdx;
		const isAfter = isEqual( position, 'after' ) ? true : false;

		if ( !isAfter && minSelColIdx ) {
			let isFound = false;
			section.forEach( ({ cells }, rIndex) => {
				if ( isFound ) return;

				cells.forEach( (cell, cIndex) => {
                    const { maxColIdx } = this.getIndices( sectionName, rIndex, cIndex );
					if ( isEqual( maxColIdx, minSelColIdx - 1 ) ) {
						realMaxColIdx = maxColIdx;
						isFound = !isFound;
						return;
					}
				} );
			} );
		}

		return section.map( ({ cells }, rIndex) => {
            if ( !isAfter && !minSelColIdx ) {
                return { cells: [ { content: '' }, ...cells ] };
            }

            if ( countRowSpan ) {
                countRowSpan--;
                return { cells };
            }
            
            let findMaxColIdx, findColSpan;
            let findIdx = cells.findIndex( ({ colSpan }, cIndex) => {
                findColSpan = colSpan ? parseInt( colSpan ) : 1;

                findMaxColIdx = this.getIndices(
                    sectionName,
                    rIndex,
                    cIndex
                ).maxColIdx;

                return isEqual( findMaxColIdx, realMaxColIdx )
                    || findMaxColIdx > realMaxColIdx;
            } );

            if ( isEqual( findIdx, -1 ) ) {
                return { cells: [ ...cells, { content: '' } ] };
            }

            const minIdx = findMaxColIdx - (findColSpan - 1);

            if ( !isEqual( findMaxColIdx, realMaxColIdx ) ) {
                if ( minIdx <= realMaxColIdx ) {
                    cells[findIdx].colSpan = findColSpan + 1;

                    if ( cells[findIdx].rowSpan ) {
                        countRowSpan = parseInt( cells[findIdx].rowSpan ) - 1;
                    }
                    return { cells }
                }
            }

            findIdx = !isEqual( findMaxColIdx, realMaxColIdx )
                && minIdx > realMaxColIdx
                    ? findIdx
                    : cells[findIdx + 1]
                        ? findIdx + 1
                        : cells.length;
            return {
                cells: [
                    ...cells.slice( 0, findIdx ),
                    { content: '' },
                    ...cells.slice( findIdx )
                ]
            }
        } );
	}

	deleteColumn(section, selectedCell, sectionName) {

		const { colSpan, minColIdx: minSelColIdx, maxColIdx: maxSelColIdx } = selectedCell;
		const selectedColSpan = colSpan ? parseInt( colSpan ) : 1;

		const inRange = (minIdx, maxIdx) =>
			   (minIdx < minSelColIdx && maxIdx < minSelColIdx)
			|| (minIdx > maxSelColIdx && maxIdx > maxSelColIdx);

		const isCrossLeft = (minIdx, maxIdx) =>
			   minIdx < minSelColIdx
			&& maxIdx >= minSelColIdx
			&& maxIdx <= maxSelColIdx;

		const isCrossRight = (minIdx, maxIdx) =>
			   maxIdx > maxSelColIdx
			&& minIdx <= maxSelColIdx
			&& minIdx >= minSelColIdx;

        return section.reduce( (reducedRow, { cells }, rIndex) => {
            const row = cells.reduce( (reducedCells, cell, cIndex ) => {

                const colSpan = cell.colSpan ? parseInt( cell.colSpan ) : 1;
                const { minColIdx, maxColIdx } = this.getIndices( sectionName, rIndex, cIndex );

                if ( inRange( minColIdx, maxColIdx ) ) {
                    return [ ...reducedCells, cell ];
                }

                if ( isCrossLeft( minColIdx, maxColIdx ) ) {
                    cell.colSpan = colSpan - (maxColIdx - minSelColIdx + 1);
                    return [ ...reducedCells, cell ];
                }

                if ( isCrossRight( minColIdx, maxColIdx ) ) {
                    cell.colSpan = colSpan - (maxSelColIdx - minColIdx + 1);
                    return [ ...reducedCells, cell ];
                }

                if ( minColIdx < minSelColIdx && maxColIdx > maxSelColIdx ) {
                    cell.colSpan = colSpan - selectedColSpan;
                    return [ ...reducedCells, cell ];
                }

                return reducedCells;
            }, [] );

            return [
                ...reducedRow,
                ...[{ cells: row.length ? row : [] }]
            ]
        }, [] );
	}
    /* #endregion */

    getIndices( section, rIndex, cIndex ) {
        return this.indices[section]
            ? this.indices[section][rIndex][cIndex]
            : undefined;
    }
}