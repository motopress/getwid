import classnames from 'classnames';
import { pick } from 'lodash';

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;

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
				textColor,

				customBackgroundColor,
				customTextColor,
			}
		} = this.props;

		const className = 'wp-block-getwid-progress-bar';

		const textClass = getColorClassName('color', textColor);
		const backgroundClass = getColorClassName('background-color', backgroundColor);

		const wrapperHolderProps = {
			className: classnames(`${className}__content-holder`,
			{
				'has-background': backgroundColor || customBackgroundColor,
				[backgroundClass]: backgroundClass,
			}),
			style: { backgroundColor: (backgroundColor ? undefined : customBackgroundColor) }
		}

		const wrapperContentProps = {
			className: classnames(`${className}__content`,
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
					<div className={`${className}__wrapper`} data-fill-amount={fillAmount} data-is-animated={isAnimated} >
						<div className='wp-block-getwid-progress-bar__title-holder'>

							<RichText.Content tagName="h5" className={`${className}__title`} value={title ? title : ''} />
							<span className='wp-block-getwid-progress-bar__percent'>{`${fillAmount}%`}</span>

						</div>
						<div {...wrapperHolderProps}>
							<div {...wrapperContentProps}></div>
						</div>
					</div>
				</div>
			</Fragment>
		);
	}
}

export default (Save);