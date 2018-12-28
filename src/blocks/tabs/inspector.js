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
	RadioControl
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
				type,
				active,
				headerTag,
				heightStyle
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
			   case "auto": { 
			      getHelp = __('All panels will be set to the height of the tallest panel', 'getwid'); 
			      break; 
			   }					   
			}			
		};
		setHelp();

		// options={times(items.length, (n) => ({value: n, label: n + 1}) )}
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
					label={__('Type', 'getwid')}
					value={type}
					options={[
						{value: '', label: __('Horizontal Left', 'getwid')},
						{value: 'horizontal-center', label: __('Horizontal Center', 'getwid')},
						{value: 'horizontal-right', label: __('Horizontal Right', 'getwid')},
						{value: 'vertical-left', label: __('Vertical Left', 'getwid')},
						{value: 'vertical-right', label: __('Vertical Right', 'getwid')},
					]}
					onChange={type => setAttributes({type})}
				/>
				<SelectControl
					label={__('Active by default', 'getwid')}
					value={active}
					options={times(items.length, (n) => ({value: n, label: (titles[n].content.length > 30 ? titles[n].content.substr(0, 30) + '...' : titles[n].content)}) )}
					onChange={active => setAttributes({active})}
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