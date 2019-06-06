/**
* WordPress dependencies
*/
import { __ } from 'wp.i18n';
const {Component, Fragment} = wp.element;
const {
	InspectorControls,
} = wp.editor;
const {
	PanelBody,
	SelectControl,
	TabPanel,
	RadioControl
} = wp.components;


/**
* Create an Inspector Controls
*/
export default class Inspector extends Component {

	render() {

		const {
			attributes: {
				alignment,
				direction,
			},
			setAttributes
		} = this.props;

		return (
			<InspectorControls>
				<PanelBody
					title={__('Settings', 'getwid')}
				>
					<SelectControl
						label={__('Horizontal Alignment', 'getwid')}
						value={ alignment }
						onChange={alignment => setAttributes({alignment})}
						options={[
							{value: 'left', label: __('Left', 'getwid')},
							{value: 'center', label: __('Center', 'getwid')},
							{value: 'right', label: __('Right', 'getwid')},
						]}
					/>
					<SelectControl
						label={__('Direction', 'getwid')}
						value={ direction }
						onChange={direction => setAttributes({direction})}
						options={[
							{value: 'row', label: __('Horizontal', 'getwid')},
							{value: 'column', label: __('Vertical', 'getwid')},
						]}
					/>
				</PanelBody>
			</InspectorControls>
		);
	}

}