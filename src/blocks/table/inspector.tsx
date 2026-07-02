import { InspectorControls, withColors } from '@wordpress/block-editor';
import {
	Button,
	PanelBody,
	RangeControl,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { CustomColorPalette, Notice } from 'getwid-components';

import TableBorderControl from '../../components/table-border-control';

import type {
	BorderTarget,
	TableEditProps,
	TableSectionName,
	TableSelectionCell,
} from './types';
import { getBorderColor } from './utils';

type InspectorProps = TableEditProps & {
	getCellStyle: ( style: string ) => string | number | undefined;
	toggleSection: ( section: TableSectionName ) => void;
	updateCellsStyles: (
		style: Record< string, string | number | undefined >
	) => void;
	getSelectedCell: () => TableSelectionCell | null;
	isRangeSelected: () => boolean;
	isMultiSelected: () => boolean;
	clearSelection: () => void;
	selectedSection: TableSectionName | null;
};

function Inspector( props: InspectorProps ) {
	const {
		attributes,
		getCellStyle,
		toggleSection,
		updateCellsStyles,
		getSelectedCell,
		isRangeSelected,
		isMultiSelected,
		clearSelection,
		textColor,
		backgroundColor,
		setTextColor,
		setBackgroundColor,
		setAttributes,
	} = props;
	const {
		head,
		foot,
		tableLayout,
		borderCollapse,
		horizontalAlign,
		verticalAlign,
		customBackgroundColor,
		customTextColor,
	} = attributes;
	const selectedCell = getSelectedCell();
	const rangeSelected = isRangeSelected();
	const multiSelected = isMultiSelected();
	const styles = selectedCell?.styles;
	const borderColor = getCellStyle( 'borderColor' );

	function controlsHint() {
		return (
			<Notice>
				{ __(
					'Hint: Hold Ctrl/Cmd key to select multiple cells. Hold Shift key to select range.',
					'getwid'
				) }
			</Notice>
		);
	}

	function isBorderActive( nextStyles?: CellStyleObject ) {
		return !! (
			nextStyles?.borderColor ||
			nextStyles?.borderTopColor ||
			nextStyles?.borderRightColor ||
			nextStyles?.borderBottomColor ||
			nextStyles?.borderLeftColor
		);
	}

	return (
		<InspectorControls>
			{ ! selectedCell && ! rangeSelected && ! multiSelected && (
				<PanelBody
					title={ __( 'Table Settings', 'getwid' ) }
					initialOpen
				>
					{ controlsHint() }
					<SelectControl
						label={ __( 'Table Layout', 'getwid' ) }
						value={ tableLayout || '' }
						options={ [
							{ value: '', label: __( 'Default', 'getwid' ) },
							{ value: 'auto', label: __( 'Auto', 'getwid' ) },
							{ value: 'fixed', label: __( 'Fixed', 'getwid' ) },
						] }
						onChange={ ( value ) =>
							setAttributes( { tableLayout: value } )
						}
					/>
					<SelectControl
						label={ __( 'Border Collapse', 'getwid' ) }
						value={ borderCollapse || '' }
						options={ [
							{ value: '', label: __( 'Default', 'getwid' ) },
							{
								value: 'collapse',
								label: __( 'Collapse', 'getwid' ),
							},
							{
								value: 'separate',
								label: __( 'Separate', 'getwid' ),
							},
						] }
						onChange={ ( value ) =>
							setAttributes( { borderCollapse: value } )
						}
					/>
					<ToggleControl
						label={ __( 'Table Header', 'getwid' ) }
						checked={ !! head.length }
						onChange={ () => toggleSection( 'head' ) }
					/>
					<ToggleControl
						label={ __( 'Table Footer', 'getwid' ) }
						checked={ !! foot.length }
						onChange={ () => toggleSection( 'foot' ) }
					/>
					<CustomColorPalette
						colorSettings={ [
							{
								title: __( 'Background Color', 'getwid' ),
								colors: {
									customColor: customBackgroundColor,
									defaultColor: backgroundColor,
								},
								changeColor: setBackgroundColor,
							},
							{
								title: __( 'Text Color', 'getwid' ),
								colors: {
									customColor: customTextColor,
									defaultColor: textColor,
								},
								changeColor: setTextColor,
							},
						] }
					/>
					<SelectControl
						label={ __( 'Horizontal Alignment', 'getwid' ) }
						value={ horizontalAlign || '' }
						options={ [
							{ value: '', label: __( 'Default', 'getwid' ) },
							{ value: 'left', label: __( 'Left', 'getwid' ) },
							{
								value: 'center',
								label: __( 'Center', 'getwid' ),
							},
							{ value: 'right', label: __( 'Right', 'getwid' ) },
						] }
						onChange={ ( value ) =>
							setAttributes( { horizontalAlign: value } )
						}
					/>
					<SelectControl
						label={ __( 'Vertical Alignment', 'getwid' ) }
						value={ verticalAlign || '' }
						options={ [
							{ value: '', label: __( 'Default', 'getwid' ) },
							{ value: 'top', label: __( 'Top', 'getwid' ) },
							{
								value: 'middle',
								label: __( 'Middle', 'getwid' ),
							},
							{
								value: 'bottom',
								label: __( 'Bottom', 'getwid' ),
							},
						] }
						onChange={ ( value ) =>
							setAttributes( { verticalAlign: value } )
						}
					/>
				</PanelBody>
			) }

			{ ( selectedCell || rangeSelected || multiSelected ) && (
				<>
					<PanelBody>
						{ controlsHint() }
						<Button variant="primary" onClick={ clearSelection }>
							{ __( 'Table Settings', 'getwid' ) }
						</Button>
					</PanelBody>
					<PanelBody
						title={ __( 'Cell Settings', 'getwid' ) }
						initialOpen
					>
						<SelectControl
							label={ __( 'Horizontal Alignment', 'getwid' ) }
							value={ String(
								getCellStyle( 'textAlign' ) || ''
							) }
							options={ [
								{ value: '', label: __( 'Default', 'getwid' ) },
								{
									value: 'left',
									label: __( 'Left', 'getwid' ),
								},
								{
									value: 'center',
									label: __( 'Center', 'getwid' ),
								},
								{
									value: 'right',
									label: __( 'Right', 'getwid' ),
								},
							] }
							onChange={ ( value ) =>
								updateCellsStyles( { textAlign: value } )
							}
						/>
						<SelectControl
							label={ __( 'Vertical Alignment', 'getwid' ) }
							value={ String(
								getCellStyle( 'verticalAlign' ) || ''
							) }
							options={ [
								{ value: '', label: __( 'Default', 'getwid' ) },
								{ value: 'top', label: __( 'Top', 'getwid' ) },
								{
									value: 'middle',
									label: __( 'Middle', 'getwid' ),
								},
								{
									value: 'bottom',
									label: __( 'Bottom', 'getwid' ),
								},
							] }
							onChange={ ( value ) =>
								updateCellsStyles( { verticalAlign: value } )
							}
						/>
						<CustomColorPalette
							colorSettings={ [
								{
									title: __( 'Background Color', 'getwid' ),
									colors: {
										customColor: String(
											getCellStyle( 'backgroundColor' ) ||
												''
										),
									},
									changeColor: ( value ) =>
										updateCellsStyles( {
											backgroundColor: value,
										} ),
								},
								{
									title: __( 'Text Color', 'getwid' ),
									colors: {
										customColor: String(
											getCellStyle( 'color' ) || ''
										),
									},
									changeColor: ( value ) =>
										updateCellsStyles( { color: value } ),
								},
							] }
						/>

						<TableBorderControl
							disabled={
								! selectedCell &&
								! rangeSelected &&
								! multiSelected
							}
							onChange={ ( target: BorderTarget ) =>
								updateCellsStyles( { setBorder: target } )
							}
						/>

						{ isBorderActive( styles ) && (
							<>
								<SelectControl
									label={ __( 'Border Style', 'getwid' ) }
									value={ String(
										getCellStyle( 'borderStyle' ) || 'solid'
									) }
									options={ [
										{
											value: 'solid',
											label: __( 'Solid', 'getwid' ),
										},
										{
											value: 'dashed',
											label: __( 'Dashed', 'getwid' ),
										},
										{
											value: 'dotted',
											label: __( 'Dotted', 'getwid' ),
										},
									] }
									onChange={ ( value ) =>
										updateCellsStyles( {
											borderStyle: value,
										} )
									}
								/>
								<RangeControl
									label={ __( 'Border Width', 'getwid' ) }
									value={ Number(
										getCellStyle( 'borderWidth' ) || 0
									) }
									min={ 0 }
									max={ 10 }
									onChange={ ( value ) =>
										updateCellsStyles( {
											borderWidth: value ?? 0,
										} )
									}
								/>
								<CustomColorPalette
									colorSettings={ [
										{
											title: __(
												'Border Color',
												'getwid'
											),
											colors: {
												customColor:
													borderColor &&
													borderColor !== '#000'
														? String( borderColor )
														: undefined,
											},
											changeColor: ( value ) =>
												updateCellsStyles( {
													borderColor:
														value ||
														getBorderColor(
															styles
														),
												} ),
										},
									] }
								/>
							</>
						) }

						<RangeControl
							label={ __( 'Padding Top', 'getwid' ) }
							value={ Number(
								getCellStyle( 'paddingTop' ) || 0
							) }
							min={ 0 }
							max={ 100 }
							onChange={ ( value ) =>
								updateCellsStyles( {
									paddingTop: value
										? `${ value }px`
										: undefined,
								} )
							}
						/>
						<RangeControl
							label={ __( 'Padding Right', 'getwid' ) }
							value={ Number(
								getCellStyle( 'paddingRight' ) || 0
							) }
							min={ 0 }
							max={ 100 }
							onChange={ ( value ) =>
								updateCellsStyles( {
									paddingRight: value
										? `${ value }px`
										: undefined,
								} )
							}
						/>
						<RangeControl
							label={ __( 'Padding Bottom', 'getwid' ) }
							value={ Number(
								getCellStyle( 'paddingBottom' ) || 0
							) }
							min={ 0 }
							max={ 100 }
							onChange={ ( value ) =>
								updateCellsStyles( {
									paddingBottom: value
										? `${ value }px`
										: undefined,
								} )
							}
						/>
						<RangeControl
							label={ __( 'Padding Left', 'getwid' ) }
							value={ Number(
								getCellStyle( 'paddingLeft' ) || 0
							) }
							min={ 0 }
							max={ 100 }
							onChange={ ( value ) =>
								updateCellsStyles( {
									paddingLeft: value
										? `${ value }px`
										: undefined,
								} )
							}
						/>
					</PanelBody>
				</>
			) }
		</InspectorControls>
	);
}

export default withColors( 'backgroundColor', { textColor: 'color' } )(
	Inspector
);
