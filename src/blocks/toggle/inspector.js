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
				active,
				headerTag
			},
			setAttributes
		} = this.props;

		return (
			<InspectorControls>
				<SelectControl
					label={__('Header tag', 'getwid')}
					value={headerTag}
					options={[
						{value: 'span', label: __('span', 'getwid')},
						{value: 'h2', label: __('h2', 'getwid')},
						{value: 'h3', label: __('h3', 'getwid')},
						{value: 'h4', label: __('h4', 'getwid')},
						{value: 'h5', label: __('h5', 'getwid')},
						{value: 'h6', label: __('h6', 'getwid')},
					]}
					onChange={headerTag => setAttributes({headerTag})}
				/>					
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
						...[{value: 'all', label: __('All', 'getwid')}],
						...times(items.length, (n) => ({value: n, label: n + 1}))
					]}
					onChange={val => {setAttributes({active:val})}}
				/>
			</InspectorControls>
		);
	}

}