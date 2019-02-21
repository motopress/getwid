import classnames from 'classnames';
import times from 'lodash/times';
import './style.scss';

const {
	Component,
	Fragment,
} = wp.element;
const {
	RichText,
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
				backgroundColor,
				textColor,
				customBackgroundColor,
				customTextColor,
				titleTag,
				fontFamily,
				fontSize,
				fontWight,
				fontStyle,
				fontTransform,
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
			}
		} = this.props;

		const className = 'wp-block-getwid-advanced-heading';
		const wrapperClass = classnames(className,
			`test lolo4ka`,
/*			{
				'alignfull': align === 'full',
				'alignwide': align === 'wide'
			}*/
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
				style={ { textAlign: textAlignment } }
				value={ content }
			/>
			</div>
		);

	}
}

export default Save;