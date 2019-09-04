/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import { renderPaddingsPanel } from 'GetwidUtils/render-inspector';

import GetwidStyleLengthControl from 'GetwidControls/style-length-control';

const { Component } = wp.element;
const { InspectorControls, PanelColorSettings } = wp.editor;
const { ToggleControl, PanelBody, SelectControl } = wp.components;

class Inspector extends Component {
	constructor() {
		super(...arguments);
	}

	render() {
		const { filling, animation } = this.props.attributes;
		const { baseClass, setTextColor, setBackgroundColor, setFillColor } = this.props;
		const { textColor, backgroundColor, fillColor, setAttributes, clientId, getBlock } = this.props;

		/* #region test */
		const { marginLeft, marginRight, marginBottom } = this.props.attributes;
		/* #endregion */

		const enableFilling = getBlock( clientId ).innerBlocks.length > 1 ? true : false;

		return (
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'getwid' ) } initialOpen={ true }>
						<SelectControl
							label={__( 'Animation Effect', 'getwid' )}
							value={animation}
							onChange={ animation => {
								setAttributes( { animation } );
							} }
							options={ [
								{ value: 'none' 	   , label: __( 'None' 			  , 'getwid' ) },
								{ value: 'fadeInShort' , label: __( 'Bounce In Short' , 'getwid' ) }
							] }
						/>
						<PanelColorSettings
							title={ __( 'Colors', 'getwid' ) }
							colorSettings={ [
								{
									value: textColor.color,
									onChange: setTextColor,
									label: __( 'Card Text Color', 'getwid' )
								},
								{
									value: backgroundColor.color,
									onChange: setBackgroundColor,
									label: __( 'Card Background Color', 'getwid' )
								},
								...( $.parseJSON( filling ) ? [ {
									value: fillColor.color,
									onChange: setFillColor,
									label: __( 'Fill Color', 'getwid' )
								} ] : [] )
							] }
						/>
						{ enableFilling && ( <ToggleControl
								label={__( 'Enable Filling', 'getwid' )}
								checked={filling == 'true' ? true : false}
								onChange={value => {
									setAttributes( {
										filling: value ? 'true' : 'false'
									} );
								}}
							/>
						) }

						<PanelBody title={ __( 'Margin', 'getwid' ) } initialOpen={false}>
							<h2>{ __( 'Horizontal Space', 'getwid' ) }</h2>

							<GetwidStyleLengthControl
								label={__( 'Margin Left', 'getwid' )}
								value={marginLeft}
								onChange={marginLeft => {
									setAttributes( {
										marginLeft
									} );
								}}
							/>
							<GetwidStyleLengthControl
								label={__( 'Margin Right', 'getwid' )}
								value={marginRight}
								onChange={marginRight => {
									setAttributes( {
										marginRight
									} );
								}}
							/>

							<hr className={`${baseClass}__separator`}/>
							<h2>{ __( 'Vertical Space', 'getwid' ) }</h2>

							<GetwidStyleLengthControl
								label={__( 'Margin Bottom', 'getwid' )}
								value={marginBottom}
								onChange={marginBottom => {
									setAttributes( {
										marginBottom
									} );
								}}
							/>
						</PanelBody>
								
						<PanelBody title={__( 'Padding', 'getwid' )} initialOpen={false}>
							{ renderPaddingsPanel( this ) }
						</PanelBody>
					</PanelBody>
			</InspectorControls>
		);
	}	
}

export default Inspector;