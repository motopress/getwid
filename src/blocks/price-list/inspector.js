/**
 * External dependencies
 */
import { __ } from 'wp.i18n';
import GetwidCustomTabsControl from 'GetwidControls/custom-tabs-control';
const {jQuery: $} = window;

import { get } from 'lodash';
const { select } = wp.data;
const { Component, Fragment } = wp.element;
const { InspectorControls, PanelColorSettings } = wp.editor;
const { SelectControl, PanelBody, CheckboxControl, ColorIndicator, ColorPalette, BaseControl } = wp.components;

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
		const { textColor, setTextColor, setAttributes } = this.props;
		const { titleTag, dotted, currencyPosition, customTextColor } = this.props.attributes;

		const {
			tabName,
		} = this.state;
		
		const changeState = this.changeState;

		const editorColors = get( select( 'core/editor' ).getEditorSettings(), [ 'colors' ], [] );

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
							label={ __( 'Title Tag', 'getwid' ) }
							value={ titleTag }
							options={ [
								{ value: 'p',  label: __( 'Paragraph', 'getwid' ) },
								{ value: 'h2', label: __( 'Heading 2', 'getwid' ) },
								{ value: 'h3', label: __( 'Heading 3', 'getwid' ) },
								{ value: 'h4', label: __( 'Heading 4', 'getwid' ) },
								{ value: 'h5', label: __( 'Heading 5', 'getwid' ) },
								{ value: 'h6', label: __( 'Heading 6', 'getwid' ) }
							] }
							onChange={titleTag =>
								setAttributes({ titleTag })
							}
						/>
						<SelectControl
							label={__( 'Currency Position', 'getwid' )}
							value={currencyPosition}
							onChange={currencyPosition => setAttributes( {
								currencyPosition
							} )}
							options={[
								{ value: 'currency-before', label: __( 'Before', 'getwid' ) },
								{ value: 'currency-before-space', label: __( 'Before with space', 'getwid' ) },
								{ value: 'currency-after' , label: __( 'After' , 'getwid' ) },
								{ value: 'currency-after-space' , label: __( 'After with space' , 'getwid' ) }
							]}
						/>
						<CheckboxControl
							label={ __( 'Divider', 'getwid' ) }
							checked={ dotted }
							onChange={ dotted =>
								setAttributes( { dotted } )
							}
						/>
					</Fragment>
				)}

				{ tabName === 'style' && (
					<Fragment>
						<BaseControl
							label={__('Text Color', 'getwid')}
							className="components-getwid-color-palette-control"
						>
							{(customTextColor || textColor.color) && (
								<ColorIndicator colorValue={customTextColor ? customTextColor : textColor.color}/>
							)}

							<ColorPalette
								colors= { editorColors }
								value= {textColor.color}
								onChange= {setTextColor }
							/>
						</BaseControl>										
					</Fragment>
				)}

			</InspectorControls>
		);
	}
}

export default Inspector;