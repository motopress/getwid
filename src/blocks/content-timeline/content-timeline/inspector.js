/**
* External dependencies
*/
import { __ } from 'wp.i18n';

/**
* Internal dependencies
*/
import GetwidStyleLengthControl from 'GetwidControls/style-length-control';
import GetwidCustomColorPalette from 'GetwidControls/custom-color-palette';

import { renderPaddingsPanel } from 'GetwidUtils/render-inspector';

/**
* WordPress dependencies
*/
const { Component } = wp.element;
const { InspectorControls } = wp.blockEditor || wp.editor;
const { ToggleControl, PanelBody, SelectControl, BaseControl, Button } = wp.components;

const { jQuery: $ } = window;

/**
* Create an Component
*/
class Inspector extends Component {
	constructor() {
		super(...arguments);
	}

	render() {
		const { filling, animation } = this.props.attributes;
		const { setBackgroundColor, setFillColor } = this.props;
		const { backgroundColor, customBackgroundColor, fillColor, customFillColor, setAttributes, clientId, getBlock } = this.props;

		const { horizontalSpace, marginBottom } = this.props.attributes;

		let enableFilling;
		const currentBlock = getBlock( clientId );

		if ( ! currentBlock ) {
			return (
				<InspectorControls></InspectorControls>
			);
		}

		enableFilling = currentBlock.innerBlocks.length > 1 ? true : false;

		return (
			<InspectorControls>
				<PanelBody title={__( 'Settings', 'getwid' )} initialOpen={true}>
					<SelectControl
						label={__( 'Block Animation', 'getwid' )}
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
					{enableFilling && (
						<ToggleControl
							label={__( 'Display scroll progress', 'getwid' )}
							checked={filling == 'true' ? true : false}
							onChange={value => {
								setAttributes({
									filling: value ? 'true' : 'false'
								});
							}}
						/>
					)}
					<GetwidCustomColorPalette
						colorSettings={[{
								title: __( 'Background Color', 'getwid' ),
								colors: {
									customColor: customBackgroundColor,
									defaultColor: backgroundColor
								},
								changeColor: setBackgroundColor
							}, 
						...($.parseJSON( filling ) ? [{
								title: __( 'Progress Color', 'getwid' ),
								colors: {
									customColor: customFillColor,
									defaultColor: fillColor
								},
								changeColor: setFillColor
							}] : [])
						]}
					/>
					<GetwidStyleLengthControl
						label={__( 'Horizontal Space', 'getwid' )}
						value={horizontalSpace ? horizontalSpace : ''}
						onChange={horizontalSpace => {
							setAttributes({
								horizontalSpace
							});
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
							setAttributes({
								marginBottom
							});
						}}
					/>
					<BaseControl>
						<Button isLink
							onClick={() => {
								setAttributes({
									marginBottom: undefined
								});
							}}
							disabled={!marginBottom}>
							{__( 'Reset', 'getwid' )}
						</Button>
					</BaseControl>
					<PanelBody title={__( 'Padding', 'getwid' )} initialOpen={true}>
						{renderPaddingsPanel( this )}
					</PanelBody>
				</PanelBody>
			</InspectorControls>
		);
	}
}

export default Inspector;
