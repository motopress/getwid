/**
 * External dependencies
 */
import { __ } from 'wp.i18n';
import { isEqual } from 'lodash';

/**
* Internal dependencies
*/
import GetwidCustomColorPalette from 'GetwidControls/custom-color-palette';
import { renderBorderSettingPanel } from 'GetwidUtils/render-inspector';

/**
* WordPress dependencies
*/
const { Component } = wp.element;
const { InspectorControls } = wp.blockEditor || wp.editor;
const { ToggleControl, RangeControl, SelectControl, PanelBody, Button } = wp.components;

const { jQuery: $ } = window;

/**
* Create an Component
*/
class Inspector extends Component {
	constructor() {
		super(...arguments);
	}

	isBorderActive(styles) {
		if ( !styles ) return false;

		const { getParsedStyles } = this.props;

		styles = $.isPlainObject( styles )
			? styles
			: getParsedStyles( styles );

		const { borderColor } = styles;
		const { borderTopColor, borderRightColor } = styles;
		const { borderBottomColor, borderLeftColor } = styles;

		return borderColor
			|| borderTopColor
			|| borderRightColor
			|| borderBottomColor
			|| borderLeftColor;
	}

	isShowBorderSettigs(styles) {
		const {
			inRange,
			inMulti,

			selectedSection,
			getSelectedCell,

			isRangeSelected,
			isMultiSelected
		} = this.props;

		const section = this.props.attributes[selectedSection];
		const selectedCell = getSelectedCell();

		let isShow = false;
		if ( selectedCell && !!this.isBorderActive( styles ) ) {
			isShow = true;
		} else if ( isRangeSelected() ) {
			section.every( ({ cells }, rIndex) => {
				isShow = cells.every( ({ styles, minColIdx, maxColIdx }) => {
					if ( inRange( rIndex, minColIdx, maxColIdx ) ) {
						return !!this.isBorderActive( styles );
					}
					return true;
				} );
				if ( !isShow ) return false;
				return true;
			});
		} else if ( isMultiSelected() ) {
			section.every( ({ cells }, rIndex) => {
				isShow = cells.every( ({ styles }, cIndex) => {
					if ( inMulti( rIndex, cIndex ) ) {
						return !!this.isBorderActive( styles );
					}
					return true;
				} );
				if ( !isShow ) return false;
				return true;
			});
		}
		return isShow;
	}

	render() {
		const {
			attributes: {
				head,
				foot,
				tableLayout,
				borderCollapse,
				horizontalAlign,
				verticalAlign
			},
			getCellStyle,
			toggleSection,
			updateCellsStyles,
			getSelectedCell,
			changeState,

			isRangeSelected,
			isMultiSelected,

			textColor,
			backgroundColor,
			setTextColor,
			setBackgroundColor,

			customBackgroundColor,
			customTextColor,

			setAttributes
		} = this.props;

		const selectedCell = getSelectedCell();
		const styles = selectedCell
			? selectedCell.styles
			: undefined;

		const borderColor = selectedCell
			? selectedCell.borderColor
			: '#000';

		const cellHorizontalAlign = getCellStyle( 'textAlign' )
			? getCellStyle( 'textAlign' )
			: 'default';

		const cellVerticalAlign = getCellStyle( 'verticalAlign' )
			? getCellStyle( 'verticalAlign' )
			: 'default';

		return (
			<InspectorControls>
				{ (!selectedCell && !isRangeSelected() && !isMultiSelected()) && (
					<PanelBody title={ __( 'Table Settings', 'getwid' ) } initialOpen={true}>
						<SelectControl
							label={__( 'Table Layout', 'getwid' )}
							value={ tableLayout }
							options={[
								{ label: __( 'Default', 'getwid' ), value: '' },
								{ label: __( 'Auto'   , 'getwid' ), value: 'auto'  },
								{ label: __( 'Fixed'  , 'getwid' ), value: 'fixed' }
							]}
							onChange={ value => setAttributes({
								tableLayout: value
							}) }
						/>
						<SelectControl
							label={__( 'Border Collapse', 'getwid' )}
							value={ borderCollapse }
							options={[
								{ label: __( 'Default' , 'getwid' ), value: '' },
								{ label: __( 'Collapse', 'getwid' ), value: 'collapse' },
								{ label: __( 'Separate', 'getwid' ), value: 'separate' }
							]}
							onChange={ value => setAttributes({
								borderCollapse: value
							}) }
						/>
						<ToggleControl
							label={ __( 'Table Header', 'getwid' ) }
							checked={ !!head.length }
							onChange={ () => toggleSection( 'head' ) }
						/>
						<ToggleControl
							label={ __( 'Table Footer', 'getwid' ) }
							checked={ !!foot.length }
							onChange={ () => toggleSection( 'foot' ) }
						/>
						<GetwidCustomColorPalette
							colorSettings={[{
									title: __( 'Background Color', 'getwid' ),
									colors: {
										customColor: customBackgroundColor,
										defaultColor: backgroundColor
									},
									changeColor: setBackgroundColor
								}, {
									title: __( 'Text Color', 'getwid' ),
									colors: {
										customColor: customTextColor,
										defaultColor: textColor
									},
									changeColor: setTextColor
								}
							]}
						/>
						<SelectControl
							label={ __( 'Horizontal Alignment', 'getwid' ) }
							value={ horizontalAlign }
							options={ [
								{ label: __( 'Default'      , 'getwid' ), value: '' },
								{ label: __( 'Left'   , 'getwid' ), value: 'left'    },
								{ label: __( 'Center' , 'getwid' ), value: 'center'  },
								{ label: __( 'Right'  , 'getwid' ), value: 'right'   },
								{ label: __( 'Justify', 'getwid' ), value: 'justify' }
							] }
							onChange={ value => setAttributes({
								horizontalAlign: value
							}) }
						/>
						<SelectControl
							label={__( 'Vertical Alignment', 'getwid' )}
							value={ verticalAlign }
							options={ [
								{ label: __( 'Default'     , 'getwid' ), value: '' },
								{ label: __( 'Top'   , 'getwid' ), value: 'top'     },
								{ label: __( 'Middle', 'getwid' ), value: 'middle'  },
								{ label: __( 'Bottom', 'getwid' ), value: 'bottom'  }
							] }
							onChange={ value => setAttributes({
								verticalAlign: value
							}) }
						/>
					</PanelBody>
				) }

				{ (selectedCell || isRangeSelected() || isMultiSelected()) && (
					<>
						<PanelBody>
							<Button
								isPrimary
								onClick={ () => changeState({
									selectedCell: null,
									rangeSelected: null,
									multiSelected: null
								}) }
							>
								{ __( 'Table Settings', 'getwid' ) }
							</Button>
						</PanelBody>
						<PanelBody title={ __( 'Cell Settings', 'getwid' ) } initialOpen={true}>

							<GetwidCustomColorPalette
								colorSettings={[
									{
										title: __( 'Background Color', 'getwid' ),
										colors: {
											customColor: getCellStyle( 'backgroundColor' )
										},
										changeColor: value => updateCellsStyles({
											backgroundColor: value
										})
									}, {
										title: __( 'Text Color', 'getwid' ),
										colors: {
											customColor: getCellStyle( 'color' )
										},
										changeColor: value => updateCellsStyles({
											color: value
										})
									}
								]}
							/>

							{ renderBorderSettingPanel( this ) }

							{ this.isShowBorderSettigs( styles ) && (
								<>
									<SelectControl
										label={ __( 'Border Style', 'getwid' ) }
										value={ getCellStyle( 'borderStyle' ) }
										options={ [
											{ label: __( 'Solid' , 'getwid' ), value: 'solid'  },
											{ label: __( 'Dashed', 'getwid' ), value: 'dashed' },
											{ label: __( 'Dotted', 'getwid' ), value: 'dotted' }
										] }
										onChange={ value => updateCellsStyles({
											borderStyle: value
										}) }
									/>
									<RangeControl
										label={ __( 'Border Width', 'getwid' ) }
										value={ getCellStyle( 'borderWidth' ) || 0 }
										min={0}
										max={10}
										onChange={ value => updateCellsStyles({
											borderWidth: value
										}) }
									/>
									<GetwidCustomColorPalette
										colorSettings={[
											{
												title: __( 'Border Color', 'getwid' ),
												colors: {
													customColor: !isEqual( borderColor, '#000' )
														? borderColor
														: undefined
												},
												changeColor: value => updateCellsStyles({
													borderColor: value
												})
											}
										]}
									/>
								</>
							)}
							<RangeControl
								label={ __( 'Padding Top', 'getwid' ) }
								value={ getCellStyle( 'paddingTop' ) || 0 }
								min={ 0 }
								max={ 100 }
								onChange={ value => updateCellsStyles({
									paddingTop: value
								}) }
							/>
							<RangeControl
								label={ __( 'Padding Right', 'getwid' ) }
								value={ getCellStyle( 'paddingRight' ) || 0 }
								min={ 0 }
								max={ 100 }
								onChange={ value => updateCellsStyles({
									paddingRight: value
								}) }
							/>
							<RangeControl
								label={ __( 'Padding Bottom', 'getwid' ) }
								value={ getCellStyle( 'paddingBottom' ) || 0 }
								min={ 0 }
								max={ 100 }
								onChange={ value => updateCellsStyles({
									paddingBottom: value
								}) }
							/>
							<RangeControl
								label={ __( 'Padding Left', 'getwid' ) }
								value={ getCellStyle( 'paddingLeft' ) || 0 }
								min={ 0 }
								max={ 100 }
								onChange={ value => updateCellsStyles({
									paddingLeft: value
								}) }
							/>
							<SelectControl
								label={ __( 'Horizontal Alignment', 'getwid' ) }
								value={ cellHorizontalAlign }
								options={ [
									{ label: __( 'Default'      , 'getwid' ), value: 'default' },
									{ label: __( 'Left'   , 'getwid' ), value: 'left'    },
									{ label: __( 'Center' , 'getwid' ), value: 'center'  },
									{ label: __( 'Right'  , 'getwid' ), value: 'right'   },
									{ label: __( 'Justify', 'getwid' ), value: 'justify' }
								] }
								onChange={ value => updateCellsStyles({
									textAlign: value
								}) }
							/>
							<SelectControl
								label={__( 'Vertical Alignment', 'getwid' )}
								value={ verticalAlign }
								options={ [
									{ label: __( 'Default'     , 'getwid' ), value: 'default' },
									{ label: __( 'Top'   , 'getwid' ), value: 'top'     },
									{ label: __( 'Middle', 'getwid' ), value: 'middle'  },
									{ label: __( 'Bottom', 'getwid' ), value: 'bottom'  }
								] }
								onChange={ value => updateCellsStyles({
									verticalAlign: value
								}) }
							/>
						</PanelBody>
					</>
				) }
			</InspectorControls>
		);
	}
}

export default Inspector;