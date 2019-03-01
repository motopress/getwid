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
					title={__('Spacer Settings', 'getwid')}
				>
					<GetwidStyleLengthControl
						label={__('Spacer height', 'getwid')}
						value={height}
						units = {[
							{label: 'px', value: 'px'},
						 ]}					
						onChange={height => {
							console.log(height);
							setAttributes({ height });
						}}
					/>
					<CheckboxControl
						label={__('Hide desktop', 'getwid')}
						checked={isHideDesktop}
						onChange={(isHideDesktop) => { setAttributes({ isHideDesktop }) }}
					/>
					<CheckboxControl
						label={__('Hide tablet', 'getwid')}
						checked={isHideTablet}
						onChange={(isHideTablet) => { setAttributes({ isHideTablet }) }}
					/>
					<CheckboxControl
						label={__('Hide mobile', 'getwid')}
						checked={isHideMobile}
						onChange={(isHideMobile) => { setAttributes({ isHideMobile }) }}
					/>
				</PanelBody>
			</InspectorControls>
		);
	}
}

export default (Inspector);