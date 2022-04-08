/**
* External dependencies
*/
import { __ } from 'wp.i18n';


/**
* WordPress dependencies
*/
const { Component } = wp.element;
const { InspectorControls } = wp.blockEditor || wp.editor;
const { Button, PanelBody, CheckboxControl } = wp.components;
const { dispatch } = wp.data;

/**
* Create an Component
*/
class Inspector extends Component {
	constructor() {
		super(...arguments);
	}

	render() {
		const { active } = this.props.attributes;
		const { setAttributes, clientId, getBlock, getBlockRootClientId } = this.props;
		const { selectBlock } = dispatch( 'core/block-editor' );

		if ( ! getBlock( clientId ) ) {
			return (
				<InspectorControls></InspectorControls>
			);
		}

		return (
			<InspectorControls>
				<PanelBody>
					<Button
						isPrimary
						onClick={(event) => {
							selectBlock(getBlockRootClientId(clientId))
						}
					}>
						{ __( 'Select Parent', 'getwid' ) }
					</Button>
				</PanelBody>
				<PanelBody
					title={__( 'Settings', 'getwid' )}
				>
					<CheckboxControl
						label={__('Active by default', 'getwid')}
						checked={active}
						onChange={(active) => { setAttributes({ active }) }}
					/>
				</PanelBody>
			</InspectorControls>
		);
	}
}

export default Inspector;
