/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;

const { Component } = wp.element;
const { InspectorControls, MediaUpload } = wp.blockEditor || wp.editor;
const { PanelBody, SelectControl, BaseControl, Button } = wp.components;

class Inspector extends Component {
	constructor() {
		super(...arguments);
	}

	render() {
		const { url, id, cardPosition, imageSize } = this.props.attributes;
		const { setAttributes, imgObj } = this.props;

		return (
			<InspectorControls>
				<PanelBody title={__( 'Settings', 'getwid' )} initialOpen={true}>
					{ (url && imgObj) && (
						<SelectControl
							label={__( 'Image Size', 'getwid' )}
							help={__( 'For images from Media Library only.', 'getwid' )}
							value={imageSize}
							onChange={this.props.onChangeImageSize}
							options={Getwid.settings.image_sizes}
						/>
					) }
					{ url && (
						<BaseControl>
							<Button
								isDefault
								onClick={() => {
									setAttributes( {
										url: undefined,
										id: undefined
									} );
								}}
							>
								{ __( 'Delete Image', 'getwid' )}
							</Button>
					</BaseControl>
					) }
					<SelectControl
						label={__( 'Alignment', 'getwid' )}
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
				</PanelBody>
			</InspectorControls>
		);
	}	
}

export default Inspector;