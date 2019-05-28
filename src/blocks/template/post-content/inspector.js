/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {
	Component,
	Fragment,
} = wp.element;
const {
	PanelColorSettings,
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
				showContent,
				contentLength,
			},
			textColor,
			setTextColor,

			setAttributes,
			changeState,
			getState,
		} = this.props;
		
		return (
			<InspectorControls>
				<PanelBody title={ __('Settings', 'getwid') }>
					<PanelColorSettings
						title={__('Colors', 'getwid')}
						colorSettings={[
							{
								value: textColor.color,
								onChange: setTextColor,
								label: __('Text Color', 'getwid')
							},
						]}
					/>						
					<SelectControl
						label={__('Display Content', 'getwid')}
						value={showContent}
						options={[
							{value: 'excerpt', label: __('Excerpt', 'getwid')},
							{value: 'content', label: __('Post Content', 'getwid')},
							{value: 'full', label: __('Full content', 'getwid')},
						]}
						onChange={showContent => setAttributes({showContent})}
					/>

					{ showContent == 'excerpt' &&
						<RangeControl
							label={ __( 'Number of words', 'getwid' ) }
							value={ contentLength }
							onChange={ ( contentLength ) => setAttributes( { contentLength } ) }
							min={ 5 }
							max={ Getwid.settings.excerpt_length }
						/>
					}
				</PanelBody>
			</InspectorControls>
		);
	}
}