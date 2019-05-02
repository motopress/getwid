import classnames from 'classnames';
import { get } from 'lodash';

const { Component, Fragment } = wp.element;
const { select } = wp.data;

const {
	RichText,
	getColorClassName
} = wp.editor;

class Save extends Component {
	render() {
		const {
			attributes: {
				fillAmount,
				title,
				isAnimated,

				backgroundColor,
				customBackgroundColor,

				textColor,
				customTextColor
			},

			className,
			baseClass
			
		} = this.props;

		console.log(get(select('core/editor').getEditorSettings(), ['colors'], []));

		const textClass = getColorClassName('color', textColor);
		const backgroundClass = getColorClassName('background-color', backgroundColor);

		console.log('backgroundColor: ' + backgroundColor);
		console.log('customBackgroundColor: ' + customBackgroundColor);
		console.log('backgroundClass: ' + backgroundClass);
		
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

		// console.log('textColor: ' + textColor);
		// console.log('customTextColor: ' + customTextColor);

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