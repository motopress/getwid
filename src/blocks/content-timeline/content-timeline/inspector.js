/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
import { renderPaddingsPanel } from 'GetwidUtils/render-inspector';

import GetwidStyleLengthControl from 'GetwidControls/style-length-control';
import GetwidCustomTabsControl  from 'GetwidControls/custom-tabs-control';

const { Component, Fragment } = wp.element;
const { InspectorControls, PanelColorSettings } = wp.editor;
const { ToggleControl, PanelBody, SelectControl, BaseControl, Button } = wp.components;

class Inspector extends Component {
	constructor() {
		super(...arguments);

		this.changeState  = this.changeState .bind( this );

		this.state = {
			tabName: 'style'
		};
	}

	changeState(param, value) {
		this.setState( { [ param ]: value } );
	}

	render() {
		const { filling, animation } = this.props.attributes;
		const { setBackgroundColor, setFillColor } = this.props;
		const { backgroundColor, fillColor, setAttributes, clientId, getBlock } = this.props;

		const { horizontalSpace, marginBottom } = this.props.attributes;

		const enableFilling = getBlock( clientId ).innerBlocks.length > 1 ? true : false;

		const { tabName } = this.state;
		const { changeState } = this;

		return (
			<InspectorControls>
				<GetwidCustomTabsControl
					state={tabName}
					stateName={'tabName'}
					onChangeTab={changeState}
					tabs = {[ 'style', 'advanced' ]}
				/>

				{ tabName === 'style' && (
					<Fragment>
						<PanelColorSettings
							title={__( 'Colors', 'getwid' )}
							colorSettings={[
								{
									value: backgroundColor.color,
									onChange: setBackgroundColor,
									label: __( 'Background Color', 'getwid' )
								},
								...( $.parseJSON( filling ) ? [ {
									value: fillColor.color,
									onChange: setFillColor,
									label: __( 'Progress Color', 'getwid' )
								} ] : [] )
							]}
						/>
						<PanelBody title={__( 'Spacing', 'getwid' )} initialOpen={false}>
							<GetwidStyleLengthControl
								label={__( 'Horizontal Space', 'getwid' )}
								value={horizontalSpace ? horizontalSpace : ''}
								onChange={horizontalSpace => {
									setAttributes( {
										horizontalSpace
									} );
								}}
							/>
							<BaseControl>
								<Button isLink
									onClick={() => {
										setAttributes({
											horizontalSpace: undefined
										});
									}}
									disabled={!horizontalSpace}>
									{__( 'Reset', 'getwid' )}
								</Button>
							</BaseControl>
							<GetwidStyleLengthControl
								label={__( 'Vertical Space', 'getwid' )}
								value={marginBottom}
								onChange={marginBottom => {
									setAttributes( {
										marginBottom
									} );
								}}
							/>
							<BaseControl>
								<Button isLink
									onClick={() => {
										setAttributes( {
											marginBottom: undefined
										} );
									}}
									disabled={ ! marginBottom}>
									{__( 'Reset', 'getwid' )}
								</Button>
							</BaseControl>
						</PanelBody>

						<PanelBody title={__( 'Padding', 'getwid' )} initialOpen={false}>
							{ renderPaddingsPanel( this ) }
						</PanelBody>
					</Fragment>					
				) }

				{ tabName === 'advanced' && (
					<Fragment>
						<SelectControl
							label={__('Block Animation', 'getwid')}
							value={animation}
							onChange={animation => {
								setAttributes({ animation });
							}}
							options={[
								{ value: 'none'         , label: __( 'None'       , 'getwid' ) },
								{ value: 'slideInSides' , label: __( 'Slide In'   , 'getwid' ) },
								{ value: 'slideInBottom', label: __( 'Slide In Up', 'getwid' ) },
								{ value: 'fadeIn'       , label: __( 'Fade In'    , 'getwid' ) }
							]}
						/>
						{ enableFilling && (
							<ToggleControl
								label={__( 'Display scroll progress', 'getwid' )}
								checked={filling == 'true' ? true : false}
								onChange={value => {
									setAttributes( {
										filling: value ? 'true' : 'false'
									} );
								} }
							/>
						) }
					</Fragment>					
				)}
			</InspectorControls>
		);
	}
}

export default Inspector;
