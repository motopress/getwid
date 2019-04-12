import classnames from 'classnames';

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
				typeBar,

				backgroundColor,
				textColor,

				customBackgroundColor,
				customTextColor,
			}
		} = this.props;

		const className = 'wp-block-getwid-progress-bar';

		const textClass = getColorClassName('color', textColor);
		const backgroundClass = getColorClassName('background-color', backgroundColor);

		const isCircle = typeBar === undefined ? false : typeBar === 'default' ? false : true;
		const circleColor = textColor === undefined ? customTextColor === undefined ? undefined : customTextColor : textColor;
		
		const contentWrapperPropds = {
			className: classnames(`${className}__bar-background`,
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
				<div className={classnames(className, {
					'ui-type-circle': isCircle,
					'ui-type-default': !isCircle,
				 })}>
					<div className={`${className}__wrapper`} data-circle-color={circleColor} data-type-bar={typeBar} data-fill-amount={fillAmount} data-is-animated={isAnimated} >
						<div className={`${className}__title-holder`}>
							<RichText.Content tagName="h5" className={`${className}__title`} value={title ? title : ''} />
							{
								!isCircle && (
									<span className={`${className}__percent`}>{`${fillAmount}%`}</span>
								)
							}
						</div>

						{
							isCircle && (
								<div className={`${className}__content-wrapper`}>

									<div {...contentWrapperPropds}></div>

									<div className={`${className}__circle-foreground`}></div>
									<canvas className={`${className}__counter`} height="200" width="200" />
								</div>
							)
						}

						{
							!isCircle && (
								<div {...contentWrapperPropds}>
									<div {...wrapperContentProps}></div>
								</div>
							)
						}
					</div>
				</div>
			</Fragment>
		);
	}
}

export default (Save);