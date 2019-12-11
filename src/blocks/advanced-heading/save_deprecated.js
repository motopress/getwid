/**
 * Internal dependencies
 */
import './style.scss';

/**
* External dependencies
*/
import classnames from 'classnames';

const { Component } = wp.element;
const { RichText, getColorClassName } = wp.blockEditor || wp.editor;

/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-advanced-heading';

/**
* Create an Component
*/
class Save extends Component {
	render() {
		const {
			attributes: {
				content,
				titleTag,
				fontFamily,
				fontSize,
				fontWeight,
				fontStyle,
				textTransform,
				lineHeight,
				letterSpacing,
				align,
				textAlignment,
				paddingTop,
				paddingBottom,
				paddingLeft,
				paddingRight,
				marginTop,
				marginBottom,
				marginLeft,
				marginRight,

				backgroundColor,
				textColor,
				customBackgroundColor,
				customTextColor,

				className
			}
		} = this.props;

		const textClass 	  = getColorClassName( 'color', textColor );
		const backgroundClass = getColorClassName( 'background-color', backgroundColor );

		const wrapperClass = classnames(className,
			{
				'alignfull': align === 'full',
				'alignwide': align === 'wide'
			}
		);
		
		const wrapperContentClass = classnames(
			`${baseClass}__content`,
			{
				'has-text-color': textColor || customTextColor,
				[ textClass ]	: textClass,

				'has-background'   : backgroundColor || customBackgroundColor,
				[ backgroundClass ]: backgroundClass
			}
		);

		return (
			<div
				className={ wrapperClass }
				style={{
					marginTop,
					marginBottom
				}}
			>
				<RichText.Content
					className={ wrapperContentClass }
					tagName={ titleTag }
					value={ content }
					style={{
						textAlign: textAlignment,
						fontFamily: (fontFamily ? `"${fontFamily}"` : undefined),
						fontSize: fontSize,
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