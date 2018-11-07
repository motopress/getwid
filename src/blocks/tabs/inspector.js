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
} = wp.components;

/**
 * Create an Inspector Controls wrapper Component
 */
export default class Inspector extends Component {

	render() {

		const {
			attributes: {
				items,
				type,
				active
			},
			setAttributes
		} = this.props;

		return (
			<InspectorControls>
				<PanelBody title={__('Basic', 'getwid')} initialOpen={false}>
					<SelectControl
						label={__('Type', 'getwid')}
						value={type}
						options={[
							{value: '', label: __('Horizontal', 'getwid')},
							{value: 'vertical', label: __('Vertical', 'getwid')},
						]}
						onChange={type => setAttributes({type})}
					/>
					<SelectControl
						label={__('Active by default', 'getwid')}
						value={active}
						options={times(items.length, (n) => ({value: n, label: n + 1}) )}
						onChange={active => setAttributes({active})}
					/>
				</PanelBody>
			</InspectorControls>
		);
	}

}