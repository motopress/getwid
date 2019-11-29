/**
 * External dependencies
 */
import GetwidCustomTabsControl from 'GetwidControls/custom-tabs-control';
import { __ } from 'wp.i18n';
const {jQuery: $} = window;

/**
* WordPress dependencies
*/
const { Component, Fragment } = wp.element;
const { InspectorControls, PanelColorSettings } = wp.editor;
const { RangeControl, CheckboxControl, PanelBody } = wp.components;

/**
* Create an Component
*/
class Inspector extends Component {

	constructor() {
		super(...arguments);

		this.changeState = this.changeState.bind(this);

		this.state = {
			tabName: 'general',
		};			
	}

	changeState (param, value) {
		this.setState({[param]: value});
	}
	
	getState (value) {
		return this.state[value];
	}	

	render() {
		const { setTextColor, textColor } = this.props;
		const { fillAmount, isAnimated } = this.props.attributes;
		const { setAttributes, backgroundColor, setBackgroundColor } = this.props;

		const {
			tabName,
		} = this.state;
		
		const changeState = this.changeState;

		return (
			<InspectorControls>
				<GetwidCustomTabsControl
					state={tabName}
					stateName={'tabName'}
					onChangeTab={changeState}
					tabs={['general','style']}
				/>

				{ tabName === 'general' && (
					<Fragment>	
						<RangeControl
							label={__('Value', 'getwid')}
							value={fillAmount}
							onChange={fillAmount => {
								setAttributes({ fillAmount })
							}}
							initialPosition={fillAmount}
							min={0}
							max={100}
							step={1}
						/>
						<CheckboxControl
							label="Animate"
							checked={(isAnimated === 'true' ? true : false)}
							onChange={value => {
								setAttributes({ isAnimated: value ? 'true' : 'false' })
							}}
						/>
					</Fragment>
				)}

				{ tabName === 'style' && (
					<Fragment>	
						<PanelColorSettings
							title={__('Colors', 'getwid')}
							colorSettings={[
								{
									value: textColor.color,
									onChange: setTextColor,
									label: __('Progress Color', 'getwid')
								},
								{
									value: backgroundColor.color,
									onChange: setBackgroundColor,
									label: __('Background Color', 'getwid')
								}
							]}
						/>
					</Fragment>
				)}
			</InspectorControls>
		);
	}
}

export default Inspector;