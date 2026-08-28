import { InspectorControls, PanelColorSettings } from '@wordpress/block-editor';
import {
	BaseControl,
	Button,
	DateTimePicker,
	Dropdown,
	PanelBody,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { date, getDate } from '@wordpress/date';
import {
	FontSizeControl,
	FontsControl,
	StyleLengthControl,
	TabsControl,
} from 'getwid-components';

import type { CountdownEditProps } from './types';

type TabName = 'general' | 'style';

export default function Inspector( props: CountdownEditProps ) {
	const [ tabName, setTabName ] = useState< TabName >( 'general' );
	const { attributes, setAttributes, textColor, setTextColor } = props;
	const {
		dateTime,
		years,
		months,
		weeks,
		days,
		hours,
		minutes,
		seconds,
		fontFamily,
		fontWeight,
		fontStyle,
		textTransform,
		lineHeight,
		letterSpacing,
		backgroundColor,
		innerPadding,
		innerSpacings,
	} = attributes;
	const defaultDate = getDate();
	const visualLabel = dateTime
		? new Date( dateTime ).toLocaleString()
		: date( 'd.m.Y, H:i:s', defaultDate );

	return (
		<InspectorControls>
			<TabsControl
				state={ tabName }
				onChangeTab={ ( nextTabName ) =>
					setTabName( nextTabName as TabName )
				}
				tabs={ [ 'general', 'style' ] }
			/>
			{ tabName === 'general' && (
				<PanelBody initialOpen>
					<BaseControl
						id=""
						label={ __( 'Time', 'getwid' ) }
						__nextHasNoMarginBottom
					>
						<Dropdown
							popoverProps={ {
								placement: 'bottom-end',
								noArrow: false,
							} }
							renderToggle={ ( { isOpen, onToggle } ) => (
								<Button
									variant="primary"
									onClick={ onToggle }
									aria-expanded={ isOpen }
								>
									{ visualLabel }
								</Button>
							) }
							renderContent={ () => (
								<DateTimePicker
									currentDate={ dateTime || defaultDate }
									onChange={ ( nextDateTime ) =>
										setAttributes( {
											dateTime: nextDateTime,
										} )
									}
									__nextRemoveHelpButton
									__nextRemoveResetButton
								/>
							) }
						/>
					</BaseControl>
					<ToggleControl
						label={ __( 'Years', 'getwid' ) }
						checked={ years }
						onChange={ ( value ) =>
							setAttributes( { years: value } )
						}
					/>
					<ToggleControl
						label={ __( 'Months', 'getwid' ) }
						checked={ months }
						onChange={ ( value ) =>
							setAttributes( { months: value } )
						}
					/>
					<ToggleControl
						label={ __( 'Weeks', 'getwid' ) }
						checked={ weeks }
						onChange={ ( value ) =>
							setAttributes( { weeks: value } )
						}
					/>
					<ToggleControl
						label={ __( 'Days', 'getwid' ) }
						checked={ days }
						onChange={ ( value ) =>
							setAttributes( { days: value } )
						}
					/>
					<ToggleControl
						label={ __( 'Hours', 'getwid' ) }
						checked={ hours }
						onChange={ ( value ) =>
							setAttributes( { hours: value } )
						}
					/>
					<ToggleControl
						label={ __( 'Minutes', 'getwid' ) }
						checked={ minutes }
						onChange={ ( value ) =>
							setAttributes( { minutes: value } )
						}
					/>
					<ToggleControl
						label={ __( 'Seconds', 'getwid' ) }
						checked={ seconds }
						onChange={ ( value ) =>
							setAttributes( { seconds: value } )
						}
					/>
				</PanelBody>
			) }
			{ tabName === 'style' && (
				<>
					<PanelBody
						title={ __( 'Font Settings', 'getwid' ) }
						initialOpen
					>
						<FontsControl
							value={ fontFamily }
							onChangeFontGroupID={ ( fontGroupID ) =>
								setAttributes( { fontGroupID } )
							}
							onChangeFontFamily={ ( nextFontFamily ) =>
								setAttributes( {
									fontFamily: nextFontFamily,
									fontWeight: 'normal',
								} )
							}
							valueWeight={ fontWeight }
							onChangeFontWeight={ ( nextFontWeight ) =>
								setAttributes( {
									fontWeight: nextFontWeight,
								} )
							}
						/>
						<FontSizeControl
							attributes={ attributes }
							setAttributes={ setAttributes }
						/>
						<SelectControl
							label={ __( 'Font Style', 'getwid' ) }
							value={ fontStyle }
							options={ [
								{
									value: 'normal',
									label: __( 'Normal', 'getwid' ),
								},
								{
									value: 'italic',
									label: __( 'Italic', 'getwid' ),
								},
								{
									value: 'inherit',
									label: __( 'Inherit', 'getwid' ),
								},
							] }
							onChange={ ( nextFontStyle ) =>
								setAttributes( { fontStyle: nextFontStyle } )
							}
							__nextHasNoMarginBottom
						/>
						<SelectControl
							label={ __( 'Text Transform', 'getwid' ) }
							value={ textTransform }
							options={ [
								{
									value: 'default',
									label: __( 'Default', 'getwid' ),
								},
								{
									value: 'uppercase',
									label: __( 'Uppercase', 'getwid' ),
								},
								{
									value: 'lowercase',
									label: __( 'Lowercase', 'getwid' ),
								},
							] }
							onChange={ ( nextTextTransform ) =>
								setAttributes( {
									textTransform: nextTextTransform,
								} )
							}
							__nextHasNoMarginBottom
						/>
						<StyleLengthControl
							label={ __( 'Line Height', 'getwid' ) }
							value={ lineHeight }
							onChange={ ( nextLineHeight ) =>
								setAttributes( { lineHeight: nextLineHeight } )
							}
						/>
						<StyleLengthControl
							label={ __( 'Letter Spacing', 'getwid' ) }
							value={ letterSpacing }
							allowNegative
							units={ [
								{ label: 'px', value: 'px' },
								{ label: 'em', value: 'em' },
								{ label: 'pt', value: 'pt' },
								{ label: 'vh', value: 'vh' },
								{ label: 'vw', value: 'vw' },
							] }
							onChange={ ( nextLetterSpacing ) =>
								setAttributes( {
									letterSpacing: nextLetterSpacing,
								} )
							}
						/>
					</PanelBody>
					<PanelBody
						title={ __( 'Layout', 'getwid' ) }
						initialOpen={ false }
					>
						<SelectControl
							label={ __( 'Space around numbers', 'getwid' ) }
							value={ innerPadding }
							options={ [
								{
									value: 'default',
									label: __( 'Default', 'getwid' ),
								},
								{
									value: 'small',
									label: __( 'Small', 'getwid' ),
								},
								{
									value: 'medium',
									label: __( 'Medium', 'getwid' ),
								},
								{
									value: 'normal',
									label: __( 'Normal', 'getwid' ),
								},
								{
									value: 'large',
									label: __( 'Large', 'getwid' ),
								},
							] }
							onChange={ ( nextInnerPadding ) =>
								setAttributes( {
									innerPadding: nextInnerPadding,
								} )
							}
							__nextHasNoMarginBottom
						/>
						<SelectControl
							label={ __( 'Space between numbers', 'getwid' ) }
							value={ innerSpacings }
							options={ [
								{
									value: 'none',
									label: __( 'None', 'getwid' ),
								},
								{
									value: 'small',
									label: __( 'Small', 'getwid' ),
								},
								{
									value: 'medium',
									label: __( 'Medium', 'getwid' ),
								},
								{
									value: 'normal',
									label: __( 'Normal', 'getwid' ),
								},
								{
									value: 'large',
									label: __( 'Large', 'getwid' ),
								},
							] }
							onChange={ ( nextInnerSpacings ) =>
								setAttributes( {
									innerSpacings: nextInnerSpacings,
								} )
							}
							__nextHasNoMarginBottom
						/>
					</PanelBody>
					<PanelColorSettings
						title={ __( 'Colors', 'getwid' ) }
						initialOpen={ false }
						colorSettings={ [
							{
								value: textColor.color,
								onChange: setTextColor,
								label: __( 'Text Color', 'getwid' ),
							},
							{
								value: backgroundColor,
								onChange: ( nextBackgroundColor ) =>
									setAttributes( {
										backgroundColor: nextBackgroundColor,
									} ),
								label: __( 'Background Color', 'getwid' ),
							},
						] }
					/>
				</>
			) }
		</InspectorControls>
	);
}
