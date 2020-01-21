/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import classnames from 'classnames';

import GetwidCustomColorPalette from 'GetwidControls/custom-color-palette';

const { compose } = wp.compose;
const { Component, Fragment } = wp.element;
const { PanelBody, TextControl } = wp.components;
const { InspectorControls, InnerBlocks, RichText, withColors } = wp.blockEditor || wp.editor;

/**
* Module Constants
*/
const ALLOWED_BLOCKS = [
	'getwid/field-name',
	'getwid/field-email',
	'getwid/field-textarea',
	'getwid/captcha',
	'core/paragraph',
	'core/spacer'
];

/**
* Create an Component
*/
class GetwidContactForm extends Component {

	constructor() {
		super(...arguments);
	}

	render() {
		const { textColor, backgroundColor } = this.props;
		const { className, setTextColor, setBackgroundColor, contactFormClass, customBackgroundColor, customTextColor } = this.props;
		
		const buttonSubmitClass = classnames(
			'wp-block-button__link', {
				'has-background': backgroundColor.color,
				[backgroundColor.class]: backgroundColor.class,

				'has-text-color': textColor.color,
				[textColor.class]: textColor.class
			}
		);

		return (
			<Fragment>
				<div className={ `${className}` }>
					<div className={ `${contactFormClass}__wrapper` }>
						<InnerBlocks
							templateInsertUpdatesSelection={ false }
							allowedBlocks={ ALLOWED_BLOCKS }
							template={ [
								[ 'getwid/field-name'  , { required: true } ],
								[ 'getwid/field-email' , { required: true } ],

								[ 'getwid/field-textarea', { required: true } ]
							] }
						/>
					</div>
					<div className={ 'wp-block-button' }>
						<RichText
							placeholder={ __( 'Write text…', 'getwid' ) }
							value={ this.props.attributes.text }
							formattingControls= { [ 'bold', 'italic', 'strikethrough' ] }
							onChange= { text =>
								this.props.setAttributes( { text } )
							}
							className={ buttonSubmitClass }
							style={ {
								backgroundColor: backgroundColor.color,
								color: textColor.color
							} }
							keepPlaceholderOnFocus
						/>
					</div>
				</div>
				<InspectorControls>
					<PanelBody title={ __( 'Settings', 'getwid' ) } initialOpen={ true }>
						<TextControl
							label={ __( 'Email Subject Line', 'getwid' ) }
							value={ this.props.attributes.subject }
							onChange={ subject =>
								this.props.setAttributes( { subject } )
							}
						/>
						<GetwidCustomColorPalette
							colorSettings={[{
									title: __( 'Button Text Color', 'getwid' ),
									colors: {
										customColor: customTextColor,
										defaultColor: textColor
									},
									changeColor: setTextColor
								}, {
									title: __( 'Button Background Color', 'getwid' ),
									colors: {
										customColor: customBackgroundColor,
										defaultColor: backgroundColor
									},
									changeColor: setBackgroundColor
								}
							]}
						/>
					</PanelBody>
				</InspectorControls>
			</Fragment>
		);
	}
}

export default compose( [
	withColors( 'backgroundColor', { textColor: 'color' } )
] )( GetwidContactForm );