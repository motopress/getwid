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
* Create an Component
*/
class Save extends Component {
	render() {
		const { className, baseClass } = this.props;

		const { paddingLeft, paddingRight, marginTop, marginBottom, marginLeft } = this.props.attributes;
		const { marginRight, backgroundColor, textColor, customBackgroundColor, customTextColor } = this.props.attributes;
		const { textTransform, lineHeight, letterSpacing, align, textAlignment, paddingTop, paddingBottom } = this.props.attributes;
		const { content, titleTag, fontFamily, fontSize, fontSizeTablet, fontSizeMobile, fontWeight, fontStyle } = this.props.attributes;
		
		const textClass 	  = getColorClassName( 'color'			 , textColor       );
		const backgroundClass = getColorClassName( 'background-color', backgroundColor );

		const wrapperClass = {
			className: classnames(className,
				{
					'alignfull': align == 'full',
					'alignwide': align == 'wide',

					[ `getwid-font-size-tablet-${fontSizeTablet}` ]: fontSizeTablet != '',
					[ `getwid-font-size-mobile-${fontSizeMobile}` ]: fontSizeMobile != ''
				}
			),
			style: {
				fontSize    : fontSize != '' ? fontSize : '',
				marginBottom: marginBottom,
				marginTop   : marginTop
			}
		}
		
		const wrapperContentClass = classnames(
			`${baseClass}__content`,
			{
				'has-text-color': textColor || customTextColor,
				[ textClass ]: textClass,

				'has-background': backgroundColor || customBackgroundColor,
				[ backgroundClass ]: backgroundClass
			}
		);

		return (
			<div {...wrapperClass} >
				<RichText.Content
					className={ wrapperContentClass }
					tagName={ titleTag }
					value={ content }
					style={{
						textAlign: textAlignment,
						fontFamily: fontFamily ? `"${fontFamily}"` : undefined,
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
						color: (typeof textColor != 'undefined' ? undefined : customTextColor),
						backgroundColor: (backgroundColor ? undefined : customBackgroundColor),
					}}
				/>
			</div>
		);
	}
}

export default Save;