/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
import { renderBackgroundImage }    from 'GetwidUtils/render-inspector';

const {jQuery: $} = window;
const {Component} = wp.element;
const {
	InspectorControls,
	MediaPlaceholder,
	MediaUpload
} = wp.blockEditor || wp.editor;
const {
	Button,
	BaseControl,
	ButtonGroup,
	PanelBody,
	SelectControl,
	ToggleControl
} = wp.components;


/**
 * Module Constants
 */
const ALLOWED_MEDIA_TYPES = ['image'];


/**
* Create an Inspector Controls
*/
export default class Inspector extends Component {

	render() {

		const {
			attributes: {
				imageSize,
				imageCrop,
				imgId,
				imgUrl,				
			},
			setAttributes,
			changeImageSize,
			onSelectMedia,
			imgObj
		} = this.props;

		const onChangeImageSize = (imageSize) => {

			if (typeof imgObj != 'undefined'){
				setAttributes( {
					imageSize
				} );
				changeImageSize(imgObj, imageSize);
			}
		};

		return (
			<InspectorControls>
				<PanelBody
					title={__('Settings', 'getwid')}
				>
					{renderBackgroundImage({
						id: imgId,
						url: imgUrl,
						onSelectMedia,
						setAttributes,
						removeButton: false,
						label: __('Image', 'getwid')
					})}

					{ imgObj && (
						<SelectControl
							label={__('Image Size', 'getwid')}
							help={__('For images from Media Library only.', 'getwid')}
							value={imageSize}
							onChange={onChangeImageSize}
							options={Getwid.settings.image_sizes}
						/>
					)}

					<ToggleControl
						label={ __( 'Crop Image', 'getwid' ) }
						checked={ imageCrop }
						onChange={ () => {
							setAttributes( { imageCrop: !imageCrop } );
						}}						
					/>					
				</PanelBody>
			</InspectorControls>
		);
	}

}