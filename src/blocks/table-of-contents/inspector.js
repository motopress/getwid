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
						label={__('Level', 'getwid')}
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
					    label={__('Style', 'getwid')}
					    selected={ listStyle }
					    options={ [
							{value: 'none', label: __('Default', 'getwid')},
							{value: 'list', label: __('Unordered list', 'getwid')},
							{value: 'numbered', label: __('Ordered List', 'getwid')},
					    ] }
					    onChange={listStyle => setAttributes({listStyle}) }
					/>
				</PanelBody>
			</InspectorControls>
		);
	}
}

export default (Inspector);