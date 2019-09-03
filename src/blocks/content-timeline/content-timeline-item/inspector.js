/**
* External dependencies
*/
import { __ } from 'wp.i18n';

const { Component } = wp.element;
const { InspectorControls, MediaUpload } = wp.editor;
const { PanelBody, SelectControl, BaseControl, Button } = wp.components;

class Inspector extends Component {
	constructor() {
		super(...arguments);
	}

	render() {
		const { url, id, cardPosition, imageSize } = this.props.attributes;
		const { setAttributes } = this.props;

		return (
			<InspectorControls>
				{ url && (
					<PanelBody title={__( 'Settings', 'getwid' )} initialOpen={true}>
						<SelectControl
							label={__( 'Image Size', 'getwid' )}
							help={__( 'For images from Media Library only.', 'getwid' )}
							value={imageSize}
							onChange={this.props.onChangeImageSize}
							options={Getwid.settings.image_sizes}
						/>
					</PanelBody>
				) }
				
				{ url && (
					<PanelBody title={__( 'Image', 'getwid' )} initialOpen={true}>
						<MediaUpload
							onSelect={this.props.onSelectImage}
							allowedTypes={[ 'image' ]}
							value={id}
							render={( { open } ) => (
								<BaseControl>
									{ !! url && (
										<div className='getwid-background-image-wrapper'>
											<img src={url} />
										</div>
									)}
									<Button
										isDefault
										onClick={open}
									>
										{ ! id && __( 'Select Image', 'getwid' )}
										{ !! id && __( 'Replace Image', 'getwid' )}
									</Button>
								</BaseControl>
							)}
						/>
					</PanelBody>
				) }	
				<SelectControl
					label={__( 'Card Alignment', 'getwid' )}
					value={ cardPosition }
					onChange={ cardPosition => {
						setAttributes( { cardPosition } );
					} }
					options={ [
						{ value: ''     , label: __( 'Auto' , 'getwid' ) },
						{ value: 'left' , label: __( 'Left' , 'getwid' ) },
						{ value: 'right', label: __( 'Right', 'getwid' ) }
					] }
				/>
			</InspectorControls>
		);
	}	
}

export default Inspector;