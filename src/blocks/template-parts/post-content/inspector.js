/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
const {
	Component,
	Fragment
} = wp.element;
const {
	PanelColorSettings,
	InspectorControls,
	FontSizePicker,	
} = wp.blockEditor;
const {
	SelectControl,
	PanelBody,
	RangeControl,
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
				showContent,
				contentLength,
			},
			textColor,
			setTextColor,

			fontSize,
			setFontSize,
			fallbackFontSize,			

			setAttributes,
		} = this.props;
		
		return (
			<InspectorControls>
				<PanelBody title={ __('Settings', 'getwid') }>
					<PanelColorSettings
						title={__('Text Color', 'getwid')}
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
							{value: 'full', label: __('Full Content', 'getwid')},
						]}
						onChange={showContent => setAttributes({showContent})}
					/>

					{ showContent == 'excerpt' &&
						<Fragment>
							<RangeControl
								label={ __( 'Number of words', 'getwid' ) }
								value={ contentLength }
								onChange={ ( contentLength ) => setAttributes( { contentLength } ) }
								min={ 5 }
								max={ Getwid.settings.excerpt_length }
							/>

							<FontSizePicker
								fallbackFontSize={ fallbackFontSize }
								value={ fontSize.size }
								onChange={ setFontSize }
							/>
						</Fragment>
					}
				</PanelBody>
			</InspectorControls>
		);
	}
}