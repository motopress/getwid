import {times} from 'lodash';
import GetwidIconPicker from 'GetwidControls/icon-picker';
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
	RadioControl,
	BaseControl
} = wp.components;

/**
 * Create an Inspector Controls wrapper Component
 */
export default class Inspector extends Component {

	render() {

		const {
			attributes: {
				titles,
				items,
				iconPosition,
				iconOpen,
				iconClose,
				active,
				headerTag
			},
			setAttributes
		} = this.props;

						// ...times(items.length, (n) => ({value: n, label: n + 1}))
		return (
			<InspectorControls>
				<PanelBody
					title={__('Settings', 'getwid')}
				>
					<BaseControl
						label={__('Icon Open', 'getwid')}
					>
						<GetwidIconPicker
							value={iconOpen}
							onChange={iconOpen => setAttributes({iconOpen})}
						/>
					</BaseControl>

					<BaseControl
						label={__('Icon Close', 'getwid')}
					>
						<GetwidIconPicker
							value={iconClose}
							onChange={iconClose => setAttributes({iconClose})}
						/>
					</BaseControl>

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
							...times(items.length, (n) => ({value: n, label: (titles[n].content.length > 30 ? titles[n].content.substr(0, 30) + '...' : titles[n].content)}))
						]}
						onChange={val => {setAttributes({active:val})}}
					/>
				</PanelBody>
			</InspectorControls>
		);
	}

}