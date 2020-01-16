/**
 * External dependencies
 */
import { __ } from 'wp.i18n';
import { renderBackgroundImage }    from 'GetwidUtils/render-inspector';

import GetwidCustomColorPalette      from 'GetwidControls/custom-color-palette';

import { get } from 'lodash';

const { Component } = wp.element;
const { InspectorControls } = wp.blockEditor || wp.editor;
const { SelectControl, PanelBody, CheckboxControl } = wp.components;

class Inspector extends Component {
	constructor() {
		super(...arguments);
	}

	render() {		
		const { textColor, setTextColor, setAttributes } = this.props;
		const { titleTag, dotted, currencyPosition, url, id, customTextColor } = this.props.attributes;

		return (
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'getwid' ) } initialOpen={ true }>

					{renderBackgroundImage({
						id: id,
						url: url,
						onSelectMedia: (image) => {
							setAttributes( {
								id : get( image, 'id' ),
								url : ! Object.keys( get( image, [ 'sizes' ] ) ).includes( 'thumbnail' ) ? get( image, [ 'sizes', 'full', 'url' ] ) : get( image, [ 'sizes', 'thumbnail', 'url' ] )
							} );
						},
						setAttributes,
						removeButton: true,
						label : __('Image', 'getwid')
					})}

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
					<GetwidCustomColorPalette
						colorSettings={[{
								title: __( 'Colors', 'getwid' ),
								colors: {
									customColor: customTextColor,
									defaultColor: textColor
								},
								changeColor: setTextColor
							}
						]}
					/>
				</PanelBody>
			</InspectorControls>
		);
	}
}

export default Inspector;