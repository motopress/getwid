/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import { renderMediaControl as GetwidMediaControl } from 'GetwidUtils/render-inspector';

/**
* WordPress dependencies
*/
const { Component } = wp.element;
const { InspectorControls } = wp.blockEditor || wp.editor;
const { PanelBody, SelectControl, BaseControl, Button } = wp.components;

/**
* Create an Component
*/
class Inspector extends Component {
	constructor() {
		super(...arguments);
	}

	render() {
		const { id, url, cardPosition, imageSize } = this.props.attributes;
		const { setAttributes, imgObj, onSelectImage, clientId, getBlock } = this.props;

		if ( ! getBlock( clientId ) ) {
			return (
				<InspectorControls></InspectorControls>
			);
		}

		return (
			<InspectorControls>
				<PanelBody title={__( 'Settings', 'getwid' )} initialOpen={true}>
					<SelectControl
						label={ __( 'Block Alignment', 'getwid' ) }
						value={ cardPosition }
						onChange={ cardPosition => {
							setAttributes( { cardPosition } );
						} }
						options={ [
							{ value: '', label: __( 'Auto' , 'getwid' ) },
							{ value: 'left', label: __( 'Left' , 'getwid' ) },
							{ value: 'right', label: __( 'Right', 'getwid' ) }
						] }
					/>
					<GetwidMediaControl
						label={__( 'Image', 'getwid' )}
						url={url}
						id={id}
						onSelectMedia={onSelectImage}
						onRemoveMedia={() => setAttributes({
							url: undefined,
							id : undefined
						})}
					/>
					{ (url && imgObj) && (
						<SelectControl
							label={__( 'Image Size', 'getwid' )}
							help={__( 'For images from Media Library only.', 'getwid' )}
							value={imageSize}
							onChange={this.props.onChangeImageSize}
							options={Getwid.settings.image_sizes}
						/>
					) }
				</PanelBody>
			</InspectorControls>
		);
	}
}

export default Inspector;
