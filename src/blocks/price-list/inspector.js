/**
 * External dependencies
 */
import { __ } from 'wp.i18n';

const { Component } = wp.element;
const { InspectorControls, PanelColorSettings } = wp.editor;
const { SelectControl, PanelBody, CheckboxControl } = wp.components;

class Inspector extends Component {
	constructor() {
		super(...arguments);
	}

	render() {		
		const { textColor, setTextColor, setAttributes } = this.props;
		const { titleTag, dotted, currencyPosition } = this.props.attributes;

		return (
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'getwid' ) } initialOpen={ true }>
					<SelectControl
						label={ __( 'Title Tag', 'getwid' ) }
						value={ titleTag }
						options={ [
							{ value: 'p',  label: __( 'Paragraph', 'getwid' ) },
							{ value: 'h2', label: __( 'Heading 2', 'getwid' ) },
							{ value: 'h3', label: __( 'Heading 3', 'getwid' ) },
							{ value: 'h4', label: __( 'Heading 4', 'getwid' ) },
							{ value: 'h5', label: __( 'Heading 5', 'getwid' ) },
							{ value: 'h6', label: __( 'Heading 6', 'getwid' ) }
						] }
						onChange={titleTag =>
							setAttributes({ titleTag })
						}
					/>
					<SelectControl
						label={__( 'Currency Position', 'getwid' )}
						value={currencyPosition}
						onChange={currencyPosition => setAttributes( {
							currencyPosition
						} )}
						options={[
							{ value: 'currency-before', label: __( 'Before', 'getwid' ) },
							{ value: 'currency-before-space', label: __( 'Before with space', 'getwid' ) },
							{ value: 'currency-after' , label: __( 'After' , 'getwid' ) },
							{ value: 'currency-after-space' , label: __( 'After with space' , 'getwid' ) }
						]}
					/>
					<CheckboxControl
						label={ __( 'Divider', 'getwid' ) }
						checked={ dotted }
						onChange={ dotted =>
							setAttributes( { dotted } )
						}
					/>
					<PanelColorSettings
						title={ __( 'Colors', 'getwid' ) }
						colorSettings={ [
							{
								value: textColor.color,
								onChange: setTextColor,
								label: __( 'Text Color', 'getwid' )
							}
						] }
						initialOpen={ true }
					/>
				</PanelBody>
			</InspectorControls>
		);
	}
}

export default Inspector;