/**
* Internal dependencies
*/
import Inspector from './inspector';

import './editor.scss';

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import { times, isEqual } from 'lodash';

const { Component, Fragment } = wp.element;
const { Toolbar, DropdownMenu, TextControl, Button } = wp.components;
const { RichText, BlockControls } = wp.blockEditor || wp.editor;

/**
* Create an Component
*/
class GetwidTable extends Component {
	
	constructor() {
		super(...arguments);

		this.toggleSection = this.toggleSection.bind( this );

		this.state = {
			rowCount: 4,
			columnCount: 4,
			updated: false,
			indexRange: null,
			rangeSelected: null,
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

			const newSection = attributes[section].map( ({ cells }, rIndex) => ({
				cells: cells.map( (cell, cIndex, row ) => {
					cell.rColIdx = cIndex;
	
					const prevRows = attributes[section].filter( (row, index) => index < rIndex );
					if ( prevRows.length ) {
						prevRows.forEach( ({ cells }, index) => {
							cells.forEach( ({ rowSpan, colSpan, rColIdx }) => {
								if ( rowSpan && parseInt( rowSpan ) + index > rIndex ) {
									if ( !cIndex ) {
										if ( rColIdx <= cell.rColIdx ) {
											cell.rColIdx = colSpan ? parseInt( colSpan ) : 1;
										}
									} else {
										const previous = row[cIndex - 1];
										const lastColSpan = previous.colSpan ? parseInt( previous.colSpan ) : 0;

										if ( isEqual( rColIdx, previous.rColIdx + 1 ) || rColIdx <= previous.rColIdx + lastColSpan ) {
											cell.rColIdx += colSpan ? parseInt( colSpan ) : 1;
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
								cell.rColIdx += parseInt( colSpan ) - 1;
							}
						} );
					}
	
					return cell;
				} )
			} ) );

			setAttributes({ [section]: newSection });
		});
	}

	calculateIndexRange(toCell) {
		const { rangeSelected } = this.state;
		//if ( !rangeSelected ) return;

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
			selectedCell: null
		});
	}

	/* #region Manage Cells */
	mergeCells() {
		const { indexRange } = this.state;
		const { minRowIdx, maxRowIdx, minColIdx, maxColIdx } = indexRange;

		const { setAttributes, attributes } = this.props;

		const isMergedCell = (rIndex, { rColIdx }) =>
			isEqual( rIndex, minRowIdx ) && isEqual( rColIdx, minColIdx );

		const _this = this;
		const { selectedSection: section } = this.state;
		
		setAttributes({
			[section]: attributes[section].map( ({ cells }, rIndex) => {
				if ( rIndex < minRowIdx && rIndex > maxRowIdx ) {
					return { cells };
				}

				return {
					cells: cells.map( (cell, cIndex) => {
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
						isMergedCell( rIndex, cell ) || !_this.inRange( rIndex, cell.rColIdx )
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

	splitMergedCells() {
		let { selectedCell } = this.state;

		const selectedRowSpan = selectedCell.rowSpan ? parseInt( selectedCell.rowSpan ) : 1;
		const selectedColSpan = selectedCell.colSpan ? parseInt( selectedCell.colSpan ) : 1;

		const minRowIdx = selectedCell.rowIndex;
		const maxRowIdx = selectedRowSpan + minRowIdx - 1;

		const { selectedSection: section } = this.state;
		const { setAttributes, attributes } = this.props;

		selectedCell = attributes[section][minRowIdx].cells[selectedCell.columnIndex];

		setAttributes({
			[section]: attributes[section].map( ({ cells }, rIndex) => {
				if ( rIndex >= minRowIdx && rIndex <= maxRowIdx ) {

					const selectedIdx = cells.indexOf( selectedCell );
					const fixColIdx = isEqual( rIndex, minRowIdx ) ? 1 : 0;
					const selectedValue = !isEqual( selectedIdx, -1 ) ? cells[selectedIdx].value : '';

					let findRowIdx;
					if ( !isEqual( selectedIdx, -1 ) ) {
						findRowIdx = selectedIdx;
					} else {
						const cellOnRight = cells.findIndex( cell => isEqual( selectedCell.rColIdx + selectedColSpan, cell.rColIdx) );
						findRowIdx = !isEqual( cellOnRight, -1 ) ? cellOnRight : cells.length;
					}
	
					return {
						cells: [
							...cells.slice( 0, findRowIdx ),
							...times( selectedColSpan, () => ({ value: selectedValue }) ),
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
			rangeSelected: null,
			updated: true
		});
	}
	/* #endregion */

	/* #region Manage Rows */
	insertRow(offset) {
		const { selectedSection: section } = this.state;
		const { setAttributes, attributes } = this.props;

		const { rowIndex: selectedRowIdx } = this.state.selectedCell;

		const isertAfter = offset;
		const cellCount = attributes[section][selectedRowIdx].cells
			.filter( ({ rowSpan }) => isertAfter ? !rowSpan : true )
			.reduce( (count, { colSpan }) => count += parseInt( colSpan ? colSpan : 1 ), 0 );

		setAttributes({
			[section]: [
				...attributes[section].slice( 0, selectedRowIdx + offset ),
				{ cells: times( cellCount, () => ({ value: '' }) ) },
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

	deleteRow() {
		const { selectedSection: section } = this.state;
		const { setAttributes, attributes } = this.props;

		const { selectedCell } = this.state;

		setAttributes({
			[section]: attributes[section].map( ({ cells }, rIndex) => {
				if ( isEqual( selectedCell.rowIndex, rIndex ) ) {
					return {
						cells: cells.reduce( (reducedRow, cell) => {
							if ( cell.rowSpan ) {
								const colSpan = cell.colSpan ? parseInt( cell.colSpan ) : 1;
								const rowSpan = cell.rowSpan ? parseInt( cell.rowSpan ) - 1 : 1;
	
								const row = !reducedRow.length ? attributes[section][rIndex + 1].cells : reducedRow;
								const cellRightIdx = row.findIndex( ({ rColIdx }) => isEqual( cell.rColIdx + colSpan, rColIdx ) );
								const findIdx = !isEqual( cellRightIdx, -1 ) ? cellRightIdx : row.length;
	
								return [
									...row.slice( 0, findIdx ),
									{
										value: '',
										colSpan: !isEqual( colSpan, 1 ) ? colSpan : undefined,
										rowSpan: rowSpan > 1 ? rowSpan : undefined
									},
									...row.slice( findIdx )
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
			selectedSection: null,
			updated: true
		});
	}
	/* #endregion */

	/* #region Manage Columns */
	insertColumn(offset) {
		const { selectedSection: section } = this.state;
		const { setAttributes, attributes } = this.props;

		const { selectedCell } = this.state;

		const rColIdx = selectedCell.rColIdx;
		const selectedColSpan = selectedCell.colSpan ? parseInt( selectedCell.colSpan ) : 1;

		const maxSelColIdx = selectedColSpan + rColIdx;
		const minSelColIdx = maxSelColIdx - (selectedColSpan - 1);

		setAttributes({
			[section]: attributes[section].map( ({ cells }) => {
				let findMaxColIdx;
				let findColIdx = cells.findIndex( cell => {
					const colSpan = cell.colSpan ? parseInt( cell.colSpan ) : 1;
					const maxColIdx = cell.rColIdx + colSpan;
	
					findMaxColIdx = maxColIdx;
					return isEqual( maxColIdx, maxSelColIdx )
						|| maxColIdx > maxSelColIdx;
				} );
	
				const colSpan = parseInt( cells[findColIdx].colSpan );
	
				if ( !offset ) {
					const minColIdx = findMaxColIdx - (colSpan - 1);
	
					if ( minColIdx < minSelColIdx ) {
						cells[findColIdx].colSpan = colSpan + 1;
						return { cells }
					} 
				} else {
					if ( !isEqual( findMaxColIdx, maxSelColIdx ) ) {
						cells[findColIdx].colSpan = colSpan + 1;
						return { cells }
					}
				}
	
				findColIdx = findColIdx + offset;
				return {
					cells: [
						...cells.slice( 0, cells[findColIdx] ? findColIdx : cells.length ),
						{ value: '' },
						...cells.slice( cells[findColIdx] ? findColIdx : cells.length )
					]
				}
			} )
		});

		this.setState({
			selectedCell: null,
			selectedSection: null,
			updated: true
		});
	}

	deleteColumn() {
		const { selectedSection: section } = this.state;
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

		setAttributes({
			[section]: attributes[section].reduce( (reducedRow, { cells }) => {
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
					...row.length ? [{ cells: row }] : []
				]
			}, [] )
		});

		this.setState({
			selectedCell: null,
			selectedSection: null,
			updated: true
		});
	}
	/* #endregion */

	renderInitTableForm() {
		const { baseClass } = this.props;
		const { rowCount, columnCount } = this.state;

		const _this = this;
		return (
			<form className={`${baseClass}__init-table`} onSubmit={ () => _this.initTable() }>
				<div className='form-wrapper'>
					<TextControl
						type='number'
						label={__( 'Row count', 'getwid' )}
						value={ rowCount }
						onChange={ value => _this.setState( { rowCount: value } ) }
						min='1'
					/>
					<TextControl
						type='number'
						value={ columnCount }
						label={__( 'Column count', 'getwid' )}
						onChange={ value => _this.setState( { columnCount: value } ) }
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

	updateTableValue(value) {
		const { selectedCell, selectedSection: section } = this.state;
		const { setAttributes, attributes } = this.props;

		setAttributes({
			[section]: attributes[section].map(({ cells }, rIndex) => {
				if ( rIndex != selectedCell.rowIndex ) {
					return { cells };
				}

				return {
					cells: cells.map((cell, cIndex) => {
						if ( cIndex != selectedCell.columnIndex ) {
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

	isRangeSelected() {
		const { rangeSelected } = this.state;
		return rangeSelected && rangeSelected.toCell;
	}

	canSplit() {
		const { selectedCell } = this.state;
		return selectedCell && (selectedCell.rowSpan || selectedCell.colSpan);
	}

	inRange(rIndex, rColIdx) {
		const { indexRange } = this.state;
		const { minRowIdx, maxRowIdx, minColIdx, maxColIdx } = indexRange;

		return rIndex >= minRowIdx && rIndex <= maxRowIdx && rColIdx >= minColIdx && rColIdx <= maxColIdx;
	}
	
	componentDidUpdate(prevProps, prevState) {
		
		const { isSelected } = this.props;
		const { selectedCell, updated } = this.state;

		if ( !isSelected && selectedCell ) {
			this.setState({
				selectedCell: null,
				rangeSelected: null
			});
		}

		if ( updated ) {
			this.calculateRealColumnIndex();
			this.setState({ updated: false });
		}
	}

	componentDidMount() {
		this.calculateRealColumnIndex();
	}

	toggleSection(section) {
		const { setAttributes } = this.props;
		const { body } = this.props.attributes;

		if ( !this.props.attributes[section].length ) {
			return setAttributes({
				[section]: [{
					cells: body[0].cells.map( ({ colSpan, rColIdx }) => ({ colSpan: colSpan, rColIdx: rColIdx }) )
				}]
			});
		}

		setAttributes({ [section]: [] });
	}

	renderSection(section) {
		const { baseClass, attributes } = this.props;

		const _this = this;
		const { selectedCell, selectedSection } = this.state;

		return attributes[section].map(({ cells }, rIndex) => (
			<tr key={ rIndex }>
				{ cells.map(({ value, colSpan, rowSpan, rColIdx }, cIndex) => {
					const cell = {
						rowIndex: rIndex,
						columnIndex: cIndex,
						rowSpan: rowSpan,
						colSpan: colSpan,
						rColIdx: rColIdx
					};

					let isSelected = selectedCell
						&& isEqual( rIndex, selectedCell.rowIndex )
						&& isEqual( cIndex, selectedCell.columnIndex )
						&& isEqual( section, selectedSection );

					if ( _this.isRangeSelected() ) {
						isSelected = _this.inRange( rIndex, rColIdx ) && isEqual( section, selectedSection );
					}

					return (
						<td
							key={ cIndex }
							{ ...isSelected ? { className: 'selected' } : {} }
							colSpan={ colSpan }
							rowSpan={ rowSpan }
							onClick={ event => {
								if ( event.shiftKey ) {

									const { rangeSelected } = _this.state;
									if ( !isEqual( section, rangeSelected.fromCell.section ) ) {
										alert( __( 'Cannot select multi cells from difference section!', 'getwid' ));
										return;
									}

									_this.calculateIndexRange({
										toRowIdx: rIndex,
										toRealColIdx: rColIdx,
										
										toRowSpan: rowSpan ? parseInt( rowSpan ) - 1 : 0,
										toColSpan: colSpan ? parseInt( colSpan ) - 1 : 0,
										section: section
									});
								} else {
									_this.setState({
										rangeSelected: {
											fromCell: {
												fromRowIdx: rIndex,
												fromRealColIdx: rColIdx,

												fromRowSpan: rowSpan ? parseInt( rowSpan ) - 1 : 0,
												fromColSpan: colSpan ? parseInt( colSpan ) - 1 : 0,
												section: section
											}
										}
									})
								}
							}}
						>
							<RichText
								className={ `${baseClass}__cell` }
								value={ value }
								onChange={ value => _this.updateTableValue( value ) }
								unstableOnFocus={ () => {
									_this.setState({
										selectedCell: cell,
										selectedSection: section
									});
								} }
								keepPlaceholderOnFocus={ true }
							/>
						</td>
					);
				}) }
			</tr>
		) );
	}

	render() {
		const { toggleSection } = this;
		const { baseClass } = this.props;
		const { isPreview, head, foot, hasFixedLayout, tableCollapsed } = this.props.attributes;

		if ( !isPreview ) {
			return this.renderInitTableForm();
		}

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
				<Inspector {...{
					toggleSection,
					...this.props
				}} key={ 'inspector' }/>
				<div className={`${baseClass}`}>
					<table
						style={{
							tableLayout: hasFixedLayout ? 'fixed' : undefined,
							borderCollapse: tableCollapsed ? 'collapse' : undefined
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
			</Fragment>
		);
	}
}

export default GetwidTable;