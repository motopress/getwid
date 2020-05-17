/**
* Internal dependencies
*/
import Inspector from './inspector';

import './editor.scss';

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import { times, has, isEqual } from 'lodash';
import memize from 'memize';

const { Component, Fragment } = wp.element;
const { Toolbar, DropdownMenu, TextControl, Button } = wp.components;
const { RichText, BlockControls } = wp.blockEditor || wp.editor;

/**
* Create an Component
*/
class GetwidTable extends Component {
	
	constructor() {
		super(...arguments);

		this.state = {
			rowCount: 4,
			columnCount: 4,
			updated: false,
			indexRange: null,
			rangeSelected: null,
			selectedCell: null
		};
	}

	initTable() {
		const { setAttributes } = this.props;
		const { rowCount, columnCount } = this.state;

		setAttributes({
			body: times( rowCount, () => ( {
				cells: times( columnCount, () => ( {
					value: ''
				} ) )
			} ) ),
			isPreview: true
		});

		this.setState({
			updated: true
		});
	}

	renderInitTableForm() {
		const { baseClass } = this.props;
		const { rowCount, columnCount } = this.state;

		return (
			<form className={`${baseClass}__init-table`} onSubmit={ () => this.initTable() }>
				<div className='form-wrapper'>
					<TextControl
						type='number'
						label={__( 'Row count', 'getwid' )}
						value={ rowCount }
						onChange={ value => this.setState( { rowCount: value } ) }
						min='1'
					/>
					<TextControl
						type='number'
						value={ columnCount }
						label={__( 'Column count', 'getwid' )}
						onChange={ value => this.setState( { columnCount: value } ) }
						min='1'
					/>
					<Button isPrimary type='submit'>{__( 'Create Table', 'getwid' )}</Button>
				</div>
			</form>
		);
	}

	getTableControlls() {
		const { selectedCell } = this.state;
		return [
			{
				icon: 'menu',
				title: __( 'Delete Row', 'getwid' ),
				isDisabled: !selectedCell || this.isRangeSelected(),
				onClick: () => this.deleteRow()
			},
			{
				icon: 'menu',
				title: __( 'Add Row Before', 'getwid' ),
				isDisabled: !selectedCell || this.isRangeSelected(),
				onClick: () => this.insertRow(0)
			},
			{
				icon: 'menu',
				title: __( 'Add Row After', 'getwid' ),
				isDisabled: !selectedCell || this.isRangeSelected(),
				onClick: () => this.insertRow(1)
			},
			{
				icon: 'menu',
				title: __( 'Delete Column', 'getwid' ),
				isDisabled: !selectedCell || this.isRangeSelected(),
				onClick: () => this.deleteColumn()
			},
			{
				icon: 'menu',
				title: __( 'Add Column Before', 'getwid' ),
				isDisabled: !selectedCell || this.isRangeSelected(),
				onClick: () => this.insertColumn(0)
			},
			{
				icon: 'menu',
				title: __( 'Add Column After', 'getwid' ),
				isDisabled: !selectedCell || this.isRangeSelected(),
				onClick: () => this.insertColumn(1)
			},
			{
				icon: 'menu',
				title: __( 'Merge Cells', 'getwid' ),
				isDisabled: !this.isRangeSelected(),
				onClick: () => this.mergeCells()
			},
			{
				icon: 'menu',
				title: __( 'Split Cells', 'getwid' ),
				isDisabled: !this.canSplit(),
				onClick: () => this.splitMergedCells()
			}
		];
	}

	isRangeSelected() {
		const { rangeSelected } = this.state;
		return rangeSelected && rangeSelected.toCell;
	}

	canSplit() {
		const { selectedCell } = this.state;
		return selectedCell && (selectedCell.rowSpan || selectedCell.colSpan);
	}

	updateTableValue(value) {
		const { selectedCell } = this.state;

		const { setAttributes } = this.props;
		const { body } = this.props.attributes;

		setAttributes({
			body: body.map(({ cells }, index) => {
				if ( index != selectedCell.rowIndex ) {
					return { cells };
				}

				return {
					cells: cells.map((cell, index) => {
						if ( index != selectedCell.columnIndex ) {
							return cell;
						}
	
						return {
							...cell,
							value
						};
					})
				};
			})
		});
	}

	calculateRealColumnIndex() {
		const { setAttributes } = this.props;
		const { body } = this.props.attributes;

		setAttributes({
			body: body.map( ({ cells }, rIndex) => {
				return {
					cells: cells.map( (cell, cIndex, row ) => {
						cell.rColumnIndex = cIndex;
		
						const prevRows = body.filter( (row, index) => index < rIndex );
						if ( prevRows.length ) {
							prevRows.forEach( ({ cells }, index) => {
								cells.forEach( ({ rowSpan, colSpan, rColumnIndex }) => {
									if ( rowSpan && parseInt( rowSpan ) + index > rIndex ) {
										if ( !cIndex ) {
											if ( rColumnIndex <= cell.rColumnIndex ) {
												cell.rColumnIndex = colSpan ? parseInt( colSpan ) : 1;
											}
										} else {
											const previous = row[ cIndex - 1 ];
											if ( isEqual( rColumnIndex, previous.rColumnIndex + 1 ) || rColumnIndex <= previous.rColumnIndex ) {
												cell.rColumnIndex += colSpan ? parseInt( colSpan ) : 1;
											}
										}
									}
								} );
							} );
						}
		
						const prevCells = cells.filter( (cell, index) => index < cIndex );
						if ( prevCells.length ) {
							prevCells.forEach( ({ colSpan }) => {
								if ( colSpan ) {
									cell.rColumnIndex += parseInt( colSpan ) - 1;
								}
							} );
						}
		
						return cell;
					} )
				}
			} )
		});
	}

	calculateIndexRange(toCell) {
		const { rangeSelected } = this.state;

		const { fromCell } = rangeSelected;
		const { fromRowIndex, fromRowSpan, fromColSpan, fromRealColumnIndex } = fromCell;
		const { toRowIndex, toRowSpan, toColSpan, toRealColumnIndex } = toCell;

		const minRowIdx = Math.min( fromRowIndex, toRowIndex );
		const maxRowIdx = Math.max( fromRowIndex + fromRowSpan, toRowIndex + toRowSpan );

		const minColumnIdx = Math.min( fromRealColumnIndex, toRealColumnIndex );
		const maxColumnIdx = Math.max( fromRealColumnIndex + fromColSpan, toRealColumnIndex + toColSpan );

		this.setState({
			indexRange: {
				minRowIndex: minRowIdx,
				maxRowIndex: maxRowIdx,
				minColumnIndex: minColumnIdx,
				maxColumnIndex: maxColumnIdx
			},
			rangeSelected: {
				...rangeSelected,
				toCell: toCell
			},
			selectedCell: null
		});
	}

	inRange(rIndex, rColumnIndex) {
		const { indexRange } = this.state;
		const { minRowIndex, maxRowIndex, minColumnIndex, maxColumnIndex } = indexRange;

		return rIndex >= minRowIndex && rIndex <= maxRowIndex && rColumnIndex >= minColumnIndex && rColumnIndex <= maxColumnIndex;
	}

	mergeCells() {
		//console.log( '__MERGE__' );

		const { indexRange } = this.state;
		const { minRowIndex, maxRowIndex, minColumnIndex, maxColumnIndex } = indexRange;

		const { setAttributes } = this.props;
		const { body } = this.props.attributes;

		const isMergeCell = (rIndex, { rColumnIndex }) =>
			isEqual( rIndex, minRowIndex ) && isEqual( rColumnIndex, minColumnIndex );

		const _this = this;
		setAttributes({
			body: body.map( ({ cells }, rIndex) => {
				if ( rIndex < minRowIndex && rIndex > maxRowIndex ) {
					return { cells };
				}

				return {
					cells: cells.map( (cell, cIndex) => {
						if ( isMergeCell( rIndex, cell ) ) {
							const rowSpan = Math.abs( maxRowIndex - minRowIndex ) + 1;
							const colSpan = Math.abs( maxColumnIndex - minColumnIndex ) + 1;
	
							return {
								...cell,
								rowSpan: rowSpan > 1 ? rowSpan : undefined,
								colSpan: colSpan > 1 ? colSpan : undefined
							}
						}
						return cell;
					} ).filter( cell =>
						isMergeCell( rIndex, cell ) || !_this.inRange( rIndex, cell.rColumnIndex )
					)
				};
			}, [] )
		});

		this.setState( {
			selectedCell: null,
			rangeSelected: null,
			updated: true
		} );
	}

	splitMergedCells() {
		//console.log( '__SPLIT_CELLS__' );

		let { selectedCell } = this.state;

		const selectedRowSpan = selectedCell.rowSpan ? parseInt( selectedCell.rowSpan ) : 1;
		const selectedColSpan = selectedCell.colSpan ? parseInt( selectedCell.colSpan ) : 1;

		const minRowIndex = selectedCell.rowIndex;
		const maxRowIndex = selectedRowSpan + minRowIndex - 1;

		const { setAttributes } = this.props;
		const { body } = this.props.attributes;

		selectedCell = body[minRowIndex].cells[selectedCell.columnIndex];

		setAttributes({
			body: body.map( (row, rIndex) => {
				if ( rIndex >= minRowIndex && rIndex <= maxRowIndex ) {
					const { cells } = row;
					const selectedIndex = cells.indexOf( selectedCell );
					const fixColumnIndex = isEqual( rIndex, minRowIndex ) ? 1 : 0;

					let findRowIndex, cellOnRight;
					if ( !isEqual( selectedIndex, -1 ) ) {
						findRowIndex = selectedIndex;
					} else {
						cellOnRight = cells.findIndex( cell => isEqual( selectedCell.rColumnIndex + selectedColSpan, cell.rColumnIndex) );
						findRowIndex = !isEqual( cellOnRight, -1 ) ? cellOnRight : cells.length;
					}
	
					return {
						cells: [
							...cells.slice( 0, findRowIndex ),
							...times( selectedColSpan, () => ({ value: '' }) ),
							...cells.slice( findRowIndex + fixColumnIndex )
						]
					}
				}
				return row;
			})
		});

		this.setState({
			selectedCell: null,
			rangeSelected: null,
			updated: true
		});
	}

	insertRow(offset) {
		//console.log( '__INSERT_ROW__' );

		const { setAttributes } = this.props;
		const { body } = this.props.attributes;

		const { rowIndex: selectedRowIndex } = this.state.selectedCell;

		const isertAfter = offset;
		const cellCount = body[selectedRowIndex].cells
			.filter( ({ rowSpan }) => isertAfter ? !rowSpan : true )
			.reduce( (count, { colSpan }) => count += parseInt( colSpan ? colSpan : 1 ), 0 );

		setAttributes({
			body: [
				...body.slice( 0, selectedRowIndex + offset ),
				{ cells: times( cellCount, () => ({ value: '' }) ) },
				...body.slice( selectedRowIndex + offset )
			].map( ({ cells }, rIndex) => {
				return {
					cells: cells.map( cell => {
						if ( cell.rowSpan ) {
							const isCrossRow = isertAfter
								? rIndex <= selectedRowIndex
								: rIndex < selectedRowIndex;
								
							if ( isCrossRow ) {
								if ( parseInt( cell.rowSpan ) + rIndex > selectedRowIndex ) {
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
			updated: true
		});
	}

	insertColumn(offset) {
		//console.log( '__INSERT_COLUMN__' );

		const { setAttributes } = this.props;
		const { body } = this.props.attributes;

		const { selectedCell } = this.state;
		const countColSpan = body[selectedCell.rowIndex].cells
			.filter( (cell, index) => index < selectedCell.columnIndex + offset)
			.reduce( (count, { colSpan }) => count += colSpan ? parseInt( colSpan ) : 1, 0 );

		setAttributes({
			body: body.map( ({ cells }) => {
				let findCountColSpan;
				let findColIndex = cells.findIndex( (cell, cIndex) => {
					findCountColSpan = cells.filter( (cell, index) => index < cIndex + offset ).reduce( (count, { colSpan }) => count += colSpan ? parseInt( colSpan ) : 1, 0 );
					return isEqual( findCountColSpan, countColSpan )
						|| findCountColSpan > countColSpan;
				} );
	
				if ( !isEqual( findCountColSpan, countColSpan ) && !isEqual( findColIndex, -1 ) ) {
					findColIndex = findColIndex + offset - 1;
					cells[findColIndex].colSpan = parseInt( cells[findColIndex].colSpan ) + 1;
				} else {
					return {
						cells: [
							...cells.slice( 0, findColIndex + offset ),
							{ value: '' },
							...cells.slice( findColIndex + offset )
						]
					}
				}
				return { cells }
			} )
		});

		this.setState({
			selectedCell: null,
			updated: true
		});
	}

	deleteRow() {
		//console.log( '__DELETE_ROW__' );

		const { setAttributes } = this.props;
		const { body } = this.props.attributes;

		const { selectedCell } = this.state;

		setAttributes({
			body: body.map( ({ cells }, rIndex) => {
				if ( isEqual( selectedCell.rowIndex, rIndex ) ) {
					return {
						cells: cells.reduce( (reducedRow, cell) => {
							if ( cell.rowSpan ) {
								const colSpan = cell.colSpan ? parseInt( cell.colSpan ) : 1;
								const rowSpan = cell.rowSpan ? parseInt( cell.rowSpan ) - 1 : 1;
	
								const row = !reducedRow.length ? body[rIndex + 1].cells : reducedRow;
								const cellOnRightIndex = row.findIndex( ({ rColumnIndex }) => isEqual( cell.rColumnIndex + colSpan, rColumnIndex ) );
								const findIndex = !isEqual( cellOnRightIndex, -1 ) ? cellOnRightIndex : row.length;
	
								return [
									...row.slice( 0, findIndex ),
									{
										value: '',
										colSpan: !isEqual( colSpan, 1 ) ? colSpan : undefined,
										rowSpan: rowSpan > 1 ? rowSpan : undefined
									},
									...row.slice( findIndex )
								];
							}
							return reducedRow;
						}, [] )
					}
				}
				return { cells }
			} ).filter( (row, index) => !isEqual( selectedCell.rowIndex + 1, index ) )
		});

		this.setState({
			selectedCell: null,
			updated: true
		});
	}

	deleteColumn() {
		console.log( '__DELTE_COLUMN__' );

		/* */
	}

	componentDidUpdate() {
		//console.log( this.props.attributes.body );

		const { updated } = this.state;
		if ( updated ) {
			this.calculateRealColumnIndex();
			this.setState({ updated: false });
		}
	}

	componentDidMount() {
		this.calculateRealColumnIndex();

		//console.log( this.props.attributes.body );
	}	

	render() {
		const { baseClass } = this.props;
		const { isPreview, body } = this.props.attributes;

		if ( !isPreview ) {
			return this.renderInitTableForm();
		}

		//console.log( body );

		const _this = this;
		const { selectedCell } = this.state;

		return (
			<Fragment>
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
				<Inspector {
					...this.props
				} key={ 'inspector' }/>
				<div className={`${baseClass}`}>
					<table>
						<tbody>
							{ body.map(({ cells }, rIndex) => {
								return (
									<tr key={ rIndex }>
										{ cells.map(({ value, colSpan, rowSpan, rColumnIndex }, cIndex) => {
											const cell = {
												rowIndex: rIndex,
												columnIndex: cIndex,
												rowSpan: rowSpan,
												colSpan: colSpan
											};
											let isSelected = selectedCell && isEqual( rIndex, selectedCell.rowIndex ) && isEqual( cIndex, selectedCell.columnIndex );

											if ( this.isRangeSelected() ) {
												//console.log( '__Range_Is_Selected__' );

												isSelected = _this.inRange( rIndex, rColumnIndex );
											}

											return (
												<td
													key={ cIndex }
													{ ...isSelected ? { className: 'selected' } : {} }
													colSpan={ colSpan }
													rowSpan={ rowSpan }
													onClick={event => {
														if ( event.shiftKey ) {
															// console.log( '__Press_Shift_Key__' );
															// console.log( rIndex );
															// console.log( cIndex );

															_this.calculateIndexRange( {
																toRowIndex: rIndex,
																toRealColumnIndex: rColumnIndex,

																toRowSpan: rowSpan ? parseInt( rowSpan ) - 1 : 0,
																toColSpan: colSpan ? parseInt( colSpan ) - 1 : 0
															} );
														} else {
															_this.setState({
																rangeSelected: {
																	fromCell: {
																		fromRowIndex: rIndex,
																		fromRealColumnIndex: rColumnIndex,

																		fromRowSpan: rowSpan ? parseInt( rowSpan ) - 1 : 0,
																		fromColSpan: colSpan ? parseInt( colSpan ) - 1 : 0
																	}
																}
															})
														}
													}}
												>
													<RichText
														className={ `${baseClass}__cell-content` }
														value={ value }
														onChange={ value => _this.updateTableValue( value ) }
														unstableOnFocus={ () => {
															_this.setState({ selectedCell: cell })
														} }
														keepPlaceholderOnFocus={ true }
														multiline={ false }
													/>
												</td>
											);
										}) }
									</tr>
								); } )
							}
						</tbody>
					</table>
				</div>
			</Fragment>
		);
	}
}

export default GetwidTable;