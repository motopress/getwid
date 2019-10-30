/**
* Internal dependencies
*/
import GetwidStyleLengthControl from 'GetwidControls/style-length-control';
import GetwidGoogleFontsControl from 'GetwidControls/google-fonts-control';

import { renderFontSizePanel } from 'GetwidUtils/render-inspector';

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;

const { Component } = wp.element;
const { PanelBody,
	SelectControl,
	DateTimePicker,
	ToggleControl,
} = wp.components;
const { InspectorControls, PanelColorSettings } = wp.blockEditor;

/**
* Create an Inspector Controls
*/
class Inspector extends Component {

	constructor( props ) {
		super( ...arguments );
	}

	render() {

		const {
			attributes: {
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
				innerSpacings
			},
			setTextColor,
			textColor,

			setAttributes
		} = this.props;

		let default_date = new Date(Getwid.settings.date_time_utc);
		default_date.setDate(default_date.getDate() + 1);

		return (
			<InspectorControls key='inspector'>
				<PanelBody title={ __( 'Settings', 'getwid' ) } initialOpen={true}>
					<DateTimePicker
						currentDate={ dateTime ? dateTime : default_date}
						onChange={ (value) => {
							setAttributes({dateTime: value});
						}}
					/>

					<ToggleControl
						label={ __( 'Years', 'getwid' ) }
						checked={ years }
						onChange={ (value) => {
							setAttributes({years: value});
						}}
					/>
					<ToggleControl
						label={ __( 'Months', 'getwid' ) }
						checked={ months }
						onChange={ (value) => {
							setAttributes({months: value});
						}}
					/>
					<ToggleControl
						label={ __( 'Weeks', 'getwid' ) }
						checked={ weeks }
						onChange={ (value) => {
							setAttributes({weeks: value});
						}}
					/>
					<ToggleControl
						label={ __( 'Days', 'getwid' ) }
						checked={ days }
						onChange={ (value) => {
							setAttributes({days: value});
						}}
					/>
					<ToggleControl
						label={ __( 'Hours', 'getwid' ) }
						checked={ hours }
						onChange={ (value) => {
							setAttributes({hours: value});
						}}
					/>
					<ToggleControl
						label={ __( 'Minutes', 'getwid' ) }
						checked={ minutes }
						onChange={ (value) => {
							setAttributes({minutes: value});
						}}
					/>
					<ToggleControl
						label={ __( 'Seconds', 'getwid' ) }
						checked={ seconds }
						onChange={ (value) => {
							setAttributes({seconds: value});
						}}
					/>
					
					<SelectControl
						label={__( 'Padding', 'getwid' )}
						value={innerPadding}
						options={[
							{ value: 'default' , label: __( 'Default' , 'getwid' ) },
							{ value: 'small', label: __( 'Small', 'getwid' ) },
							{ value: 'medium', label: __( 'Medium', 'getwid' ) },
							{ value: 'normal', label: __( 'Normal', 'getwid' ) },
							{ value: 'large', label: __( 'Large', 'getwid' ) }
						]}
						onChange={innerPadding => setAttributes( { innerPadding } )}
					/>

 					<SelectControl
						label={__( 'Spacing', 'getwid' )}
						value={innerSpacings}
						options={[
							{ value: 'none' , label: __( 'None' , 'getwid' ) },
							{ value: 'small', label: __( 'Small', 'getwid' ) },
							{ value: 'medium', label: __( 'Medium', 'getwid' ) },
							{ value: 'normal', label: __( 'Normal', 'getwid' ) },
							{ value: 'large', label: __( 'Large', 'getwid' ) }
						]}
						onChange={innerSpacings => setAttributes( { innerSpacings } )}
					/>
				</PanelBody>
				<PanelBody title={ __( 'Font Settings', 'getwid' ) } initialOpen={false}>
					<GetwidGoogleFontsControl
						label={ __( 'Font Family', 'getwid' ) }
						value={ fontFamily }
						onChangeFontFamily={ (value) => {
							setAttributes( {
								fontFamily: value,
								fontWeight: 'normal'
							} );
						} }
						valueWeight={ fontWeight }
						onChangeFontWeight={ value => {
							setAttributes( { fontWeight: value } );
						}}
					/>

					{ renderFontSizePanel( this ) }

 					<SelectControl
						label={__( 'Font Style', 'getwid' )}
						value={fontStyle}
						options={[
							{ value: 'normal' , label: __( 'Normal' , 'getwid' ) },
							{ value: 'italic' , label: __( 'Italic' , 'getwid' ) },
							{ value: 'inherit', label: __( 'Inherit', 'getwid' ) },
						]}
						onChange={fontStyle => setAttributes( { fontStyle } )}
					/>
					<SelectControl
						label={__( 'Text Transform', 'getwid' )}
						value={textTransform}
						options={[
							{ value: 'default'   , label: __( 'Default'   , 'getwid' ) },
							{ value: 'uppercase', label: __( 'Uppercase', 'getwid' ) },
							{ value: 'lowercase' , label: __( 'Lowercase' , 'getwid' ) },
						]}
						onChange={textTransform => setAttributes( { textTransform } )}
					/>
					 <GetwidStyleLengthControl
						label={__( 'Line Height', 'getwid' )}
						value={lineHeight}
						onChange={lineHeight => {
							setAttributes( { lineHeight } );
						}}
					/>
					<GetwidStyleLengthControl
						label={__( 'Letter Spacing', 'getwid' )}
						value={letterSpacing}
						allowNegative={true}
						units = {[
						   {label: 'px', value: 'px'},
						   {label: 'em', value: 'em'},
						   {label: 'pt', value: 'pt'},
						   {label: 'vh', value: 'vh'},
						   {label: 'vw', value: 'vw'},
						]}
						onChange={letterSpacing => {
							setAttributes( { letterSpacing } );
						} }
					/>
				</PanelBody>

				<PanelColorSettings
					title={__('Colors', 'getwid')}
                    initialOpen={false}
					colorSettings={[
						{
							value: textColor.color,
							onChange: setTextColor,
							label: __( 'Text Color', 'getwid' )
						},
						{
							value: backgroundColor,
							onChange: (value) => {
								setAttributes({backgroundColor: value});
							},
							label: __( 'Background Color', 'getwid' )
						}
					]}
				/>
			</InspectorControls>
		);
	}
}

export default ( Inspector );
