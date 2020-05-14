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
	BaseControl,
	RadioControl
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
				allowedTags,
				listStyle
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

					<RadioControl
					    label={__('List Style', 'getwid')}
					    selected={ listStyle }
					    options={ [
							{value: 'none', label: __('None', 'getwid')},
							{value: 'list', label: __('List', 'getwid')},
							{value: 'numbered', label: __('Numbered List', 'getwid')},
					    ] }
					    onChange={listStyle => setAttributes({listStyle}) }
					/>
				</PanelBody>
			</InspectorControls>
		);
	}
}

export default (Inspector);
