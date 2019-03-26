import GetwidStyleLengthControl from 'GetwidControls/style-length-control';

const {__} = wp.i18n;
const {Component} = wp.element;

const {
	InspectorControls,
} = wp.editor;

const {
	BaseControl, 
	PanelBody, 
	CheckboxControl
} = wp.components;

class Inspector extends Component {

	constructor() {
		super(...arguments);
	}

	render() {
		const {
			attributes: {
				height,
				isHideDesktop,
				isHideTablet,			
				isHideMobile,
			},
			setAttributes,
		} = this.props;

		return (
			<InspectorControls>
				<PanelBody
					title={__('Settings', 'getwid')}
				>
					<GetwidStyleLengthControl
						label={__('Height', 'getwid')}
						value={height}
						units = {[
							{label: 'px', value: 'px'},
							{label: 'vh', value: 'vh'},
							{label: 'vw', value: 'vw'},
						 ]}					
						onChange={height => {
							console.log(height);
							setAttributes({ height });
						}}
					/>
					<CheckboxControl
						label={__('Hide on Desktop', 'getwid')}
						checked={isHideDesktop}
						onChange={(isHideDesktop) => { setAttributes({ isHideDesktop }) }}
					/>
					<CheckboxControl
						label={__('Hide on Tablet', 'getwid')}
						checked={isHideTablet}
						onChange={(isHideTablet) => { setAttributes({ isHideTablet }) }}
					/>
					<CheckboxControl
						label={__('Hide on Mobile', 'getwid')}
						checked={isHideMobile}
						onChange={(isHideMobile) => { setAttributes({ isHideMobile }) }}
					/>
				</PanelBody>
			</InspectorControls>
		);
	}
}

export default (Inspector);