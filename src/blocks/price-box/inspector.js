import GetwidCustomTabsControl from 'GetwidControls/custom-tabs-control';
import { __ } from 'wp.i18n';
const {jQuery: $} = window;

const { Component, Fragment } = wp.element;
const { SelectControl, PanelBody } = wp.components;

const {
	InspectorControls,
	PanelColorSettings
} = wp.editor;

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
		const {
			attributes: {
				headerTag
			},

			setAttributes,

			backgroundColor,
			textColor,

			setBackgroundColor,
			setTextColor

		} = this.props;

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
						<SelectControl
							label={__('Title Tag', 'getwid')}
							value={headerTag}
							options={[
								{ value: 'p', label: __('Paragraph', 'getwid') },
								{ value: 'h2', label: __('Heading 2', 'getwid') },
								{ value: 'h3', label: __('Heading 3', 'getwid') },
								{ value: 'h4', label: __('Heading 4', 'getwid') },
								{ value: 'h5', label: __('Heading 5', 'getwid') },
								{ value: 'h6', label: __('Heading 6', 'getwid') },
							]}
							onChange={headerTag =>
								setAttributes({ headerTag })
							}
						/>
					</Fragment>
				)}

				{ tabName === 'style' && (
					<Fragment>	
						<PanelColorSettings
							title={__('Colors', 'getwid')}
							colorSettings={[
								{
									value: backgroundColor.color,
									onChange: setBackgroundColor,
									label: __('Background Color', 'getwid')
								},
								{
									value: textColor.color,
									onChange: setTextColor,
									label: __('Text Color', 'getwid')
								}
							]}
							initialOpen={true}
						/>
					</Fragment>
				)}
			</InspectorControls>
		);
	}
}

export default Inspector;