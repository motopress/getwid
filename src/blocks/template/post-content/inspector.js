/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {
	Component,
	Fragment,
} = wp.element;
const {
	InspectorControls,
} = wp.editor;
const {
	SelectControl,
	PanelBody,
	RangeControl,
	ToggleControl,
} = wp.components;


/**
* Module Constants
*/
const MAX_POSTS_COLUMNS = 6;


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
				contentLength,
			},
			setAttributes,
			changeState,
			getState,
		} = this.props;
		
		return (
			<InspectorControls>
				<PanelBody title={ __('Settings', 'getwid') }>
					<RangeControl
						label={ __( 'Number of words', 'getwid' ) }
						value={ contentLength }
						onChange={ ( contentLength ) => setAttributes( { contentLength } ) }
						min={ 5 }
						max={ Getwid.settings.excerpt_length }
					/>	
				</PanelBody>
			</InspectorControls>
		);
	}
}