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
				imgId,
				imgUrl,				
			},
			setAttributes,
			onSelectMedia,
		} = this.props;

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
					})}
									
				</PanelBody>
			</InspectorControls>
		);
	}

}