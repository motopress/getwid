import classnames from 'classnames';
import times from 'lodash/times';
import './style.scss';

const {
	Component,
	Fragment,
} = wp.element;
const {
	RichText,
	getColorClassName,
	getColorObjectByAttributeValues	
} = wp.editor;

/**
 *
 * @param {string} attrPrefix
 * @return {Object}
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
				textAnimation,
				textAnimationDuration,
				textAnimationDelay,

				backgroundColor,
				textColor,
				customBackgroundColor,
				customTextColor,
			}
		} = this.props;

		const className = 'wp-block-getwid-advanced-heading';
		const textClass = getColorClassName( 'color', textColor );
		const backgroundClass = getColorClassName( 'background-color', backgroundColor );

		const wrapperClass = classnames(className,
			{
				'alignfull': align === 'full',
				'alignwide': align === 'wide',
				'getwid-animation': !! textAnimation,
			}
		);
		
		const wrapperContentClass = classnames(
			`${className}__content`,
			{
				'has-text-color': textColor || customTextColor,
				[ textClass ]: textClass,
				'has-background': (backgroundColor || customBackgroundColor),
				[ backgroundClass ]: (backgroundClass),
			}
		);	

		const animationData = !!textAnimation ? {
			'data-animation':  textAnimation !== undefined ? textAnimation : '',
			'data-duration':  textAnimationDuration !== undefined ? textAnimationDuration : '2000ms',
			'data-delay': textAnimationDelay !== undefined ? textAnimationDelay : '0ms',
		} : {};

		return (
			<div className={ wrapperClass }
				{...animationData}
			>
				<RichText.Content
					tagName={ titleTag }
					value={ content }
					style={{
						textAlign: textAlignment,
						fontFamily: (fontFamily ? fontFamily : undefined),
						fontSize: fontSize,
						fontWeight: fontWeight,
						fontStyle: fontStyle,
						textTransform: textTransform,
						lineHeight: lineHeight,
						letterSpacing: letterSpacing,
						paddingTop,
						paddingBottom,
						paddingLeft,
						paddingRight,
						marginTop,
						marginBottom,
						marginLeft,
						marginRight,
						color: (typeof textColor != 'undefined' ? undefined : customTextColor),
						backgroundColor: (backgroundColor ? undefined : customBackgroundColor),
					}}
					className={ wrapperContentClass }
				/>
			</div>
		);

	}
}

export default Save;