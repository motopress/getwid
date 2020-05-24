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

/**
* WordPress dependencies
*/
const { Component } = wp.element;
const { Toolbar, DropdownMenu, TextControl, Button } = wp.components;
const { RichText, BlockControls } = wp.blockEditor || wp.editor;

const { jQuery: $ } = window;

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

		this.isRangeSelected = this.isRangeSelected.bind( this );
		this.isMultiSelected = this.isMultiSelected.bind( this );

		this.state = {
			rowCount: 4,
			columnCount: 4,
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

			setAttributes({ [section]: attributes[section].map( ({ cells }, rIndex) => ({
				cells: cells.map( (cell, cIndex, row ) => {

					cell.rColIdx = cIndex;
					const prevRows = attributes[section]
						.filter( (row, index) =>
							index < rIndex
						);
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
										const lastColSpan = previous.colSpan
											? parseInt( previous.colSpan )
											: 0;

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
			} ) ) });
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
			multiSelected: null,
			selectedCell: null
		});
	}

	/* #region Manage Cells */
	mergeCells() {
		const { indexRange } = this.state;
		const { minRowIdx, maxRowIdx, minColIdx, maxColIdx } = indexRange;

		const { setAttributes, attributes } = this.props;

		const isMergedCell =
			(rIndex, { rColIdx }) =>
				   isEqual( rIndex, minRowIdx )
				&& isEqual( rColIdx, minColIdx );

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
					const selectedValue =
						!isEqual( selectedIdx, -1 )
							? cells[selectedIdx].value
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
			updated: true
		});
	}
	/* #endregion */

	/* #region Manage Rows */
	insertRow(offset) {
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
				if ( isEqual( selectedCell.rowIdx, rIndex ) ) {
					return {
						cells: cells.reduce( (reducedRow, cell) => {
							if ( cell.rowSpan ) {
								const colSpan = cell.colSpan ? parseInt( cell.colSpan ) : 1;
								const rowSpan = cell.rowSpan ? parseInt( cell.rowSpan ) - 1 : 1;
	
								const row = !reducedRow.length
									? attributes[section][rIndex + 1].cells
									: reducedRow;
								const cellRightIdx = row.findIndex( ({ rColIdx }) => isEqual( cell.rColIdx + colSpan, rColIdx ) );
								const findIdx =
									!isEqual( cellRightIdx, -1 )
										? cellRightIdx
										: row.length;
	
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
			} ).filter( (row, index) => !isEqual( selectedCell.rowIdx + 1, index ) )
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

		if ( !selectedCell || !attributes[section].length ) {
			return undefined;
		}
		
		const { rowIdx, columnIdx } = selectedCell;
		let styles = attributes[section][rowIdx].cells[columnIdx].styles;

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

							const color = cell.cellBorderColor ? cell.cellBorderColor : '#000';

							if ( style.borderTopColor ) {
								style = { ...style, borderTopColor: color };
							}
							if ( style.borderRightColor ) {
								style = { ...style, borderRightColor: color };
							}
							if ( style.borderBottomColor ) {
								style = { ...style, borderBottomColor: color };
							}
							if ( style.borderLeftColor ) {
								style = { ...style, borderLeftColor: color };
							}

							styles = $.isPlainObject( cell.styles )
								? cell.styles
								: this.getParsedStyles( cell.styles );

							has( styles, 'borderColor' )
								? delete styles.borderColor
								: null;

							if ( style.borderColor ) {
								cell.cellBorderColor = style.borderColor;

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

								delete style.borderColor;
							}
						}
						
						return changeStyle ? {
							...cell,
							...{
								styles: {
									...styles,
									...style
								}
							}
						} : cell;
					} )
				}
			} )
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
							value
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
		return multiSelected && !!multiSelected.length;
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

	getSelectedCell() {
		let { selectedCell } = this.state;
		
		if ( selectedCell ) {
			const { selectedSection: section } = this.state;

			const { rowIdx, columnIdx  } = selectedCell;
			const { cells } = this.props.attributes[section][rowIdx];
			const { styles } = cells[columnIdx];
			
			selectedCell.cellBorderColor = cells[columnIdx].cellBorderColor;
			selectedCell.styles = $.isPlainObject( styles )
				? styles
				: this.getParsedStyles( styles );
		}
		return selectedCell;
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
					cells: body[0].cells.map( ({ colSpan, rColIdx }) =>
						({ colSpan: colSpan, rColIdx: rColIdx })
					)
				}]
			});
		}

		setAttributes({ [section]: [] });
	}

	renderSection(section) {
		const { baseClass, attributes } = this.props;
		const { selectedCell, selectedSection, multiSelected } = this.state;

		return attributes[section].map(({ cells }, rIndex) => (
			<tr key={ rIndex }>
				{ cells.map(({ value, colSpan, rowSpan, rColIdx, styles }, cIndex) => {
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
						isSelected = this.inRange( rIndex, rColIdx ) && isEqual( section, selectedSection );
					}

					if ( this.isMultiSelected() ) {
						isSelected = this.inMulti( rIndex, cIndex ) && isEqual( multiSelected[0].section, section );
					}

					return (
						<td
							key={ cIndex }
							{ ...isSelected ? { className: 'selected' } : {} }
							colSpan={ colSpan }
							rowSpan={ rowSpan }
							style={ $.isPlainObject( styles ) ? styles : this.getParsedStyles( styles ) }
							onClick={ event => {
								if ( event.shiftKey ) {

									const { rangeSelected } = this.state;
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
								value={ value }
								onChange={ value => this.updateTableValue( value ) }
								unstableOnFocus={ () => {
									this.setState({
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

		const { isPreview } = this.props.attributes;

		if ( !isPreview ) {
			return this.renderInitTableForm();
		}

		const { baseClass } = this.props;
		const { head, foot, hasFixedLayout, tableCollapsed } = this.props.attributes;

		const { getCellStyle, toggleSection } = this;
		const { updateCellsStyles, getSelectedCell } = this;
		const { isRangeSelected, isMultiSelected } = this;

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
					...{ getCellStyle },
					...{ toggleSection },
					...{ updateCellsStyles },
					...{ getSelectedCell },
					...{ isRangeSelected },
					...{ isMultiSelected },
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
			</>
		);
	}
}

export default GetwidTable;