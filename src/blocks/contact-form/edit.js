/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
import classnames from 'classnames';

const { compose } = wp.compose;
const { Component, Fragment } = wp.element;
const { PanelBody, TextControl } = wp.components;
const { InspectorControls, PanelColorSettings, InnerBlocks, RichText, withColors } = wp.editor;

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
		const { className, setTextColor, setBackgroundColor, contactFormClass } = this.props;
		
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
							label={ __( 'Subject', 'getwid' ) }
							value={ this.props.attributes.subject }
							onChange={ subject =>
								this.props.setAttributes( { subject } )
							}
						/>
						<PanelColorSettings
							title={ __( 'Colors', 'getwid' ) }
							colorSettings={ [
								{
									value: textColor.color,
									onChange: setTextColor,
									label: __( 'Button Text Color', 'getwid' )
								},
								{
									value: backgroundColor.color,
									onChange: setBackgroundColor,
									label: __( 'Button Background Color', 'getwid' )
								}
							] }
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