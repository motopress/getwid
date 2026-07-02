/**
* External dependencies
*/
import { __ } from 'wp.i18n';


/**
* WordPress dependencies
*/
const { Component } = wp.element;
const { InspectorControls } = wp.blockEditor || wp.editor;
const { Button, PanelBody } = wp.components;
const { dispatch } = wp.data;

/**
* Create an Component
*/
class Inspector extends Component {
	constructor() {
		super(...arguments);
	}

	render() {
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
			</InspectorControls>
		);
	}
}

export default Inspector;
