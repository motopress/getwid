/**
* Internal dependencies
*/
import Inspector from './inspector';
import './editor.scss';

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import classnames from 'classnames';
import { times, has, isEqual, every } from 'lodash';

/**
* WordPress dependencies
*/
const { compose } = wp.compose;
const { Component } = wp.element;
const { Toolbar, DropdownMenu, TextControl, Button, Placeholder } = wp.components;
const { RichText, BlockControls, BlockIcon, withColors } = wp.blockEditor || wp.editor;

const { jQuery: $ } = window;

/**
* Module Constants
*/
const allowedFormats = [
	'core/bold',
	'core/italic',
	'core/link',
	'core/image',
	'core/strikethrough'
];

/**
* Create an Component
*/
class GetwidTable extends Component {
	
	constructor() {
		super(...arguments);

		this.getCellStyle = this.getCellStyle.bind( this );
		this.toggleSection = this.toggleSection.bind( this );

		this.getSelectedCell = this.getSelectedCell.bind( this );
		this.updateCellsStyles = this.updateCellsStyles.bind( this );
		this.getParsedStyles = this.getParsedStyles.bind( this );

		this.isRangeSelected = this.isRangeSelected.bind( this );
		this.isMultiSelected = this.isMultiSelected.bind( this );

		this.inRange = this.inRange.bind( this );
		this.inMulti = this.inMulti.bind( this );

		this.state = {
			rowCount: 5,
			columnCount: 5,
			updated: false,
			indexRange: null,
			rangeSelected: null,
			multiSelected: null,
			selectedCell: null,
			selectedSection: null
		};
	}

	calculateRealColumnIndex() {

		const { setAttributes, attributes } = this.props;

		[ 'head', 'body', 'foot' ].forEach( section => {
			if ( !attributes[section].length ) {
				return null;
			}

			const [firstRow, ...rest] = attributes[section];
			const colCount = firstRow.cells.reduce( (count, { colSpan }) => count += colSpan ? parseInt( colSpan ) : 1, 0 );

			setAttributes({
				[section]: attributes[section].map( ({ cells }, rIndex) => {
					if ( !rIndex ) {
						return {
							cells: cells.map( (cell, cIndex) => {
								const prevCells = cells.filter( (cell, index) => index < cIndex );
								cell.rColIdx = cIndex;

								if ( prevCells.length ) {
									prevCells.forEach( ({ colSpan }) => {
										if ( colSpan ) {
											const prevColSpan = colSpan
												? parseInt( colSpan )
												: 1;
			
											cell.rColIdx += parseInt( prevColSpan ) - 1;
										}
									} );
								}
								return cell;
							} )
						}
					}
		
					let rColIds = times( colCount, index => index );
					const prevRows = attributes[section].filter( (row, index) => index < rIndex );
		
					prevRows.forEach( ({ cells }, index) => {
						cells.forEach( ({ rowSpan, colSpan, rColIdx }) => {
							if ( rowSpan && parseInt( rowSpan ) + index > rIndex ) {
								const prevColSpan = colSpan
									? parseInt( colSpan )
									: 1;
		
								const maxColIdx = prevColSpan + rColIdx - 1;
								const minColIdx = maxColIdx - (prevColSpan - 1);
		
								rColIds = rColIds.filter( rColIdx =>
									rColIdx < minColIdx
									|| rColIdx > maxColIdx
								);
							}
						} );
					} );

					return {
						cells: cells.map( (cell, cIndex) => {
							const colSpan = cell.colSpan
								? parseInt( cell.colSpan )
								: 1;

							const minColIdx = rColIds[cIndex];
							const maxColIdx = minColIdx + colSpan - 1;

							const rColIdx = maxColIdx - colSpan + 1;
							const minIdx = rColIds.findIndex( value => isEqual( minColIdx, value ) );
							const maxIdx = rColIds.findIndex( value => isEqual( maxColIdx, value ) );

							rColIds = [
								...rColIds.slice( 0, minIdx ),
								rColIdx,
								...rColIds.slice( rColIds[maxIdx + 1]
									? maxIdx + 1
									: rColIds.length
								)
							];
							return cell;
						} ).map( (cell, index) => {
							cell.rColIdx = rColIds[index];
							return cell;
						} )
					}
			} ) })
		});
	}

	calculateIndexRange(toCell) {
		const { rangeSelected } = this.state;

		const { fromCell } = rangeSelected;
		const { fromRowIdx, fromRowSpan, fromColSpan, fromRealColIdx } = fromCell;
		const { toRowIdx, toRowSpan, toColSpan, toRealColIdx } = toCell;

		const minRowIdx = Math.min( fromRowIdx, toRowIdx );
		const maxRowIdx = Math.max( fromRowIdx + fromRowSpan, toRowIdx + toRowSpan );

		const minColIdx = Math.min( fromRealColIdx, toRealColIdx );
		const maxColIdx = Math.max( fromRealColIdx + fromColSpan, toRealColIdx + toColSpan );

		this.setState({
			indexRange: {
				minRowIdx: minRowIdx,
				maxRowIdx: maxRowIdx,
				minColIdx: minColIdx,
				maxColIdx: maxColIdx
			},
			rangeSelected: {
				...rangeSelected,
				toCell: toCell
			},
			multiSelected: null,
			selectedCell: null
		});
	}

	/* #region Manage Cells */
	onMergeCells() {
		const { selectedSection: section, indexRange } = this.state;
		const { minRowIdx, maxRowIdx, minColIdx, maxColIdx } = indexRange;

		const { setAttributes, attributes } = this.props;

		const isMergedCell =
			(rIndex, { rColIdx }) =>
				   isEqual( rIndex, minRowIdx )
				&& isEqual( rColIdx, minColIdx );
		
		setAttributes({
			[section]: attributes[section].map( ({ cells }, rIndex) => {
				if ( rIndex < minRowIdx && rIndex > maxRowIdx ) {
					return { cells };
				}

				return {
					cells: cells.map( cell => {
						if ( isMergedCell( rIndex, cell ) ) {

							const rowSpan = Math.abs( maxRowIdx - minRowIdx ) + 1;
							const colSpan = Math.abs( maxColIdx - minColIdx ) + 1;
	
							return {
								...cell,
								rowSpan: rowSpan > 1 ? rowSpan : undefined,
								colSpan: colSpan > 1 ? colSpan : undefined
							}
						}
						return cell;
					} ).filter( cell =>
						isMergedCell( rIndex, cell ) || !this.inRange( rIndex, cell.rColIdx )
					)
				};
			}, [] )
		});

		this.setState({
			selectedCell: null,
			selectedSection: null,
			rangeSelected: null,
			updated: true
		});
	}

	onSplitMergedCells() {
		let { selectedCell } = this.state;
		const { selectedSection: section } = this.state;
		const { setAttributes, attributes } = this.props;

		const selectedRowSpan =
			selectedCell.rowSpan
				? parseInt( selectedCell.rowSpan )
				: 1;

		const selectedColSpan = 
			selectedCell.colSpan
				? parseInt( selectedCell.colSpan )
				: 1;

		const minRowIdx = selectedCell.rowIdx;
		const maxRowIdx = selectedRowSpan + minRowIdx - 1;

		selectedCell = attributes[section][minRowIdx].cells[selectedCell.columnIdx];

		setAttributes({
			[section]: attributes[section].map( ({ cells }, rIndex) => {
				if ( rIndex >= minRowIdx && rIndex <= maxRowIdx ) {

					const selectedIdx = cells.indexOf( selectedCell );

					const fixColIdx = isEqual( rIndex, minRowIdx ) ? 1 : 0;
					const savedValue =
						!isEqual( selectedIdx, -1 )
							? cells[selectedIdx].content
							: '';

					let findRowIdx;
					if ( !isEqual( selectedIdx, -1 ) ) {
						findRowIdx = selectedIdx;
					} else {
						const cellRightIdx = cells.findIndex( cell =>
							isEqual( selectedCell.rColIdx + selectedColSpan, cell.rColIdx)
						);
						findRowIdx = !isEqual( cellRightIdx, -1 ) ? cellRightIdx : cells.length;
					}
	
					return {
						cells: [
							...cells.slice( 0, findRowIdx ),
							...times( selectedColSpan, index => !index ? ({ content: savedValue }) : ({ content: '' }) ),
							...cells.slice( findRowIdx + fixColIdx )
						]
					}
				}
				return { cells };
			})
		});

		this.setState({
			selectedCell: null,
			selectedSection: null,
			updated: true
		});
	}
	/* #endregion */

	/* #region Manage Rows */
	onInsertRow(offset) {
		const { selectedSection: section } = this.state;
		const { setAttributes, attributes } = this.props;

		const { rowIdx: selectedRowIdx } = this.state.selectedCell;

		const isertAfter = offset;
		const cellCount = attributes[section][selectedRowIdx].cells
			.filter( ({ rowSpan }) =>
				isertAfter
				? !rowSpan
				: true
			).reduce( (count, { colSpan }) =>
				count += parseInt(
					colSpan
					? colSpan
					: 1
				),
			0 );

		setAttributes({
			[section]: [
				...attributes[section].slice( 0, selectedRowIdx + offset ),
				{ cells: times( cellCount, () => ({ content: '' }) ) },
				...attributes[section].slice( selectedRowIdx + offset )
			].map( ({ cells }, rIndex) => {
				return {
					cells: cells.map( cell => {
						if ( cell.rowSpan ) {
							const isCrossRow = isertAfter
								? rIndex <= selectedRowIdx
								: rIndex < selectedRowIdx;
								
							if ( isCrossRow ) {
								if ( parseInt( cell.rowSpan ) + rIndex > selectedRowIdx ) {
									cell.rowSpan = parseInt( cell.rowSpan ) + 1;
								}
							}
						}
						return cell;
					} )
				}
			} )
		});

		this.setState({
			selectedCell: null,
			selectedSection: null,
			updated: true
		});
	}

	onDeleteRow() {
		const { selectedCell } = this.state;
		const { selectedSection: section } = this.state;
		const { setAttributes, attributes } = this.props;

		const deletedRow = attributes[section][selectedCell.rowIdx];

		setAttributes({
			[section]: attributes[section].map( ({ cells }, rIndex) => {
				if ( selectedCell.rowIdx > rIndex ) {
					return {
						cells: cells.map( cell => {
							const rowSpan = cell.rowSpan
								? parseInt( cell.rowSpan )
								: 1;
							
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
					cells: deletedRow.cells.reduce( (reducedRow, cell) => {
						const rowSpan = cell.rowSpan
							? parseInt( cell.rowSpan )
							: 1;
						const colSpan = cell.colSpan
							? parseInt( cell.colSpan )
							: 1;

						if ( selectedCell.rowIdx + rowSpan > rIndex ) {
							const maxColIdx = colSpan + cell.rColIdx - 1;
							const minColIdx = maxColIdx - (colSpan - 1);
	
							let findIdx = cells.findIndex( cell => {
								const colSpan = cell.colSpan
									? parseInt( cell.colSpan )
									: 1;
								return isEqual( colSpan + cell.rColIdx - 1, minColIdx - 1 );
							} );
	
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
		});

		this.setState({
			selectedCell: null,
			selectedSection: null,
			updated: true
		});
	}
	/* #endregion */

	/* #region Manage Columns */
	onInsertColumn(offset) {

		const { selectedCell, selectedSection: section } = this.state;
		const { setAttributes, attributes } = this.props;

		const selColSpan = selectedCell.colSpan
			? parseInt( selectedCell.colSpan )
			: 1;

		let countRowSpan = 0;
		let realMaxColIdx = selColSpan + selectedCell.rColIdx - 1;

		const minSelColIdx = realMaxColIdx - (selColSpan - 1);
		if ( !offset && minSelColIdx ) {
			let isFound = false;
			attributes[section].forEach( ({ cells }) => {
				if ( isFound ) return;

				cells.forEach( cell => {
					const colSpan = cell.colSpan
						? parseInt( cell.colSpan )
						: 1;

					const maxColIdx = colSpan + cell.rColIdx - 1;

					if ( isEqual( maxColIdx, minSelColIdx - 1 ) ) {
						realMaxColIdx = maxColIdx;
						isFound = !isFound;
						return;
					}
				} );
			} );
		}

		[ 'head', 'body', 'foot' ].forEach( section =>
			setAttributes({
				[section]: attributes[section].map( ({ cells }) => {
					if ( !offset && !minSelColIdx ) {
						return { cells: [ { content: '' }, ...cells ] };
					}
		
					if ( countRowSpan ) {
						countRowSpan--;
						return { cells };
					}
					
					let findMaxColIdx, findColSpan;
					let findIdx = cells.findIndex( ({ colSpan, rColIdx }) => {
						findColSpan = colSpan ? parseInt( colSpan ) : 1;
						findMaxColIdx = findColSpan + rColIdx - 1;
		
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
				} )
			})
		);

		this.setState({
			selectedCell: null,
			updated: true
		});
	}

	onDeleteColumn() {
		const { setAttributes, attributes } = this.props;

		const { selectedCell } = this.state;
		const rColIdx = selectedCell.rColIdx;
		const selectedColSpan = selectedCell.colSpan ? parseInt( selectedCell.colSpan ) : 1;
		
		const maxSelColIdx = selectedColSpan + rColIdx - 1;
		const minSelColIdx = maxSelColIdx - (selectedColSpan - 1);

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

		let sections = {};
		[ 'head', 'body', 'foot' ].forEach( section => {
			let newSection = attributes[section].reduce( (reducedRow, { cells }) => {
				const row = cells.reduce( (reducedCells, cell ) => {
	
					const colSpan = cell.colSpan ? parseInt( cell.colSpan ) : 1;
					const maxColIdx = colSpan + cell.rColIdx - 1;
					const minColIdx = maxColIdx - (colSpan - 1);
	
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

			sections = {
				...sections,
				...!this.isEmptyTableSection( newSection )
					? { [section]: newSection }
					: { [section]: [] }
			}
		} );

		setAttributes( sections );

		this.setState({
			selectedCell: null,
			selectedSection: null,
			updated: true
		});
	}
	/* #endregion */

	/* #region Manage Styles */
	getParsedStyles(styles) {
		if ( !styles ) return undefined;

		return styles
			.split( ';' )
			.map( style => [
				style.split( ':' )[0].replace( /-./g, char => char[1].toUpperCase() ),
				style.split( ':' )[1]
			] )
			.reduce( (styles, style ) => ({
				...styles,
				[ style[0] ]: style[1]
			}), {} );
	}

	getCellStyle(style) {

		const { attributes } = this.props;
		const { selectedCell, selectedSection: section } = this.state;

		let styles;
		if ( selectedCell ) {
			const { rowIdx, columnIdx } = selectedCell;

			styles = attributes[section][rowIdx].cells[columnIdx].styles;
		} else if ( this.isRangeSelected() ) {
			const { indexRange } = this.state;
			const [first, ...rest] = attributes[section][indexRange.minRowIdx].cells;

			styles = first.styles;
		}
		
		if ( styles ) {
			if ( $.isPlainObject( styles ) ) {
				return styles[style];
			} else {
				styles = this.getParsedStyles( styles );
				return styles[style];
			}
		}
		return undefined;
	}	

	updateCellsStyles(style) {

		const { selectedCell } = this.state;
		const isRangeSelected = this.isRangeSelected();
		const isMultiSelected = this.isMultiSelected();
		
		if ( !selectedCell && !isRangeSelected && !isMultiSelected ) return;

		const { selectedSection: section } = this.state;
		const { setAttributes, attributes } = this.props;

		setAttributes({
			[section]: attributes[section].map( ({ cells }, rIndex) => {
				return {
					cells: cells.map( (cell, cIndex) => {
	
						let changeStyle;
						if ( selectedCell ) {
							const { rowIdx, columnIdx } = selectedCell;
							if ( isEqual( rowIdx, rIndex ) && isEqual( columnIdx, cIndex ) ) {
								changeStyle = true;
							}
						}
	
						if ( isRangeSelected ) {
							changeStyle = this.inRange( rIndex, cell.rColIdx );
						}
	
						if ( isMultiSelected ) {
							changeStyle = this.inMulti( rIndex, cIndex );
						}

						let styles;
						if ( changeStyle ) {
							changeStyle = false;
							styles = $.isPlainObject( cell.styles )
								? cell.styles
								: this.getParsedStyles( cell.styles );
					
							if ( has( style, 'borderColor' ) ) {
								style.borderColor = style.borderColor
									? style.borderColor
									: '#000';

								if ( styles.borderTopColor ) {
									styles = { ...styles, borderTopColor: style.borderColor };
								}
								if ( styles.borderRightColor ) {
									styles = { ...styles, borderRightColor: style.borderColor };
								}
								if ( styles.borderBottomColor ) {
									styles = { ...styles, borderBottomColor: style.borderColor };
								}
								if ( styles.borderLeftColor ) {
									styles = { ...styles, borderLeftColor: style.borderColor };
								}
							} else if ( style.setBorder ) {
								const borderColor = this.getBorderColor( styles );
								switch ( style.setBorder ) {
									case 'top':
										styles = { ...styles, borderTopColor: borderColor };
										break;
									case 'right':
										styles = { ...styles, borderRightColor: borderColor };
										break;
									case 'bottom':
										styles = { ...styles, borderBottomColor: borderColor };
										break;
									case 'left':
										styles = { ...styles, borderLeftColor: borderColor };
										break;
									case 'all':
										styles = {
											...styles,
											borderTopColor   : borderColor,
											borderRightColor : borderColor,
											borderBottomColor: borderColor,
											borderLeftColor  : borderColor
										};
										break;
									case 'none':
										const { clientId } = this.props;
										const $block = $( `#block-${clientId}` );

										has( styles, 'borderStyle' )
											? delete styles.borderStyle
											: null;

										has( styles, 'borderWidth' )
											? delete styles.borderWidth
											: null;

										$block.find( `t${section}` )
											.find( 'tr' ).eq( rIndex )
											.find( isEqual( section, 'head' ) ? 'th' : 'td' ).eq( cIndex )
											.css({
												borderStyle: '',
												borderWidth: ''
											});

										styles = {
											...styles,
											borderTopColor   : undefined,
											borderRightColor : undefined,
											borderBottomColor: undefined,
											borderLeftColor  : undefined
										};
										break;
									default:
										break;
								}
							} else {
                                styles = { ...styles, ...style };
							}
							cell.styles = styles;
						}
						return cell;
					} )
				}
			} )
		});
	}

	getBorderColor(styles) {
		let borderColor;

		if ( styles ) {
			const { borderTopColor, borderRightColor } = styles;
			const { borderBottomColor, borderLeftColor } = styles;

			borderColor = borderTopColor
				|| borderRightColor
				|| borderBottomColor
				|| borderLeftColor;
		}

		return borderColor ? borderColor : '#000';
	}
	/* #endregion */
	
	renderInitTableForm() {
		const { baseClass } = this.props;
		const { rowCount, columnCount } = this.state;

		return (
			<Placeholder
				label={ __( 'Table', 'getwid' ) }
				icon={ <BlockIcon icon={ 'menu' } showColors /> }
				instructions={ __( 'Insert a table for sharing data.', 'getwid' ) }
			>
				<form
					className={ `${baseClass}__placeholder-form` }
					onSubmit={ () => this.onCreateTable() }
				>
					<TextControl
						type='number'
						className={ `${baseClass}__placeholder-input` }
						label={ __( 'Row Count', 'getwid' ) }
						value={ rowCount }
						onChange={ value => this.setState({ rowCount: value }) }
						min='1'
					/>
					<TextControl
						type='number'
						className={ `${baseClass}__placeholder-input` }
						label={ __( 'Column Count', 'getwid' ) }
						value={ columnCount }
						onChange={ value => this.setState({ columnCount: value }) }
						min='1'
					/>
					<Button
						className={ `${baseClass}__placeholder-button` }
						isSecondary
						type='submit'
					>
						{ __( 'Create Table', 'getwid' ) }
					</Button>
				</form>
			</Placeholder>
		);
	}

	getTableControlls() {
		const { selectedCell } = this.state;
		return [
			{
				icon: 'table-row-delete',
				title: __( 'Delete Row', 'getwid' ),
				isDisabled: !selectedCell
					|| this.isRangeSelected()
					|| this.isMultiSelected(),
				onClick: () => this.onDeleteRow()
			},
			{
				icon: 'table-row-before',
				title: __( 'Add Row Before', 'getwid' ),
				isDisabled: !selectedCell
					|| this.isRangeSelected()
					|| this.isMultiSelected(),
				onClick: () => this.onInsertRow(0)
			},
			{
				icon: 'table-row-after',
				title: __( 'Add Row After', 'getwid' ),
				isDisabled: !selectedCell
					|| this.isRangeSelected()
					|| this.isMultiSelected(),
				onClick: () => this.onInsertRow(1)
			},
			{
				icon: 'table-col-delete',
				title: __( 'Delete Column', 'getwid' ),
				isDisabled: !selectedCell
					|| this.isRangeSelected()
					|| this.isMultiSelected(),
				onClick: () => this.onDeleteColumn()
			},
			{
				icon: 'table-col-before',
				title: __( 'Add Column Before', 'getwid' ),
				isDisabled: !selectedCell
					|| this.isRangeSelected()
					|| this.isMultiSelected(),
				onClick: () => this.onInsertColumn(0)
			},
			{
				icon: 'table-col-after',
				title: __( 'Add Column After', 'getwid' ),
				isDisabled: !selectedCell
					|| this.isRangeSelected()
					|| this.isMultiSelected(),
				onClick: () => this.onInsertColumn(1)
			},
			{
				icon: 'menu',
				title: __( 'Merge Cells', 'getwid' ),
				isDisabled: !this.isRangeSelected()
					|| this.isMultiSelected(),
				onClick: () => this.onMergeCells()
			},
			{
				icon: 'menu',
				title: __( 'Split Cells', 'getwid' ),
				isDisabled: !this.canSplit()
					|| this.isRangeSelected()
					|| this.isMultiSelected(),
				onClick: () => this.onSplitMergedCells()
			}
		];
	}

	onCreateTable () {
		const { setAttributes } = this.props;
		const { rowCount, columnCount } = this.state;

		setAttributes({
			body: times( rowCount, () => ( {
				cells: times( columnCount, () => ({
					content: ''
				}) )
			}) )
		});

		this.setState({
			updated: true
		});
	}

	onUpdateTableContent(content) {
		const { selectedCell, selectedSection: section } = this.state;
		const { setAttributes, attributes } = this.props;

		setAttributes({
			[section]: attributes[section].map(({ cells }, rIndex) => {
				if ( rIndex != selectedCell.rowIdx ) {
					return { cells };
				}

				return {
					cells: cells.map((cell, cIndex) => {
						if ( cIndex != selectedCell.columnIdx ) {
							return cell;
						}
	
						return {
							...cell,
							content
						};
					})
				};
			})
		});
	}

	isRangeSelected() {
		const { rangeSelected } = this.state;
		return rangeSelected && !!rangeSelected.toCell;
	}

	isMultiSelected() {
		const { multiSelected } = this.state;
		return !!multiSelected && multiSelected.length > 1;
	}

	canSplit() {
		const { selectedCell } = this.state;
		return selectedCell
			&& (selectedCell.rowSpan || selectedCell.colSpan);
	}

	inRange(rIndex, rColIdx) {
		const { indexRange } = this.state;
		const { minRowIdx, maxRowIdx, minColIdx, maxColIdx } = indexRange;

		return rIndex >= minRowIdx
			&& rIndex <= maxRowIdx
			&& rColIdx >= minColIdx
			&& rColIdx <= maxColIdx;
	}

	inMulti(rIndex, cIndex) {
		const { multiSelected } = this.state;

		return multiSelected.some( ({ rowIdx, columnIdx }) =>
			   isEqual( rowIdx, rIndex ) && isEqual( columnIdx, cIndex )
		);
	}

	isEmptyTableSection( section ) {
		return every( section, row => !row.cells.length );
	}

	getSelectedCell() {
		const { selectedCell } = this.state;
		
		if ( selectedCell ) {
			const { section } = selectedCell;

			const { rowIdx, columnIdx } = selectedCell;
			const { cells } = this.props.attributes[section][rowIdx];

			let { styles } = cells[columnIdx];
			styles = $.isPlainObject( styles )
				? styles
				: this.getParsedStyles( styles );

			selectedCell.styles = styles;
			selectedCell.borderColor = this.getBorderColor( styles );
		}
		return selectedCell;
	}
	
	componentDidUpdate(prevProps, prevState) {
		
		const { isSelected: isSelectedBlock } = this.props;
		const { selectedCell, updated } = this.state;

		const isSelected = selectedCell
			|| this.isRangeSelected()
			|| this.isMultiSelected();

		if ( !isSelectedBlock && isSelected ) {
			this.setState({
				selectedCell: null,
				rangeSelected: null,
				multiSelected: null
			});
		}

		if ( updated ) {
			this.calculateRealColumnIndex();
			this.setState({ updated: false });
		}

		//console.log( this.props.attributes[ 'body' ] );
	}

	componentDidMount() {
		this.calculateRealColumnIndex();
		//console.log( this.props.attributes[ 'body' ] );
	}

	toggleSection(section) {
		const { selectedSection } = this.state;

		const { setAttributes } = this.props;
		const { body } = this.props.attributes;

		if ( !this.props.attributes[section].length ) {
			const [firstRow, ...rest] = body;

			return setAttributes({
				[section]: [{
					cells: firstRow.cells.map( ({ colSpan, rColIdx }) =>
						({ colSpan: colSpan, rColIdx: rColIdx })
					)
				}]
			});
		}

		setAttributes({ [section]: [] });

		if ( isEqual( selectedSection, section ) ) {
			this.setState({
				selectedCell: null,
				selectedSection: null
			});
		}
	}

	renderSection(section) {
		const {
			baseClass,
			attributes
		} = this.props;

		const {
			selectedCell,
			selectedSection,
			multiSelected
		} = this.state;

		return attributes[section].map(({ cells }, rIndex) => (
			<tr key={ rIndex }>
				{ cells.map(({ content, colSpan, rowSpan, rColIdx, styles }, cIndex) => {
					const Tag = isEqual( section, 'head' ) ? 'th' : 'td';

					const cell = {
						rowIdx: rIndex,
						columnIdx: cIndex,
						rowSpan: rowSpan,
						colSpan: colSpan,
						rColIdx: rColIdx,
						section: section
					};

					let isSelected = selectedCell
						&& isEqual( rIndex, selectedCell.rowIdx )
						&& isEqual( cIndex, selectedCell.columnIdx )
						&& isEqual( section, selectedSection );

					if ( this.isRangeSelected() ) {
						isSelected = this.inRange( rIndex, rColIdx )
							&& isEqual( section, selectedSection );
					}

					if ( this.isMultiSelected() ) {
						isSelected = this.inMulti( rIndex, cIndex )
							&& isEqual( multiSelected[0].section, section );
					}

					return (
						<Tag
							key={ cIndex }
							{ ...isSelected ? { className: 'selected' } : {} }
							colSpan={ colSpan }
							rowSpan={ rowSpan }
							style={ $.isPlainObject( styles ) ? styles : this.getParsedStyles( styles ) }
							onClick={ event => {
								if ( event.shiftKey ) {
									const { rangeSelected } = this.state;

									if ( !rangeSelected ) return;
									if ( !isEqual( section, rangeSelected.fromCell.section ) ) {
										alert( __( 'Cannot select multi cells from difference section!', 'getwid' ));
										return;
									}

									this.calculateIndexRange({
										toRowIdx: rIndex,
										toRealColIdx: rColIdx,
										
										toRowSpan: rowSpan ? parseInt( rowSpan ) - 1 : 0,
										toColSpan: colSpan ? parseInt( colSpan ) - 1 : 0,
										section: section
									});
								} else if ( event.ctrlKey ) {
									const multiCells = multiSelected ? multiSelected : [];
									
									if ( multiCells.length && !isEqual( multiCells[0].section, section ) ) {
										alert( __( 'Cannot select multi cells from difference section!', 'getwid' ));
										return;
									}

									multiCells.push( cell );
									this.setState({
										multiSelected: multiCells,
										rangeSelected: null,
										selectedCell: null
									});
								} else {
									this.setState({
										rangeSelected: {
											fromCell: {
												fromRowIdx: rIndex,
												fromRealColIdx: rColIdx,

												fromRowSpan: rowSpan ? parseInt( rowSpan ) - 1 : 0,
												fromColSpan: colSpan ? parseInt( colSpan ) - 1 : 0,
												section: section
											}
										},
										multiSelected: [cell]
									});
								}
							}}
						>
							<RichText
								className={ `${baseClass}__cell` }
								value={ content }
								onChange={ value => this.onUpdateTableContent( value ) }
								unstableOnFocus={ () => {
									const { updated } = this.state;
									if ( !updated ) {
										this.setState({
											selectedCell: cell,
											selectedSection: section
										});
									}
								} }
								allowedFormats={ selectedCell
									? allowedFormats
									: []
								}
							/>
						</Tag>
					);
				}) }
			</tr>
		) );
	}

	render() {
		const {
			attributes: {
				head, foot, body
			}
		} = this.props;

		const isEmpty = this.isEmptyTableSection( head )
			&& this.isEmptyTableSection( body )
			&& this.isEmptyTableSection( foot );

		if ( isEmpty ) {
			return this.renderInitTableForm();
		}

		const { selectedSection } = this.state;
		const {
			attributes: {
				tableLayout,
				borderCollapse,
				horizontalAlign,
				verticalAlign
			},
			className,
			backgroundColor,
			textColor
		} = this.props;

		const {
			inRange,
			inMulti,
			getCellStyle,
			toggleSection,
			isRangeSelected,
			isMultiSelected,
			updateCellsStyles,
			getSelectedCell,
			getParsedStyles
		} = this;

		return (
			<>
				<BlockControls>
					<Toolbar>
						<DropdownMenu
							hasArrowIndicator
							icon='editor-table'
							label={ __( 'Edit Table', 'getwid' ) }
							controls={ this.getTableControlls() }
						/>
					</Toolbar>
                </BlockControls>
				<Inspector {...{
					inRange,
					inMulti,
					getCellStyle,
					toggleSection,
					getSelectedCell,
					isRangeSelected,
					isMultiSelected,
					selectedSection,
					getParsedStyles,
					updateCellsStyles,
					...this.props
				}} key={ 'inspector' }/>
				<div
					className={ classnames(
					className, 'is-editor', {
							[ `has-table-layout-${tableLayout}` ]: tableLayout,
							[ `has-border-collapse-${borderCollapse}` ]: borderCollapse
						}
					) }
				>
					<table
						className={ classnames({
							[ `has-horisontal-align-${horizontalAlign}` ]: horizontalAlign,
							[ `has-vertical-align-${verticalAlign}` ]: verticalAlign
						}) }
						style={{
							backgroundColor: backgroundColor.color,
							color: textColor.color
						}}
					>
						{ !!head.length && (
							<thead>{ this.renderSection( 'head' ) }</thead>
						)}
						<tbody>{ this.renderSection( 'body' ) }</tbody>
						{ !!foot.length && (
							<tfoot>{ this.renderSection( 'foot' ) }</tfoot>
						)}
					</table>
				</div>
			</>
		);
	}
}

export default compose([
	withColors( 'backgroundColor', { textColor: 'color' } )
])( GetwidTable );