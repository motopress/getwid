/**
* External dependencies
*/
import {times} from 'lodash';
import GetwidIconPicker from 'GetwidControls/icon-picker';


/**
* WordPress dependencies
*/
const {Component} = wp.element;
const {
	InspectorControls,
} = wp.editor;
const {
	PanelBody,
	SelectControl,
	BaseControl
} = wp.components;


/**
* Create an Inspector Controls
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
	
		return (
			<InspectorControls>
				<PanelBody
					title={__('Settings', 'getwid')}
				>
					<BaseControl
						label={__('Icon', 'getwid')}
					>
						<GetwidIconPicker
							value={iconClose}
							onChange={iconClose => setAttributes({iconClose})}
						/>
					</BaseControl>

					<BaseControl
						label={__('Active Icon', 'getwid')}
					>
						<GetwidIconPicker
							value={iconOpen}
							onChange={iconOpen => setAttributes({iconOpen})}
						/>
					</BaseControl>
					
					<SelectControl
						label={__('Icon Position', 'getwid')}
						value={iconPosition}
						options={[
							{value: 'left', label: __('Left', 'getwid')},
							{value: 'right', label: __('Right', 'getwid')},
						]}
						onChange={iconPosition => setAttributes({iconPosition})}
					/>

					<SelectControl
						label={__('Title Tag', 'getwid')}
						value={headerTag}
						options={[
							{value: 'span', label: __('Paragraph', 'getwid')},
							{value: 'h2', label: __('Heading 2', 'getwid')},
							{value: 'h3', label: __('Heading 3', 'getwid')},
							{value: 'h4', label: __('Heading 4', 'getwid')},
							{value: 'h5', label: __('Heading 5', 'getwid')},
							{value: 'h6', label: __('Heading 6', 'getwid')},
						]}
						onChange={headerTag => setAttributes({headerTag})}
					/>			

					<SelectControl
						label={__('Active by default', 'getwid')}
						value={active}
						options={times(items.length, (n) => ({value: n, label: (titles[n].content.length > 30 ? titles[n].content.substr(0, 30) + '�' : titles[n].content)}) )}
						onChange={val => {setAttributes({active:val})}}
					/>
				</PanelBody>
			</InspectorControls>
		);
	}

}