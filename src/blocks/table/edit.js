/**
* Internal dependencies
*/
import Inspector from './inspector';
import Table from './table';
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
		const { attributes, setAttributes } = this.props;

		[ 'head', 'body', 'foot' ].forEach( section => {
			if ( !attributes[section].length ) {
				return null;
			}

			setAttributes({
				[section]: this.table.calculateIndices(
					attributes[section]
				)
			} )
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
				indexRange
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
				selectedCell
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
				selectedCell
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
					position
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
				selectedCell
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

	deleteCellStyle(rIndex, cIndex, style) {
		const { clientId } = this.props;
		const { selectedSection: section } = this.state;
		
		const $block = $( `#block-${clientId}` );

		$block.find( `t${section}` )
			.find( 'tr' ).eq( rIndex )
			.find( isEqual( section, 'head' ) ? 'th' : 'td' ).eq( cIndex )
			.css( style );
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
							changeStyle = this.inRange( rIndex, cell.minColIdx, cell.maxColIdx );
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
								return `border${border.replace( /^[^\*]/g, char => char.toUpperCase() )}Color`;
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
										this.deleteCellStyle( rIndex, cIndex, { borderColor: '' } );
										delete styles.borderColor;
									} else {
										return cell;
									}
								}

								switch ( style.setBorder ) {
									case 'top':
										if ( styles && styles.borderTopColor ) {
											this.deleteCellStyle( rIndex, cIndex, { borderTopColor: '' } );
											delete styles.borderTopColor;
										} else {
											styles = {
												...styles,
												borderTopColor: borderColor
											};
										}
										break;
									case 'right':
										if ( styles && styles.borderRightColor ) {
											this.deleteCellStyle( rIndex, cIndex, { borderRightColor: '' } );
											delete styles.borderRightColor;
										} else {
											styles = {
												...styles,
												borderRightColor: borderColor
											};
										}
										break;
									case 'bottom':
										if ( styles && styles.borderBottomColor ) {
											this.deleteCellStyle( rIndex, cIndex, { borderBottomColor: '' } );
											delete styles.borderBottomColor;
										} else {
											styles = {
												...styles,
												borderBottomColor: borderColor
											};
										}
										break;
									case 'left':
										if ( styles && styles.borderLeftColor ) {
											this.deleteCellStyle( rIndex, cIndex, { borderLeftColor: '' } );
											delete styles.borderLeftColor;
										} else {
											styles = {
												...styles,
												borderLeftColor: borderColor
											};
										}
										break;
									case 'all':
										if ( styles ) {
											[ 'top', 'right', 'bottom', 'left' ].forEach( border => {
												delete styles[getStyle( border )];
											} );
										}
										
										styles = {
											...styles,
											borderColor: borderColor
										};
										break;
									case 'none':
										if ( styles && styles.borderStyle ) {
											delete styles.borderStyle;
										}

										if ( styles && styles.borderWidth ) {
											delete styles.borderWidth;
										}

										[ 'borderStyle', 'borderWidth' ].forEach( style => {
											this.deleteCellStyle(
												rIndex,
												cIndex,
												{ [style]: '' }
											);
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
					<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 512 512" space="preserve">
						<path d="M511.8,145.1V60.2c0-33.1-26.9-60-60-60H60.2c-33.1,0-60,26.9-60,60v84.9h40V60.2c0-11,9-20,20-20H236v431.7H60.2 c-11,0-20-9-20-20v-85.9h-40v85.9c0,33.1,26.9,60,60,60h391.7c33.1,0,60-26.9,60-60v-85.9h-40v85.9c0,11-9,20-20,20H276V40.2h175.9 c11,0,20,9,20,20v84.9L511.8,145.1L511.8,145.1z"/>
						<polygon points="410,153.9 381.8,182.2 435.6,236 318,236 318,276 436,276 381.7,330.9 410.1,359 512,255.9 "/>
						<polygon points="194.1,236 76.4,236 130.2,182.2 102,153.9 0,255.9 101.9,359 130.3,330.9 76,276 194.1,276 "/>
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

	inRange(rIndex, minColIdx, maxColIdx) {
		const { indexRange } = this.state;
		const { minRowIdx, maxRowIdx } = indexRange;

		return rIndex >= minRowIdx
			&& rIndex <= maxRowIdx
			&& minColIdx >= indexRange.minColIdx
			&& maxColIdx <= indexRange.maxColIdx;
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
			this.calculateBoundaryIndices();
			this.setState({ updated: false });
		}

		//console.log( this.props.attributes[ 'body' ] );
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
				{ cells.map(({ content, colSpan, rowSpan, minColIdx, maxColIdx , styles }, cIndex) => {
					const Tag = isEqual( section, 'head' ) ? 'th' : 'td';

					const cell = {
						rowIdx: rIndex,
						columnIdx: cIndex,
						rowSpan: rowSpan,
						colSpan: colSpan,
						minColIdx: minColIdx,
						maxColIdx: maxColIdx,
						section: section
					};

					let isSelected = selectedCell
						&& isEqual( rIndex, selectedCell.rowIdx )
						&& isEqual( cIndex, selectedCell.columnIdx )
						&& isEqual( section, selectedSection );

					if ( this.isRangeSelected() ) {
						isSelected = this.inRange( rIndex, minColIdx, maxColIdx )
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
										toRowSpan: rowSpan ? parseInt( rowSpan ) : 1,
										toMinColIdx: minColIdx,
										toMaxColIdx: maxColIdx,
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
												fromRowSpan: rowSpan ? parseInt( rowSpan ) : 1,
												fromMinColIdx: minColIdx,
												fromMaxColIdx: maxColIdx,
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
			getParsedStyles,
			changeState
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
					changeState,
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