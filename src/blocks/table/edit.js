/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import classnames from 'classnames';
import { times, has, head, isEqual, isEmpty, every } from 'lodash';

/**
* Internal dependencies
*/
import Inspector from './inspector';
import Table from './table';

import './editor.scss';

/**
* WordPress dependencies
*/
const { compose } = wp.compose;
const { Component } = wp.element;
const { ToolbarGroup, ToolbarItem, DropdownMenu, TextControl, Button, Placeholder } = wp.components;
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
	'core/strikethrough',
	'core/text-color'
];

/**
* Create an Component
*/
class GetwidTable extends Component {

	constructor() {
		super(...arguments);

		this.getCellStyle = this.getCellStyle.bind( this );
		this.toggleSection = this.toggleSection.bind( this );
		this.changeState = this.changeState.bind( this );

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

		this.table = new Table( this.inRange );
	}

	changeState(state) {
		this.setState(state);
	}

	calculateBoundaryIndices() {
		const { attributes } = this.props;

		[ 'head', 'body', 'foot' ].forEach( section => {
			if ( !attributes[section].length ) {
				return null;
			}

			this.table.calculateIndices(
				attributes[section],
				section
			);
		} );
	}

	calculateIndexRange(toCell) {
		const { rangeSelected } = this.state;

		const { fromCell } = rangeSelected;
		const { fromRowIdx, fromRowSpan, fromMinColIdx, fromMaxColIdx } = fromCell;
		const { toRowIdx, toRowSpan, toMinColIdx, toMaxColIdx } = toCell;

		const minRowIdx = Math.min( fromRowIdx, toRowIdx );
		const maxRowIdx = Math.max( fromRowIdx + fromRowSpan - 1, toRowIdx + toRowSpan - 1 );

		const minColIdx = Math.min( fromMinColIdx, toMinColIdx );
		const maxColIdx = Math.max( fromMaxColIdx, toMaxColIdx );

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

	onMergeCells() {
		const { indexRange, selectedSection: section } = this.state;
		const { attributes, setAttributes } = this.props;

		setAttributes({
			[section]: this.table.mergeCells(
				attributes[section],
				indexRange,
				section
			)
		});

		this.setState({
			selectedCell: null,
			selectedSection: null,
			rangeSelected: null,
			updated: true
		});
	}

	onSplitMergedCells() {
		const { selectedCell, selectedSection: section } = this.state;
		const { attributes, setAttributes } = this.props;

		setAttributes({
			[section]: this.table.splitMergedCells(
				attributes[section],
				selectedCell,
				section
			)
		});

		this.setState({
			selectedCell: null,
			selectedSection: null,
			updated: true
		});
	}

	onInsertRow(position) {
		const { selectedCell, selectedSection: section } = this.state;
		const { setAttributes, attributes } = this.props;

		setAttributes({
			[section]: this.table.insertRow(
				attributes[section],
				selectedCell,
				position
			)
		});

		this.setState({
			selectedCell: null,
			selectedSection: null,
			updated: true
		});
	}

	onDeleteRow() {
		const { selectedCell, selectedSection: section } = this.state;
		const { setAttributes, attributes } = this.props;

		setAttributes({
			[section]: this.table.deleteRow(
				attributes[section],
				selectedCell,
				section
			)
		});

		this.setState({
			selectedCell: null,
			selectedSection: null,
			updated: true
		});
	}

	onInsertColumn(position) {

		const { selectedCell, selectedSection: section } = this.state;
		const { setAttributes, attributes } = this.props;

		[ 'head', 'body', 'foot' ].forEach( section =>
			setAttributes({
				[section]: this.table.insertColumn(
					attributes[section],
					selectedCell,
					position,
					section
				)
			})
		);

		this.setState({
			selectedCell: null,
			updated: true
		});
	}

	onDeleteColumn() {
		const { selectedCell } = this.state;
		const { setAttributes, attributes } = this.props;

		let sections = {};
		[ 'head', 'body', 'foot' ].forEach( section => {
			let newSection = this.table.deleteColumn(
				attributes[section],
				selectedCell,
				section
			);

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

	getStyles(cell) {
		let styles = has( cell, 'styles' )
			? cell.styles
			: undefined;
		if ( styles ) {
			if ( $.isPlainObject( styles ) ) {
				return styles;
			} else {
				styles = this.getParsedStyles( styles );
				return styles;
			}
		}
		return styles;
	}

	getStyle(cell, style) {
		const styles = this.getStyles( cell );
		return styles
			? styles[style]
			: undefined;
	}

	getCellElement(rIndex, cIndex) {
		const { clientId } = this.props;
		const { selectedSection: section } = this.state;

		const $block = $( `#block-${clientId}` );

		return $block.find( `t${section}` )
			.find( 'tr' ).eq( rIndex )
			.find( isEqual( section, 'head' ) ? 'th' : 'td' ).eq( cIndex );
	}

	getBorderColor(styles) {
		let color;
		if ( styles ) {
			const { borderColor } = styles;
			const { borderTopColor, borderRightColor } = styles;
			const { borderBottomColor, borderLeftColor } = styles;

			color = borderColor
				|| borderTopColor
				|| borderRightColor
				|| borderBottomColor
				|| borderLeftColor;
		}
		return color ? color : '#000';
	}

	getBorderWidth(styles) {
		let width;
		if ( styles ) {
			const { borderWidth } = styles;
			const { borderTopWidth, borderRightWidth } = styles;
			const { borderBottomWidth, borderLeftWidth } = styles;

			width = borderWidth
				|| borderTopWidth
				|| borderRightWidth
				|| borderBottomWidth
				|| borderLeftWidth;
		}

		return isNaN(width) ? undefined : parseInt(width);
	}

	setupBorderWidth(styles, style, getStyle) {
		if ( styles ) {
			if ( styles.borderColor ) {
				return { ...styles, ...style };
			}

			[ 'top', 'right', 'bottom', 'left' ].forEach( direction => {
				const border = getStyle( direction );
				if ( styles[`${border}Color`] ) {
					styles = {
						...styles,
						...{ [`${border}Width`]: style.borderWidth }
					}
				}
			} );
		}

		return styles;
	}

	setupBorder(styles, rIndex, cIndex, color, borderStyles ) {
		const [ borderColor, borderWidth ] = borderStyles;

		if ( styles && styles[borderColor] ) {
			this.getCellElement( rIndex, cIndex ).css({
				[borderColor]: '',
				[borderWidth]: ''
			});
			delete styles[borderColor];
			delete styles[borderWidth];
		} else {
			const width = this.getBorderWidth( styles );
			styles = {
				...styles,
				[borderColor]: color,
				...width
					? { [borderWidth]: width }
					: {}
			};

			if ( styles.borderWidth ) {
				this.getCellElement( rIndex, cIndex ).css({
					borderWidth: ''
				});
				delete styles.borderWidth;
			}
		}
		return styles;
	}

	setupAligment(styles, style, rIndex, cIndex, aligment) {
		if ( styles && styles[aligment] && isEqual( style[aligment], '' ) ) {
			delete styles[aligment];
			this.getCellElement(
				rIndex,
				cIndex
			).css({ [aligment]: '' });
		} else {
			return { ...styles, ...style };
		}
		return styles;
	}

	setupPadding(styles, style, rIndex, cIndex, padding) {
		if ( styles && styles[padding] && !style[padding] ) {
			delete styles[padding];
			this.getCellElement(
				rIndex,
				cIndex
			).css({ [padding]: '' });
		} else {
			return {
				...styles,
				...style[padding]
					? style
					: {}
			};
		}
		return styles;
	}

	getCellStyle(style) {

		const { attributes } = this.props;
		const { selectedCell, selectedSection: section } = this.state;

		const rangeSelected = this.isRangeSelected();
		const multiSelected = this.isMultiSelected();

		if ( selectedCell ) {
			const { rowIdx, columnIdx } = selectedCell;
			const cell = attributes[section][rowIdx].cells[columnIdx];

			if ( isEqual( style, 'borderWidth' ) ) {
				return this.getBorderWidth( this.getStyles( cell ) );
			}
			const value = this.getStyle( cell, style );
			return /px/.test( value )
				? parseInt( value )
				: value;
		} else if ( rangeSelected || multiSelected ) {
			let selected = [];
			attributes[section].forEach( ({ cells }, rIndex) =>
				cells.forEach( (cell, cIndex) =>
					this.inRange( rIndex, this.table.getIndices( section, rIndex, cIndex ) ) || this.inMulti( rIndex, cIndex )
						? selected = [ ...selected, cell ]
						: null
				)
			);

			let cellsStyle;
			cellsStyle = isEqual( style, 'borderWidth' )
				? this.getBorderWidth( this.getStyles( head( selected ) ) )
				: this.getStyle(
					head( selected ),
					style
				);

			let hasCommonStyle = selected.every( cell => {
				if ( cell.styles ) {
					const value = isEqual( style, 'borderWidth' )
						? this.getBorderWidth( this.getStyles( cell ) )
						: this.getStyle(
							cell,
							style
						);

					if ( isEqual( cellsStyle, value ) ) {
						cellsStyle = value;
						return true;
					} else {
						return false;
					}
				} else {
					return false;
				}
			} );
			return hasCommonStyle ? cellsStyle : undefined;
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
							changeStyle = this.inRange( rIndex, this.table.getIndices( section, rIndex, cIndex ) );
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

							const getStyle = border => {
								return `border${border.replace( /^[^\*]/g, char => char.toUpperCase() )}`;
							}

							if ( has( style, 'borderColor' ) ) {
								style.borderColor = style.borderColor
									? style.borderColor
									: '#000';

								if ( styles.borderTopColor ) {
									styles = {
										...styles,
										borderTopColor: style.borderColor
									};
								}
								if ( styles.borderRightColor ) {
									styles = {
										...styles,
										borderRightColor: style.borderColor
									};
								}
								if ( styles.borderBottomColor ) {
									styles = {
										...styles,
										borderBottomColor: style.borderColor
									};
								}
								if ( styles.borderLeftColor ) {
									styles = {
										...styles,
										borderLeftColor: style.borderColor
									};
								}
								if ( styles.borderColor ) {
									styles = {
										...styles,
										borderColor: style.borderColor
									};
								}
							} else if ( style.setBorder ) {
								const borderColor = this.getBorderColor( styles );

								if ( styles && styles.borderColor ) {
									if ( !isEqual( style.setBorder, 'all' ) ) {
										this.getCellElement( rIndex, cIndex ).css({ borderColor: '' });
										delete styles.borderColor;
									} else {
										return cell;
									}
								}

								switch ( style.setBorder ) {
									case 'top':
										styles = this.setupBorder(
											styles,
											rIndex,
											cIndex,
											borderColor,
											[
												'borderTopColor',
												'borderTopWidth'
											]
										);
										break;
									case 'right':
										styles = this.setupBorder(
											styles,
											rIndex,
											cIndex,
											borderColor,
											[
												'borderRightColor',
												'borderRightWidth'
											]
										);
										break;
									case 'bottom':
										styles = this.setupBorder(
											styles,
											rIndex,
											cIndex,
											borderColor,
											[
												'borderBottomColor',
												'borderBottomWidth'
											]
										);
										break;
									case 'left':
										styles = this.setupBorder(
											styles,
											rIndex,
											cIndex,
											borderColor,
											[
												'borderLeftColor',
												'borderLeftWidth'
											]
										);
										break;
									case 'all':
										const width = this.getBorderWidth( styles );

										if ( styles ) {
											[ 'top', 'right', 'bottom', 'left' ].forEach( border => {
												delete styles[`${getStyle( border )}Color`];
												delete styles[`${getStyle( border )}Width`];
											} );
										}

										styles = {
											...styles,
											borderColor: borderColor,
											...width
												? { borderWidth: width }
												: {}
										};
										break;
									case 'none':
										[ 'borderStyle', 'borderWidth', 'borderTopWidth', 'borderRightWidth', 'borderBottomWidth', 'borderLeftWidth' ].forEach( style => {
											if ( styles && styles[style] ) {
												delete styles[style];
											}
											this.getCellElement(
												rIndex,
												cIndex
											).css({ [style]: '' });
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
							} else if ( has( style, 'textAlign' ) ) {
								styles = this.setupAligment(
									styles,
									style,
									rIndex,
									cIndex,
									'textAlign'
								);
							} else if ( has( style, 'verticalAlign' ) ) {
								styles = this.setupAligment(
									styles,
									style,
									rIndex,
									cIndex,
									'verticalAlign'
								);
							} else if ( !isNaN(style.borderWidth) ) {
								styles = this.setupBorderWidth(
									styles,
									style,
									getStyle
								);
							} else if ( has( style, 'paddingTop' ) ) {
								styles = this.setupPadding(
									styles,
									style,
									rIndex,
									cIndex,
									'paddingTop'
								);
							} else if ( has( style, 'paddingRight' ) ) {
								styles = this.setupPadding(
									styles,
									style,
									rIndex,
									cIndex,
									'paddingRight'
								);
							} else if ( has( style, 'paddingBottom' ) ) {
								styles = this.setupPadding(
									styles,
									style,
									rIndex,
									cIndex,
									'paddingBottom'
								);
							} else if ( has( style, 'paddingLeft' ) ) {
								styles = this.setupPadding(
									styles,
									style,
									rIndex,
									cIndex,
									'paddingLeft'
								);
							} else {
								styles = { ...styles, ...style };
							}

							if ( !isEmpty( styles ) ) {
								cell.styles = styles;
							} else {
								delete cell.styles;
								this.getCellElement(
									rIndex,
									cIndex
								).removeAttr( 'style' );
							}
						}

						return cell;
					} )
				}
			} )
		});
	}
	/* #endregion */

	renderInitTableForm() {
		const { baseClass } = this.props;
		const { rowCount, columnCount } = this.state;

		return (
			<Placeholder
				label={ __( 'Table', 'getwid' ) }
				icon={ <BlockIcon icon={ 'editor-table' } showColors /> }
				instructions={ __( 'Hint: Hold Ctrl key to select multiple cells. Hold Shift key to select range.', 'getwid' ) }
			>
				<form
					className={ `${baseClass}__placeholder-form` }
					onSubmit={ () => this.onCreateTable() }
				>
					<TextControl
						type='number'
						className={ `${baseClass}__placeholder-input` }
						label={ __( 'Rows', 'getwid' ) }
						value={ rowCount }
						onChange={ value => this.setState({ rowCount: value }) }
						min='1'
					/>
					<TextControl
						type='number'
						className={ `${baseClass}__placeholder-input` }
						label={ __( 'Columns', 'getwid' ) }
						value={ columnCount }
						onChange={ value => this.setState({ columnCount: value }) }
						min='1'
					/>
					<Button
						className={ `${baseClass}__placeholder-button` }
						isPrimary
						type='submit'
					>
						{ __( 'Create', 'getwid' ) }
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
				onClick: () => this.onInsertRow( 'before' )
			},
			{
				icon: 'table-row-after',
				title: __( 'Add Row After', 'getwid' ),
				isDisabled: !selectedCell
					|| this.isRangeSelected()
					|| this.isMultiSelected(),
				onClick: () => this.onInsertRow( 'after' )
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
				onClick: () => this.onInsertColumn( 'before' )
			},
			{
				icon: 'table-col-after',
				title: __( 'Add Column After', 'getwid' ),
				isDisabled: !selectedCell
					|| this.isRangeSelected()
					|| this.isMultiSelected(),
				onClick: () => this.onInsertColumn( 'after' )
			},
			{
				icon: (
					<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 512 512" space="preserve">
						<path d="M472,317v135c0,11-9,20-20,20H313v40h139c33.1,0,60-26.9,60-60V317H472z"/>
						<path d="M452,0H313v40h139c11,0,20,9,20,20v137h40V60C512,26.9,485.1,0,452,0z"/>
						<path d="M60,472c-11,0-20-9-20-20V317H0v135c0,33.1,26.9,60,60,60h139v-40H60z"/>
						<path d="M60,0C26.9,0,0,26.9,0,60v137h40V60c0-11,9-20,20-20h139V0H60z"/>
						<polygon points="512,237 364.3,237 418.1,183.1 389.9,154.9 287.8,256.9 389.8,360.1 418.2,331.9 363.9,277 512,277 "/>
						<polygon points="122.1,154.9 93.9,183.1 147.7,237 0,237 0,277 148.1,277 93.8,331.9 122.2,360.1 224.2,256.9 "/>
					</svg>
				),
				title: __( 'Merge Cells', 'getwid' ),
				isDisabled: !this.isRangeSelected()
					|| this.isMultiSelected(),
				onClick: () => this.onMergeCells()
			},
			{
				icon: (
					<svg xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 512 512" space="preserve">
						<polygon points="194.05,236.016 76.428,236.016 130.243,182.201 101.982,153.94 0,255.92 101.902,358.98 130.322,330.878 76.045,275.984 194.05,275.984"/>
						<polygon points="410.019,153.94 381.758,182.201 435.572,236.016 317.951,236.016 317.951,275.984 435.955,275.984 381.678,330.878 410.098,358.98 512,255.92"/>

						<path d="M511.796,145.089V60.156c0-33.058-26.895-59.952-59.952-59.952H60.157c-33.058,0-59.952,26.895-59.952,59.952v84.932
							h39.968V60.156c0-11.019,8.965-19.984,19.984-19.984h175.859v431.655H60.157c-11.019,0-19.984-8.965-19.984-19.984v-85.931H0.205
							v85.931c0,33.058,26.895,59.952,59.952,59.952h391.687c33.058,0,59.952-26.895,59.952-59.952v-85.931h-39.968v85.931
							c0,11.019-8.965,19.984-19.984,19.984H275.985V40.172h175.859c11.019,0,19.984,8.965,19.984,19.984v84.932H511.796z"
						/>
					</svg>
				),
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

	inRange(rIndex, { minColIdx, maxColIdx }) {
		if ( !this.state.indexRange ) {
			return false;
		}

		const { indexRange } = this.state;
		const { minRowIdx, maxRowIdx } = indexRange;

		return rIndex >= minRowIdx
			&& rIndex <= maxRowIdx
			&& minColIdx >= indexRange.minColIdx
			&& maxColIdx <= indexRange.maxColIdx;
	}

	inMulti(rIndex, cIndex) {
		if ( !this.state.multiSelected ) {
			return false;
		}
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

		const { isSelected } = this.props;
		const { updated } = this.state;

		if ( prevProps.isSelected && !isSelected ) {
			this.setState({
				selectedCell: null,
				rangeSelected: null,
				multiSelected: null
			});
		}

		if ( updated ) {
			this.calculateBoundaryIndices();
			this.setState({ updated: false });
		}
	}

	componentDidMount() {
		this.calculateBoundaryIndices();
	}

	toggleSection(section) {
		const { selectedSection } = this.state;

		const { setAttributes } = this.props;
		const { body } = this.props.attributes;

		if ( !this.props.attributes[section].length ) {
			const [firstRow, ...rest] = body;

			const newSection = setAttributes({
				[section]: [{
					cells: firstRow.cells.map( ({ colSpan, rColIdx }) =>
						({ colSpan: colSpan, rColIdx: rColIdx })
					)
				}]
			});
			this.setState({ updated: true });
			return newSection;
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
				{ cells.map( (element, cIndex) => {
					const Tag = isEqual( section, 'head' ) ? 'th' : 'td';
					const { content, colSpan, rowSpan, styles } = element;

					const cell = {
						rowIdx: rIndex,
						columnIdx: cIndex,
						rowSpan: rowSpan,
						colSpan: colSpan,
						section: section
					};

					let isSelected = selectedCell
						&& isEqual( rIndex, selectedCell.rowIdx )
						&& isEqual( cIndex, selectedCell.columnIdx )
						&& isEqual( section, selectedSection );

					if ( this.isRangeSelected() ) {
						isSelected = this.inRange( rIndex, this.table.getIndices( section, rIndex, cIndex ) )
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
								const { minColIdx, maxColIdx } = this.table.getIndices( section, rIndex, cIndex );

								if ( event.shiftKey ) {
									const { rangeSelected } = this.state;

									if ( !rangeSelected ) return;
									if ( !isEqual( section, rangeSelected.fromCell.section ) ) {
										alert( __( 'Such type of selection is not available', 'getwid' ));
										return;
									}

									this.calculateIndexRange({
										toRowIdx: rIndex,
										toRowSpan: rowSpan ? parseInt( rowSpan ) : 1,
										toMinColIdx: minColIdx,
										toMaxColIdx: maxColIdx,
										section: section
									});
								} else if ( event.ctrlKey ) {
									const multiCells = multiSelected ? multiSelected : [];

									if ( multiCells.length && !isEqual( multiCells[0].section, section ) ) {
										alert( __( 'Such type of selection is not available', 'getwid' ));
										return;
									}

									multiCells.push( {
										...cell,
										minColIdx: minColIdx,
										maxColIdx: maxColIdx
									} );

									this.setState({
										multiSelected: multiCells,
										indexRange: null,
										rangeSelected: null,
										selectedCell: null
									});
								} else {
									this.setState({
										rangeSelected: {
											fromCell: {
												fromRowIdx: rIndex,
												fromRowSpan: rowSpan ? parseInt( rowSpan ) : 1,
												fromMinColIdx: minColIdx,
												fromMaxColIdx: maxColIdx,
												section: section
											}
										},
										multiSelected: [{
											...cell,
											minColIdx: minColIdx,
											maxColIdx: maxColIdx
										}]
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
										const { minColIdx, maxColIdx } = this.table.getIndices( section, rIndex, cIndex );

										this.setState({
											selectedCell: {
												...cell,
												minColIdx: minColIdx,
												maxColIdx: maxColIdx
											},
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
				verticalAlign,
				caption
			},
			className,
			backgroundColor,
			textColor,
			setAttributes
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
			getParsedStyles,
			changeState
		} = this;

		const getIndices = this.table.getIndices;

		return (
			<>
				<BlockControls>
					<ToolbarGroup>
						<DropdownMenu
							hasArrowIndicator
							icon='edit'
							label={ __( 'Edit Table', 'getwid' ) }
							controls={ this.getTableControlls() }
						/>
					</ToolbarGroup>
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
					changeState,
					getIndices,
					...this.props
				}} key={ 'inspector' }/>
				<div
					className={ classnames( className, {
						[ `has-table-layout-${tableLayout}` ]: tableLayout,
						[ `has-border-collapse-${borderCollapse}` ]: borderCollapse,

						[ `has-horizontal-align-${horizontalAlign}` ]: horizontalAlign,
						[ `has-vertical-align-${verticalAlign}` ]: verticalAlign
					} ) }
				>
					<table
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

					<RichText
						tagName='figcaption'
						placeholder={ __( 'Write caption…' ) }
						value={ caption }
						onChange={ value =>
							setAttributes({ caption: value })
						}
						unstableOnFocus={ () =>
							this.setState({
								selectedCell: null,
								rangeSelected: null,
								multiSelected: null
							})
						}
					/>
				</div>
			</>
		);
	}
}

export default compose([
	withColors( 'backgroundColor', { textColor: 'color' } )
])( GetwidTable );
