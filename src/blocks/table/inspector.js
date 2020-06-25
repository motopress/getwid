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
			isMultiSelected,
			getIndices
		} = this.props;

		const rangeSelected = isRangeSelected();
		const multiSelected = isMultiSelected();

		const selectedCell = getSelectedCell();
		const section = this.props.attributes[selectedSection];

		let isShow = false;
		if ( selectedCell && !!this.isBorderActive( styles ) ) {
			isShow = true;
		} else if ( rangeSelected || multiSelected ) {
			section.every( ({ cells }, rIndex) => {
				isShow = cells.every( (cell, cIndex) => {
					if ( inRange( rIndex, getIndices( selectedSection, rIndex, cIndex ) ) || inMulti( rIndex, cIndex ) ) {
						return !!this.isBorderActive( cell.styles );
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
		const borderColor = getCellStyle( 'borderColor' );

		const styles = selectedCell
			? selectedCell.styles
			: undefined;

		return (
			<InspectorControls>
				{ (!selectedCell && !isRangeSelected() && !isMultiSelected()) && (
					<PanelBody title={ __( 'Table Settings', 'getwid' ) } initialOpen={true}>
						<SelectControl
							label={__( 'Table Layout', 'getwid' )}
							value={ tableLayout }
							options={[
								{ value: ''     , label: __( 'Default', 'getwid' ) },
								{ value: 'auto' , label: __( 'Auto'   , 'getwid' ) },
								{ value: 'fixed', label: __( 'Fixed'  , 'getwid' ) }
							]}
							onChange={ value => setAttributes({
								tableLayout: value
							}) }
						/>
						<SelectControl
							label={__( 'Border Collapse', 'getwid' )}
							value={ borderCollapse }
							options={[
								{ value: ''        , label: __( 'Default' , 'getwid' ) },
								{ value: 'collapse', label: __( 'Collapse', 'getwid' ) },
								{ value: 'separate', label: __( 'Separate', 'getwid' ) }
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
							value={ horizontalAlign ? horizontalAlign : '' }
							options={ [
								{ value: ''      , label: __( 'Default', 'getwid' ) },
								{ value: 'left'  , label: __( 'Left'   , 'getwid' ) },
								{ value: 'center', label: __( 'Center' , 'getwid' ) },
								{ value: 'right' , label: __( 'Right'  , 'getwid' ) }
							] }
							onChange={ value => setAttributes({
								horizontalAlign: value
							}) }
						/>
						<SelectControl
							label={__( 'Vertical Alignment', 'getwid' )}
							value={ verticalAlign ? verticalAlign : '' }
							options={ [
								{ value: ''      , label: __( 'Default', 'getwid' ) },
								{ value: 'top'   , label: __( 'Top'    , 'getwid' ) },
								{ value: 'middle', label: __( 'Middle' , 'getwid' ) },
								{ value: 'bottom', label: __( 'Bottom' , 'getwid' ) }
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
							<SelectControl
								label={ __( 'Horizontal Alignment', 'getwid' ) }
								value={ getCellStyle( 'textAlign' ) ? getCellStyle( 'textAlign' ) : '' }
								options={ [
									{ value: ''      , label: __( 'Default', 'getwid' ) },
									{ value: 'left'  , label: __( 'Left'   , 'getwid' ) },
									{ value: 'center', label: __( 'Center' , 'getwid' ) },
									{ value: 'right' , label: __( 'Right'  , 'getwid' ) }
								] }
								onChange={ value => updateCellsStyles({
									textAlign: value
								}) }
							/>
							<SelectControl
								label={__( 'Vertical Alignment', 'getwid' )}
								value={ getCellStyle( 'verticalAlign' ) ? getCellStyle( 'verticalAlign' ) : '' }
								options={ [
									{ value: ''      , label: __( 'Default', 'getwid' ) },
									{ value: 'top'   , label: __( 'Top'    , 'getwid' ) },
									{ value: 'middle', label: __( 'Middle' , 'getwid' ) },
									{ value: 'bottom', label: __( 'Bottom' , 'getwid' ) }
								] }
								onChange={ value => updateCellsStyles({
									verticalAlign: value
								}) }
							/>
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
											{ value: 'solid' , label: __( 'Solid' , 'getwid' ) },
											{ value: 'dashed', label: __( 'Dashed', 'getwid' ) },
											{ value: 'dotted', label: __( 'Dotted', 'getwid' ) }
										] }
										onChange={ value => updateCellsStyles({
											borderStyle: value
										}) }
									/>
									<RangeControl
										label={ __( 'Border Width', 'getwid' ) }
										value={ getCellStyle( 'borderWidth' ) || '' }
										min={1}
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
								value={ getCellStyle( 'paddingTop' ) || '' }
								min={0}
								max={100}
								onChange={ value => updateCellsStyles({
									paddingTop: value
								}) }
							/>
							<RangeControl
								label={ __( 'Padding Right', 'getwid' ) }
								value={ getCellStyle( 'paddingRight' ) || '' }
								min={0}
								max={100}
								onChange={ value => updateCellsStyles({
									paddingRight: value
								}) }
							/>
							<RangeControl
								label={ __( 'Padding Bottom', 'getwid' ) }
								value={ getCellStyle( 'paddingBottom' ) || '' }
								min={0}
								max={100}
								onChange={ value => updateCellsStyles({
									paddingBottom: value
								}) }
							/>
							<RangeControl
								label={ __( 'Padding Left', 'getwid' ) }
								value={ getCellStyle( 'paddingLeft' ) || '' }
								min={0}
								max={100}
								onChange={ value => updateCellsStyles({
									paddingLeft: value
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