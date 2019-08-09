/**
 * Internal dependencies
 */
import './style.scss';

/**
* External dependencies
*/
import classnames from 'classnames';

const { Component } = wp.element;
const { RichText, getColorClassName } = wp.editor;

/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-countdown';


/**
* Create an Component
*/
class Save extends Component {
	render() {
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

				backgroundColor,
				textColor,				
				customTextColor,
				customBackgroundColor
			},
			className,
		} = this.props;
		
		const textClass 	  = getColorClassName( 'color'			 , textColor       );
		const backgroundClass = getColorClassName( 'background-color', backgroundColor );

		const wrapperProps = {
			className: classnames( className,
				{
					'alignfull': align == 'full',
					'alignwide': align == 'wide',

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
				'has-text-color': textColor || customTextColor,
				[ textClass ]: textClass,

				'has-background': backgroundColor || customBackgroundColor,
				[ backgroundClass ]: backgroundClass
			}
		);

		const wrapperClass = classnames(
			`${baseClass}__wrapper`,
		);	

		const countdownSettings = {
			'data-time': dateTime,
			'data-year': year,
			'data-months': months,
			'data-weeks': weeks,
			'data-days': days,
			'data-hours': hours,
			'data-minutes': minutes,
			'data-seconds': seconds,
		};

		return (
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
						color: (typeof textColor != 'undefined' ? undefined : customTextColor),
						backgroundColor: (backgroundColor ? undefined : customBackgroundColor),
					}}
					>
						<div {...countdownSettings} className={ wrapperClass }></div>
				</div>
			</div>
		);
	}
}

export default Save;