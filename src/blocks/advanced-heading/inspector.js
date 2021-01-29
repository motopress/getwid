/**
* Internal dependencies
*/
import GetwidCustomTabsControl from 'GetwidControls/custom-tabs-control';
import GetwidStyleLengthControl from 'GetwidControls/style-length-control';
import GetwidGoogleFontsControl from 'GetwidControls/google-fonts-control';

import { renderFontSizePanel, renderMarginsPanel, renderPaddingsPanel } from 'GetwidUtils/render-inspector';

/**
* External dependencies
*/
import { __ } from 'wp.i18n';

const { Component, Fragment } = wp.element;
const { PanelBody, SelectControl } = wp.components;
const { InspectorControls, PanelColorSettings } = wp.blockEditor || wp.editor;

/**
* Create an Inspector Controls
*/
class Inspector extends Component {

	constructor( props ) {
		super( ...arguments );

		this.changeState = this.changeState.bind( this );

		this.state = {
			tabName: 'general'
		};
	}

	changeState(param, value) {
		if (typeof param == 'object') {
			this.setState(param);
		} else if (typeof param == 'string') {
			this.setState({[param]: value});
		}
	}

	render() {
		const { tabName } = this.state;
		const { changeState } = this;

		return (
			<InspectorControls key='inspector'>
				<GetwidCustomTabsControl
					state={tabName}
					stateName='tabName'
					onChangeTab={changeState}
					tabs = {[ 'general', 'style' ]}
				/>

				{ tabName === 'general' && (
					<Fragment>
						{ this.renderGeneralSettings() }
					</Fragment>
				) }

				{ tabName === 'style' && (
					<Fragment>
						{ this.renderStyleSettings() }
					</Fragment>
				)}
			</InspectorControls>
		);
	}

	renderGeneralSettings() {

		const { fontID, fontFamily, fontWeight, fontStyle, textTransform, lineHeight, letterSpacing } = this.props.attributes;
		const { setAttributes } = this.props;

		const { titleTag } = this.props.attributes;

		return (
			<Fragment>
				<PanelBody initialOpen={true}>
					<GetwidGoogleFontsControl
						label={ __( 'Font Family', 'getwid' ) }
						value={fontFamily}
						onChangeFontID={value => {
							setAttributes({
								fontID: value,
							});
						}}
						onChangeFontFamily={value => {
							setAttributes({
								fontFamily: value,
								fontWeight: 'normal'
							});
						}}
						valueWeight={fontWeight}
						onChangeFontWeight={value => {
							setAttributes({ fontWeight: value });
						}}
					/>
					{ renderFontSizePanel( this ) }
					<SelectControl
						label={__( 'Font Style', 'getwid' )}
						value={fontStyle}
						options={[
							{ value: 'normal' , label: __( 'Normal' , 'getwid' ) },
							{ value: 'italic' , label: __( 'Italic' , 'getwid' ) },
							{ value: 'inherit', label: __( 'Inherit', 'getwid' ) }
						]}
						onChange={fontStyle => setAttributes({ fontStyle })}
					/>
					<SelectControl
						label={__( 'Text Transform', 'getwid' )}
						value={textTransform}
						options={[
							{ value: 'none'      , label: __( 'None'      , 'getwid' ) },
							{ value: 'capitalize', label: __( 'Capitalize', 'getwid' ) },
							{ value: 'lowercase' , label: __( 'Lowercase' , 'getwid' ) },
							{ value: 'uppercase' , label: __( 'Uppercase' , 'getwid' ) },
							{ value: 'inherit'   , label: __( 'Inherit'   , 'getwid' ) }
						]}
						onChange={ textTransform => setAttributes({ textTransform }) }
					/>
					<GetwidStyleLengthControl
						label={__( 'Line Height', 'getwid' )}
						value={lineHeight}
						onChange={lineHeight => {
							setAttributes({ lineHeight });
						}}
					/>
					<GetwidStyleLengthControl
						label={__( 'Letter Spacing', 'getwid' )}
						value={letterSpacing}
						allowNegative={true}
						units = {[
							{ label: 'px', value: 'px' },
							{ label: 'em', value: 'em' },
							{ label: 'pt', value: 'pt' },
							{ label: 'vh', value: 'vh' },
							{ label: 'vw', value: 'vw' }
						]}
						onChange={letterSpacing => {
							setAttributes({ letterSpacing });
						} }
					/>
				</PanelBody>
				<PanelBody title={__( 'Html Attributes', 'getwid' )} initialOpen={true}>
					<SelectControl
						label={__( 'Title Tag', 'getwid' )}
						value={titleTag}
						options={[
							{ value: 'span', label: __( 'Span'     , 'getwid' ) },
							{ value: 'p'   , label: __( 'Paragraph', 'getwid' ) },
							{ value: 'h1'  , label: __( 'Heading 1', 'getwid' ) },
							{ value: 'h2'  , label: __( 'Heading 2', 'getwid' ) },
							{ value: 'h3'  , label: __( 'Heading 3', 'getwid' ) },
							{ value: 'h4'  , label: __( 'Heading 4', 'getwid' ) },
							{ value: 'h5'  , label: __( 'Heading 5', 'getwid' ) },
							{ value: 'h6'  , label: __( 'Heading 6', 'getwid' ) }
						]}
						onChange={titleTag => setAttributes({ titleTag })}
					/>
				</PanelBody>
			</Fragment>
		);
	}

	renderStyleSettings() {

		const { setBackgroundColor, setTextColor, backgroundColor, textColor } = this.props;

		return (
			<Fragment>
				<PanelColorSettings
					title={__( 'Colors', 'getwid' )}
                    initialOpen={true}
					colorSettings={[
						{
							value: textColor.color,
							onChange: setTextColor,
							label: __( 'Text Color', 'getwid' )
						},
						{
							value: backgroundColor.color,
							onChange: setBackgroundColor,
							label: __( 'Background Color', 'getwid' )
						}
					]}
				/>
				<PanelBody title={__( 'Padding', 'getwid' )} initialOpen={false}>
					{ renderPaddingsPanel( this ) }
				</PanelBody>

				<PanelBody title={__( 'Margin', 'getwid' )} initialOpen={false}>
					{ renderMarginsPanel( this ) }
				</PanelBody>
			</Fragment>
		);
	}
}

export default Inspector;
