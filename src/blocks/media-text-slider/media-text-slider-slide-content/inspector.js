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
		const { setAttributes, onSelectMedia } = this.props;

		return (
			<InspectorControls key="inspector">
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