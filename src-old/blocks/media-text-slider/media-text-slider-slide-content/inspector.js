/**
* External dependencies
*/
import { __ } from 'wp.i18n';

/**
* Internal dependencies
*/
import { renderMediaControl as GetwidMediaControl } from 'GetwidUtils/render-inspector';

/**
* WordPress dependencies
*/
const { Component } = wp.element;
const { InspectorControls } = wp.blockEditor || wp.editor;
const { PanelBody } = wp.components;

/**
* Create an Inspector Controls
*/
class Inspector extends Component {

	constructor( props ) {
		super( ...arguments );
	}

	render() {

		const { mediaId, mediaUrl } = this.props.attributes;
		const { setAttributes, onSelectMedia, clientId } = this.props;

		const { select } = wp.data;
		const block = select( 'core/block-editor' ).getBlock( clientId );

		if ( ! block ) {
			return (
				<InspectorControls></InspectorControls>
			);
		}

		return (
			<InspectorControls>
				<PanelBody title={__('Image', 'getwid')} initialOpen={true}>
					<GetwidMediaControl
						label={__( 'Image', 'getwid' )}
						removeButton={false}
						url={mediaUrl}
						id={mediaId}
						onSelectMedia={onSelectMedia}
						onRemoveMedia={() => setAttributes({
							mediaUrl: undefined,
							mediaId : undefined
						})}
					/>
				</PanelBody>
			</InspectorControls>
		);
	}
}

export default Inspector;
