import { InspectorControls } from '@wordpress/block-editor';
import {
	CheckboxControl,
	PanelBody,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import { useState } from '@wordpress/element';
import { __, _x } from '@wordpress/i18n';
import { CustomColorPalette, TabsControl } from 'getwid-components';

import type { CounterEditProps } from './types';

type TabName = 'general' | 'style';

function parseInteger( value: string | undefined, fallback: number ) {
	const parsedValue = Number.parseInt( value ?? '', 10 );

	return Number.isNaN( parsedValue ) ? fallback : parsedValue;
}

function getDecimalPlacesValue( value: string | undefined ) {
	const parsedValue = parseInteger( value, 0 );

	return parsedValue < 0 ? 0 : parsedValue;
}

export default function Inspector( {
	attributes,
	setAttributes,
	textColor,
	setTextColor,
}: CounterEditProps ) {
	const [ tabName, setTabName ] = useState< TabName >( 'general' );
	const {
		customTextColor,
		decimal,
		decimalPlaces,
		duration,
		easing,
		end,
		numerals,
		separator,
		start,
		useEasing,
		useGrouping,
	} = attributes;

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
				<PanelBody title={ __( 'Settings', 'getwid' ) } initialOpen>
					<TextControl
						type="number"
						label={ __( 'Start', 'getwid' ) }
						value={ parseInteger( start, 0 ) }
						onChange={ ( nextStart ) =>
							setAttributes( { start: nextStart } )
						}
					/>
					<TextControl
						type="number"
						label={ __( 'End', 'getwid' ) }
						value={ parseInteger( end, 100 ) }
						onChange={ ( nextEnd ) =>
							setAttributes( { end: nextEnd } )
						}
					/>
					<CheckboxControl
						label={ __( 'Display Thousands Separator', 'getwid' ) }
						checked={ useGrouping === 'true' }
						onChange={ ( nextUseGrouping ) =>
							setAttributes( {
								useGrouping: nextUseGrouping ? 'true' : 'false',
							} )
						}
					/>
					<TextControl
						label={ __( 'Thousands Separator', 'getwid' ) }
						value={
							separator ??
							_x( ',', 'Thousands separator', 'getwid' )
						}
						onChange={ ( nextSeparator ) =>
							setAttributes( { separator: nextSeparator } )
						}
					/>
					<TextControl
						type="number"
						label={ __( 'Decimal Places', 'getwid' ) }
						value={ getDecimalPlacesValue( decimalPlaces ) }
						onChange={ ( nextDecimalPlaces ) => {
							const nextValue = parseInteger(
								nextDecimalPlaces,
								0
							);

							setAttributes( {
								decimalPlaces: String(
									Math.max( 0, Math.min( nextValue, 100 ) )
								),
							} );
						} }
					/>
					<TextControl
						label={ __( 'Decimal Separator', 'getwid' ) }
						value={
							decimal ?? _x( '.', 'Decimal separator', 'getwid' )
						}
						onChange={ ( nextDecimal ) =>
							setAttributes( { decimal: nextDecimal } )
						}
					/>
					<SelectControl
						label={ __( 'Numerals', 'getwid' ) }
						value={ numerals }
						onChange={ ( nextNumerals ) =>
							setAttributes( { numerals: nextNumerals } )
						}
						options={ [
							{
								value: 'default',
								label: __( 'Default', 'getwid' ),
							},
							{
								value: 'eastern_arabic',
								label: __( 'Eastern Arabic', 'getwid' ),
							},
							{ value: 'farsi', label: __( 'Farsi', 'getwid' ) },
						] }
					/>
				</PanelBody>
			) }

			{ tabName === 'style' && (
				<PanelBody title={ __( 'Style', 'getwid' ) } initialOpen>
					<TextControl
						type="number"
						label={ __( 'Animation Duration', 'getwid' ) }
						value={ parseInteger( duration, 3 ) }
						onChange={ ( nextDuration ) =>
							setAttributes( { duration: nextDuration } )
						}
					/>
					<CheckboxControl
						label={ __( 'Smooth Animation', 'getwid' ) }
						checked={ useEasing === 'true' }
						onChange={ ( nextUseEasing ) =>
							setAttributes( {
								useEasing: nextUseEasing ? 'true' : 'false',
							} )
						}
					/>
					{ useEasing === 'true' && (
						<SelectControl
							label={ __( 'Animation Effect', 'getwid' ) }
							value={ easing }
							onChange={ ( nextEasing ) =>
								setAttributes( { easing: nextEasing } )
							}
							options={ [
								{ value: 'outExpo', label: 'OutExpo' },
								{ value: 'outQuintic', label: 'OutQuintic' },
								{ value: 'outCubic', label: 'OutCubic' },
							] }
						/>
					) }
					<CustomColorPalette
						colorSettings={ [
							{
								title: __( 'Color', 'getwid' ),
								colors: {
									customColor: customTextColor,
									defaultColor: textColor,
								},
								changeColor: setTextColor,
							},
						] }
					/>
				</PanelBody>
			) }
		</InspectorControls>
	);
}
