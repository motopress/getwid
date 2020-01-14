/**
 * Internal dependencies
 */
import Inspector from './inspector';
import GoogleFontLoader from 'react-google-font-loader';

import './editor.scss';

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
const {jQuery: $} = window;
import classnames from 'classnames';

const {compose} = wp.compose;
const { Component, Fragment } = wp.element;
const { RichText, BlockControls, AlignmentToolbar, withColors } = wp.blockEditor || wp.editor;

/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-advanced-heading';

/**
* Create an Component
*/
class Edit extends Component {
	constructor( props ) {
		super( ...arguments );

		this.changeState = this.changeState.bind( this );

		this.state = {
			isLockedMargins: false,
			isLockedPaddings: false
		}
	}

	changeState(param, value) {
		this.setState( { [ param ]: value } );
	}

	componentDidMount() {
		const {
			clientId
		} = this.props;

		this.textWrapper = $( `[data-block='${clientId}'] .wp-block-getwid-advanced-heading` );
	}

	render() {
		const { className, backgroundColor, textColor, setAttributes } = this.props;

		const { content, titleTag, fontFamily, fontWeight, fontStyle, textTransform, lineHeight, letterSpacing } = this.props.attributes;
		const { paddingLeft, paddingRight, marginTop, marginBottom, marginLeft, marginRight, customTextColor } = this.props.attributes;
		const { fontSize, fontSizeTablet, fontSizeMobile, align, textAlignment, paddingTop, paddingBottom } = this.props.attributes;

		const changeState = this.changeState;

		const wrapperClass = {
			className: classnames(className,
				{
					'alignfull': align === 'full',
					'alignwide': align === 'wide',

					[ 'has-custom-font-size' ]: fontSize != undefined,
					
					[ `${fontSizeTablet}` ]: ( fontSizeTablet && fontSizeTablet != 'fs-tablet-100' ) ? fontSizeTablet: undefined,
					[ `${fontSizeMobile}` ]: ( fontSizeMobile && fontSizeMobile != 'fs-mobile-100' ) ? fontSizeMobile: undefined
				}
			),
			style: {
				fontSize    : fontSize != undefined ? fontSize : undefined,
				marginBottom: marginBottom,
				marginTop	: marginTop
			}
		};

		const wrapperContentClass = classnames(
			`${baseClass}__content`,
			{
				'has-text-color'   : textColor.color,
				[ textColor.class ]: textColor.class,

				'has-background' 		 : backgroundColor.color,
				[ backgroundColor.class ]: backgroundColor.class
			}
		);		

		const { isLockedMargins, isLockedPaddings } = this.state;

		return (
			<Fragment>
				{ fontFamily && (
					<GoogleFontLoader
						fonts={[ {
							font: fontFamily,
							weights: [fontWeight]
						} ]}
					/>
				)}
				<BlockControls>
					<AlignmentToolbar
						value={ textAlignment }
						onChange={ value => {
							setAttributes( { textAlignment: value } );
						}}
					/>
				</BlockControls>

				<Inspector {...{
					...this.props,
					isLockedMargins,
					isLockedPaddings,
					changeState
				}} key='inspector'/>

				<div {...wrapperClass} >
					<RichText
						className={ wrapperContentClass }
						tagName={ titleTag }
						value={ content }
						onChange={ ( value ) => setAttributes( { content: value } ) }		
						style={{
							textAlign: textAlignment,
							fontFamily: (fontFamily ? `"${fontFamily}"` : ''),
							fontWeight: fontWeight && fontWeight !='' ? fontWeight : undefined,
							fontStyle: fontStyle,
							textTransform: textTransform,
							lineHeight: lineHeight,
							letterSpacing: letterSpacing,
							paddingTop,
							paddingBottom,
							paddingLeft,
							paddingRight,
							marginLeft,
							marginRight,							
							color: ((typeof this.props.attributes.textColor != 'undefined' && typeof this.props.attributes.textColor.class == 'undefined') ?
								this.props.textColor.color : (customTextColor ? customTextColor : undefined)),
							backgroundColor: (this.props.backgroundColor.color ? this.props.backgroundColor.color : this.props.attributes.customBackgroundColor),
						}}
						placeholder={ __( 'Write heading…', 'getwid' ) }
					/>
				</div>
			</Fragment>
		);
	}
}

export default compose( [
	withColors( 'backgroundColor', { textColor: 'color' } ),
] )( Edit );