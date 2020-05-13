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
	ToggleControl,
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
				allowedTags
			},
			isSelected,
			setAttributes,
		} = this.props;

		return (
			<InspectorControls>
				<PanelBody
					title={__('Settings', 'getwid')}
				>
					<BaseControl
						label={__('Allowed Tags', 'getwid')}
					>
						{allowedTags.map((a, i) => (
							<ToggleControl
								label={`H${i + 2}`}
								checked={a}
								onChange={() =>
									setAttributes({
										allowedTags: [
											...allowedTags.slice(0, i),
											!allowedTags[i],
											...allowedTags.slice(i + 1)
										]
									})
								}
							/>
						))}
					</BaseControl>
				</PanelBody>
			</InspectorControls>
		);
	}
}

export default (Inspector);
