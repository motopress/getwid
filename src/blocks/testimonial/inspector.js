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
export default class Inspector extends Component {

	render() {

		const { imgId, imgUrl } = this.props.attributes;
		const { setAttributes, onSelectMedia } = this.props;

		return (
			<InspectorControls>
				<PanelBody
					title={__( 'Settings', 'getwid' )}
				>
					<GetwidMediaControl
						label={__( 'Image', 'getwid' )}
						removeButton={false}
						url={imgUrl}
						id={imgId}
						onSelectMedia={onSelectMedia}
						onRemoveMedia={() => setAttributes({
							imgUrl: undefined,
							imgId : undefined
						})}
					/>
				</PanelBody>
			</InspectorControls>
		);
	}
}