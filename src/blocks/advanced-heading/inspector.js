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
const {jQuery: $} = window;

const { Component } = wp.element;
const { PanelBody, SelectControl } = wp.components;
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
				titleTag,
				fontFamily,
				fontWeight,
				fontStyle,
				textTransform,
				lineHeight,
				letterSpacing
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
					<SelectControl
						label={__( 'Title Tag', 'getwid' )}
						value={titleTag}
						options={[
							{ value: 'span', label: __( 'Span'      , 'getwid' ) },
							{ value: 'p'   , label: __( 'Paragraph' , 'getwid' ) },
							{ value: 'h2'  , label: __( 'Heading 2' , 'getwid' ) },
							{ value: 'h3'  , label: __( 'Heading 3' , 'getwid' ) },
							{ value: 'h4'  , label: __( 'Heading 4' , 'getwid' ) },
							{ value: 'h5'  , label: __( 'Heading 5' , 'getwid' ) },
							{ value: 'h6'  , label: __( 'Heading 6' , 'getwid' ) }
						]}
						onChange={titleTag => setAttributes({titleTag})}
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