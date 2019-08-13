/**
* Internal dependencies
*/
import GetwidStyleLengthControl from 'GetwidControls/style-length-control';
import GetwidGoogleFontsControl from 'GetwidControls/google-fonts-control';

import { renderFontSizePanel, renderMarginsPanel, renderPaddingsPanel } from 'GetwidUtils/render-inspector';

/**
* External dependencies
*/
import { __ } from 'wp.i18n';

const { Component } = wp.element;
const { PanelBody,
	SelectControl,
	DateTimePicker,
	CheckboxControl,
	BaseControl,
	ToggleControl,
} = wp.components;
const { InspectorControls, PanelColorSettings } = wp.editor;

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
				year,
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
			},
			setBackgroundColor,
			setTextColor,
			backgroundColor,
			textColor,

			setAttributes
		} = this.props;

		return (
			<InspectorControls key='inspector'>
				<PanelBody title={ __( 'Settings', 'getwid' ) } initialOpen={true}>
					<DateTimePicker
						currentDate={ dateTime }
						onChange={ (value) => {
							setAttributes({dateTime: value});
						}}
					/>		

					<ToggleControl
						label={ __( 'Year', 'getwid' ) }
						checked={ year }
						onChange={ (value) => {
							setAttributes({year: value});
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
							{ value: 'none'      , label: __( 'None'      , 'getwid' ) },
							{ value: 'capitalize', label: __( 'Capitalize', 'getwid' ) },
							{ value: 'lowercase' , label: __( 'Lowercase' , 'getwid' ) },
							{ value: 'uppercase' , label: __( 'Uppercase' , 'getwid' ) },
							{ value: 'inherit'   , label: __( 'Inherit'   , 'getwid' ) }
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
							value: backgroundColor.color,
							onChange: setBackgroundColor,
							label: __( 'Background Color', 'getwid' )
						}						
					]}
				/>
				<PanelBody title={__( 'Padding', 'getwid' )} initialOpen={false} >
					{ renderPaddingsPanel( this ) }
				</PanelBody>

				<PanelBody title={__( 'Margin', 'getwid' )} initialOpen={false} >
					{ renderMarginsPanel( this ) }
				</PanelBody>

			</InspectorControls>
		);
	}
}

export default ( Inspector );