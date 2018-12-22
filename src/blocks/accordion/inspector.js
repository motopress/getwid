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
				heightStyle,
				headerTag
			},
			setAttributes
		} = this.props;
	
		let getHelp;
		const setHelp = () => {
			switch(heightStyle) {
			   case "content": { 
			      getHelp = __('Each panel will be only as tall as its content', 'getwid');
			      break; 
			   }
			   case "fill": { 
			      getHelp = __('Expand to the available height based on the accordion\'s parent height', 'getwid');
			      break;    
			   }
			   case "auto": { 
			      getHelp = __('All panels will be set to the height of the tallest panel', 'getwid'); 
			      break; 
			   }					   
			}			
		};
		setHelp();

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
					options={times(items.length, (n) => ({value: n, label: n + 1}) )}
					onChange={val => {setAttributes({active:val})}}
				/>
				<RadioControl
				    label={__('Height Style', 'getwid')}
				    selected={ heightStyle !== undefined ? heightStyle : '' }
				    help={getHelp}
				    options={ [
						{value: 'content', label: __('Content', 'getwid')},
						{value: 'auto', label: __('Auto', 'getwid')},
				    ] }
				    onChange={heightStyle => {
				    	setAttributes({heightStyle});
				    	setHelp();
				    } }
				/>
			</InspectorControls>
		);
	}

}