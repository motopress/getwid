/**
 * External dependencies
 */
import { __ } from 'wp.i18n';

/**
* WordPress dependencies
*/
const { Component } = wp.element;
const { InspectorControls } = wp.blockEditor || wp.editor;
const { PanelBody, ToggleControl } = wp.components;

/**
* Create an Component
*/
class Inspector extends Component {
	constructor() {
		super(...arguments);
	}	

	render() {
		const { setAttributes, toggleSection } = this.props;
		const { head, foot, hasFixedLayout, tableCollapsed } = this.props.attributes;

		return (
			<InspectorControls>
				<PanelBody title={ __( 'Table Settings', 'getwid' ) }>
					<ToggleControl
						label={__( 'Fixed width table cells', 'getwid' )}
						checked={hasFixedLayout}
						onChange={() => setAttributes({ hasFixedLayout: !hasFixedLayout })}
					/>
					<ToggleControl
						label={__( 'Table header', 'getwid' )}
						checked={!!head && !!head.length}
						onChange={() => toggleSection( 'head' )}
					/>
					<ToggleControl
						label={__( 'Table footer', 'getwid' )}
						checked={!!foot && !!foot.length}
						onChange={() => toggleSection( 'foot' )}
					/>
					<ToggleControl
						label={ __( 'Border collapsed', 'getwid' ) }
						checked={tableCollapsed}
						onChange={() => setAttributes({ tableCollapsed: !tableCollapsed })}
					/>
				</PanelBody>
				<PanelBody title={ __( 'Cell Settings', 'getwid' ) }>
					
				</PanelBody>
			</InspectorControls>
		);
	}
}

export default Inspector;