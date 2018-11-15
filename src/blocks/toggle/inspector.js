import {times} from 'lodash';
// Setup the block
const {__} = wp.i18n;
const {Component} = wp.element;

const {
	InspectorControls,
} = wp.editor;

const {
	PanelBody,
	SelectControl,
	TextControl,
	RadioControl
} = wp.components;

/**
 * Create an Inspector Controls wrapper Component
 */
export default class Inspector extends Component {

	render() {

		const {
			attributes: {
				items,
				iconPosition,
				active
			},
			setAttributes
		} = this.props;

		return (
			<InspectorControls>
				<PanelBody title={__('Basic', 'getwid')} initialOpen={false}>
					<SelectControl
						label={__('Icon position', 'getwid')}
						value={iconPosition}
						options={[
							{value: 'left', label: __('Left', 'getwid')},
							{value: 'right', label: __('Right', 'getwid')},
						]}
						onChange={iconPosition => setAttributes({iconPosition})}
					/>
					<SelectControl
						label={__('Active by default', 'getwid')}
						value={active}
						options={[
							...[{value: 'false', label: __('None', 'getwid')}],
							...times(items.length, (n) => ({value: n, label: n + 1}))
						]}
						onChange={val => {setAttributes({active:val})}}
					/>
				</PanelBody>
			</InspectorControls>
		);
	}

}