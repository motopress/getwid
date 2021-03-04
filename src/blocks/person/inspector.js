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
const { PanelBody, SelectControl, ToggleControl } = wp.components;

/**
* Create an Inspector Controls
*/
class Inspector extends Component {

	render() {
		const { imageSize, imageCrop, imgId, imgUrl } = this.props.attributes;
		const { setAttributes, changeImageSize, onSelectMedia, imgObj } = this.props;

		const onChangeImageSize = imageSize => {
			if ( typeof imgObj != 'undefined' ) {
				setAttributes( {
					imageSize
				} );
				changeImageSize( imgObj, imageSize );
			}
		};

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
							imgId: undefined
						})}
					/>
					{imgObj && (
						<SelectControl
							label={__( 'Image Size', 'getwid' )}
							help={__( 'For images from Media Library only.', 'getwid' )}
							value={imageSize}
							onChange={onChangeImageSize}
							options={Getwid.settings.image_sizes}
						/>
					)}

					<ToggleControl
						label={ __( 'Crop Image', 'getwid' ) }
						checked={imageCrop}
						onChange={() => {
							setAttributes({ imageCrop: !imageCrop });
						}}
					/>
				</PanelBody>
			</InspectorControls>
		);
	}
}

export default Inspector;
