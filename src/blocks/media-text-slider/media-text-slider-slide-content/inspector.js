/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
import { renderBackgroundImage }    from 'GetwidUtils/render-inspector';
const {jQuery: $} = window;
const {
	Component,
} = wp.element;
const {
	InspectorControls,
	MediaUpload,
} = wp.blockEditor || wp.editor;
const {
	Button,
	BaseControl,
	PanelBody,
} = wp.components;


/**
* Module Constants
*/
const ALLOWED_MEDIA_TYPES = [ 'image' ];


/**
* Create an Inspector Controls
*/
class Inspector extends Component {

	constructor( props ) {
		super( ...arguments );	
	}

	render() {

		const {
			attributes: {
				mediaAlt,
				mediaId,
				mediaType,
				mediaUrl,
			},
			setAttributes,
			onSelectMedia
		} = this.props;

		return (
			<InspectorControls key="inspector">
	
				<PanelBody title={__('Image', 'getwid')} initialOpen={true}>

					{renderBackgroundImage({
						id: mediaId,
						url: mediaUrl,
						onSelectMedia,
						setAttributes,
						removeButton: false,						
					})}	

				</PanelBody>

			</InspectorControls>
		);
	}

}

export default ( Inspector );