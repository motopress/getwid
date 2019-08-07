/**
 * Internal dependencies
 */
import Inspector from './inspector';
import GoogleFontLoader from 'react-google-font-loader';
import { isEqual } from "lodash";

import './editor.scss';

/**
* External dependencies
*/
import { __ } from 'wp.i18n';
import classnames from 'classnames';

const {compose} = wp.compose;
const { Component, Fragment } = wp.element;
const { RichText, BlockControls, AlignmentToolbar, withColors } = wp.editor;

/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-countdown';

/**
* Create an Component
*/
class Edit extends Component {
	constructor( props ) {
		super( ...arguments );

		this.changeState = this.changeState.bind( this );
		this.getState = this.getState.bind(this);
		this.initCountdown = this.initCountdown.bind(this);

		this.state = {
			isLockedMargins: false,
			isLockedPaddings: false
		}
	}

	changeState(param, value) {
		this.setState( { [ param ]: value } );
	}

	getState (value) {
		return this.state[value];
	}	

	initCountdown(isUpdate = false){
		const {
			attributes: {
				dateTime,
				year,
				months,
				weeks,
				days,
				hours,
				minutes,
				seconds,
			},
		} = this.props;

		console.log($( `.${baseClass}` ));
		const thisBlock = $( ReactDOM.findDOMNode( this ) );
		console.warn(thisBlock);
		
		const dataWrapper = $( `.${baseClass}__wrapper`, thisBlock );

		debugger;

		var dateTo = dateTime ? new Date(dateTime) : new Date();
		var dateFormat = '';

		if (year){
			dateFormat +='Y';
		}
		if (months){
			dateFormat +='O';
		}
		if (weeks){
			dateFormat +='W';
		}
		if (days){
			dateFormat +='D';
		}			
		if (hours){
			dateFormat +='H';
		}
		if (minutes){
			dateFormat +='M';
		}
		if (seconds){
			dateFormat +='S';
		}				

		if (isUpdate){
			dataWrapper.countdown('destroy');
		}
		dataWrapper.countdown({
			until: dateTo,
			format: dateFormat
		});
		// debugger;
	}

	componentDidMount() {
		this.initCountdown(false);
	}

	componentDidUpdate(prevProps, prevState) {
		if (!isEqual(this.props.attributes, prevProps.attributes)){
			this.initCountdown(true);
		}
	}	

	render() {
		const {
			attributes: {
				dateTime,
				fontFamily,
				fontSize,
				fontSizeTablet,
				fontSizeMobile,
				fontWeight,
				fontStyle,
				textTransform,
				lineHeight,
				letterSpacing,

				align,
				textAlignment,

				paddingTop,
				paddingRight,
				paddingBottom,
				paddingLeft,

				marginTop,
				marginRight,
				marginBottom,
				marginLeft,
				customTextColor
			},
			className,
			backgroundColor,
			textColor,
			setAttributes
		} = this.props;

		const changeState = this.changeState;

		const wrapperProps = {
			className: classnames(className,
				{
					'alignfull': align === 'full',
					'alignwide': align === 'wide',

					[ `has-horizontal-alignment-${textAlignment}` ]: textAlignment,
					[ 'has-custom-font-size' ]: fontSize != undefined,			

					[ `${fontSizeTablet}` ]: ( fontSizeTablet && fontSizeTablet != 'fs-tablet-100' ) ? fontSizeTablet: undefined,
					[ `${fontSizeMobile}` ]: ( fontSizeMobile && fontSizeMobile != 'fs-mobile-100' ) ? fontSizeMobile: undefined
				}
			),
			style: {
				fontSize    : fontSize != undefined ? fontSize : undefined,
				marginLeft,
				marginRight,
				marginBottom,
				marginTop,
			}
		};

		const contentClass = classnames(
			`${baseClass}__content`,
			{
				'has-text-color'   : textColor.color,
				[ textColor.class ]: textColor.class,

				'has-background' 		 : backgroundColor.color,
				[ backgroundColor.class ]: backgroundColor.class
			}
		);		

		const wrapperClass = classnames(
			`${baseClass}__wrapper`,
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

				<div {...wrapperProps} >
					<div
						className={ contentClass }
						style={{
							fontFamily: (fontFamily && fontFamily !='' ? `"${fontFamily}"` : undefined),
							fontWeight: fontWeight && fontWeight !='' ? fontWeight : undefined,
							paddingTop,
							paddingBottom,
							paddingLeft,
							paddingRight,							
							fontStyle: fontStyle,
							textTransform: textTransform,
							lineHeight: lineHeight,
							letterSpacing: letterSpacing,						
							color: ((typeof this.props.attributes.textColor != 'undefined' && typeof this.props.attributes.textColor.class == 'undefined') ?
								this.props.textColor.color : (customTextColor ? customTextColor : undefined)),
							backgroundColor: (this.props.backgroundColor.color ? this.props.backgroundColor.color : this.props.attributes.customBackgroundColor),
						}}
						>
							<div className={ wrapperClass }></div>
					</div>
				</div>
			</Fragment>
		);
	}
}

export default compose( [
	withColors( 'backgroundColor', { textColor: 'color' } ),
] )( Edit );