/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
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
					{ !imgUrl && (
						<MediaPlaceholder
							icon="format-image"
							labels={ {
								title: __( 'Image', 'getwid' ),
								instructions: __( 'Upload an image file, pick one from your media library, or add one with a URL.', 'getwid' ),
							} }
							onSelect={ onSelectMedia }
							accept="image/*"
							allowedTypes={ALLOWED_MEDIA_TYPES}
						/>
					)}

					{ imgUrl && (
						<MediaUpload
							onSelect={ onSelectMedia }
							allowedTypes={ ALLOWED_MEDIA_TYPES }
							value={ imgId }
							render={ ( { open } ) => (
								<BaseControl>
									{ !!imgUrl &&
										<div
											onClick={ open }
											className="getwid-background-image-wrapper"
										>
												<img src={imgUrl} />
										</div>
									}

									<ButtonGroup>
										<Button
											isPrimary
											onClick={ open }
										>
											{!imgId && __('Select Image', 'getwid')}
											{!!imgId && __('Replace Image', 'getwid')}
										</Button>

										{!!imgId && (
											<Button
												isDefault
												onClick={(e) => {
													setAttributes({imgId: null, imgUrl: null})
												}}
											>
												{__('Remove Image', 'getwid')}
											</Button>
										)}
									</ButtonGroup>

								</BaseControl>
							) }
						/>
					)}

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