/**
 * External dependencies
 */
import classnames from 'classnames';

/**
* WordPress dependencies
*/
const { Component, Fragment } = wp.element;
const { RichText, getColorClassName } = wp.editor;

/**
* Create an Component
*/
class Save extends Component {

	constructor() {
		super(...arguments);
	}

	render() {
		const { className, baseClass } = this.props;
		const { fillAmount, title, isAnimated, backgroundColor } = this.props.attributes;
		const { customBackgroundColor, textColor, customTextColor } = this.props.attributes;

		const textClass 	  = getColorClassName('color'			, textColor		 );
		const backgroundClass = getColorClassName('background-color', backgroundColor);
		
		const contentWrapperPropds = {
			className: classnames(`${baseClass}__bar`,
				{
					'has-background': backgroundColor || customBackgroundColor,
					[backgroundClass]: backgroundClass,
				}),
			style: { backgroundColor: (backgroundColor ? undefined : customBackgroundColor) }
		}

		const wrapperContentProps = {
			className: classnames(`${baseClass}__progress`,
				{
					'has-text-color': textColor || customTextColor,
					[textClass]: textClass
				}),
			style: {
				color: (typeof textColor != 'undefined' ? undefined : customTextColor),
				width: '0%'
			}
		}

		return (
			<Fragment>
				<div className={classnames(className)}>
					<div className={`${baseClass}__wrapper`} data-fill-amount={fillAmount} data-is-animated={isAnimated}>
						<div className={classnames(
							`${baseClass}__header`, {
								'has-no-title': !title
							})}
						>
							{
								title && <RichText.Content tagName='p' className={`${baseClass}__title`} value={title} />
							}
							<span className={`${baseClass}__percent`}>{`${fillAmount}%`}</span>
						</div>

						<div {...contentWrapperPropds}>
							<div {...wrapperContentProps}></div>
						</div>
					</div>
				</div>
			</Fragment>
		);
	}
}

export default Save;