/**
 * WordPress dependencies
 */
import { __ } from 'wp.i18n';
const { jQuery: $ } = window;
const {
	Component,
} = wp.element;
const {
	InspectorControls,
} = wp.blockEditor || wp.editor;
const {
	PanelBody,
	TextControl,
	SelectControl
} = wp.components;


/**
 * Create an Inspector Controls
 */
export default class Inspector extends Component {

	constructor() {
		super(...arguments);
	}

	render() {
		const {
			attributes: {
				customField,
				linkTo,
				imageSize
			},

			setAttributes,
		} = this.props;

		return (
			<InspectorControls>
				<PanelBody title={ __('Settings', 'getwid') }>
					<TextControl
						label={__('Field Name', 'getwid')}
						value={ customField }
						onChange={ customField => setAttributes({customField}) }
					/>
					<SelectControl
						label={__('Link to', 'getwid')}
						value={linkTo}
						onChange={linkTo => setAttributes({linkTo})}
						options={[
							{value: 'none', label: __( 'None', 'getwid' ), },
							{value: 'post', label: __( 'Post', 'getwid' ), },
						]}
					/>
					<SelectControl
						label={__('Image Size', 'getwid')}
						help={__('For images from Media Library only.', 'getwid')}
						value={imageSize}
						onChange={ (value) => {
							setAttributes( { imageSize: value } );
						}}
						options={Getwid.settings.image_sizes}
					/>
				</PanelBody>
			</InspectorControls>
		);
	}
}
