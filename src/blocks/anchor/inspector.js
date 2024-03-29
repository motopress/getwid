/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
const {Component} = wp.element;
const {
	InspectorControls,
} = wp.blockEditor || wp.editor;
const {
	PanelBody,
	TextControl,
	ExternalLink,
	BaseControl
} = wp.components;


/**
* Create an Inspector Controls
*/
class Inspector extends Component {

	constructor() {
		super(...arguments);
	}

	render() {
		const {
			attributes: {
				anchor
			},
			setAttributes,
		} = this.props;

		return (
			<InspectorControls>
				<PanelBody
					title={__('Settings', 'getwid')}
				>
					<TextControl
						label={__( 'HTML Anchor', 'getwid' )}
						value={ anchor }
						onChange={ anchor => {
							setAttributes({ anchor })
						}}
					/>
					<BaseControl>
						<ExternalLink href={'https://wordpress.org/support/article/page-jumps/'}> {__( 'Learn more about anchors', 'getwid' )} </ExternalLink>
					</BaseControl>
				</PanelBody>
			</InspectorControls>
		);
	}
}

export default (Inspector);