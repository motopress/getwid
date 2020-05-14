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

		return setAttributes( {
			body: times( rowCount, () => ( {
				cells: times( columnCount, () => ( {
					content: ''
				} ) )
			} ) ),
			isPreview: true
		} );
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
		return [
			{
				icon: 'randomize',
				title: __( 'Merge Cells', 'getwid' ),
				isDisabled: !this.isRangeSelected(),
				onClick: () => this.mergeCells()
			}
		];
	}

	isRangeSelected() {
		const { rangeSelected } = this.state;
		return rangeSelected && rangeSelected.toCell;
	}

	updateTableValue(content) {
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
							content
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
					cells: cells.map( (cell, cIndex) => {
						cell.rColumnIndex = cIndex;
		
						const prevRows = body.filter( (row, index) => index < rIndex );
						if ( prevRows.length ) {
							prevRows.forEach( ({ cells }, index) => {
								cells.forEach( ({ rowSpan, colSpan, rColumnIndex }) => {
									if ( colSpan && rowSpan ) {
										if ( (parseInt( rowSpan ) + index > rIndex) && rColumnIndex <= cell.rColumnIndex ) {
											cell.rColumnIndex += parseInt( colSpan );
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

		const _this = this;
		setAttributes({
			body: body.map( ({ cells }, rIndex) => {
				if ( rIndex < minRowIndex && rIndex > maxRowIndex ) {
					return { cells }
				}

				const row = cells.map( (cell, cIndex) => {
					if ( isEqual( rIndex, minRowIndex ) && isEqual( cell.rColumnIndex, minColumnIndex ) ) {
						const rowSpan = Math.abs( maxRowIndex - minRowIndex ) + 1;
						const colSpan = Math.abs( maxColumnIndex - minColumnIndex ) + 1;

						return {
							...cell,
							rowSpan: rowSpan > 1 ? rowSpan : undefined,
							colSpan: colSpan > 1 ? colSpan : undefined
						}
					}
					return cell;
				} );

				return {
					cells: row.filter( ({ rColumnIndex }) => isEqual( rIndex, minRowIndex ) && isEqual( rColumnIndex, minColumnIndex ) || !_this.inRange( rIndex, rColumnIndex ) )
				}
			} )
		});

		this.setState( {
			rangeSelected: null,
			updated: true
		} );
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
										{ cells.map(({ content, colSpan, rowSpan, rColumnIndex }, cIndex) => {
											const cell = {
												rowIndex: rIndex,
												columnIndex: cIndex
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
														value={ content }
														onChange={ value => _this.updateTableValue( value ) }
														unstableOnFocus={ () => _this.setState({ selectedCell: cell }) }
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