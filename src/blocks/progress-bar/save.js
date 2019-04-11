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

		const wrapperProps = {
			className: classnames(className,
				{
					'ui-type-circle': isCircle,
					'ui-type-default': !isCircle,

					'has-background': backgroundColor || customBackgroundColor,
					[backgroundClass]: backgroundClass,

					'has-text-color': textColor || customTextColor,
					[textClass]: textClass
				}),
		}

		const contentWrapperPropds = {
			className: classnames(`${className}__content-wrapper`),
			style: {
				backgroundColor: (backgroundColor ? undefined : customBackgroundColor)
			}
		}

		return (
			<Fragment>
				<div {...wrapperProps}>
					<div className={`${className}__wrapper`} data-type-bar={typeBar} data-fill-amount={fillAmount} data-is-animated={isAnimated} >
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

									<div className={`${className}__circle-background`} style={{
										backgroundColor: backgroundColor ? backgroundColor: customBackgroundColor
									}}></div>

									<div className={`${className}__circle-foreground`}></div>
									<canvas className={`${className}__counter`} height="200" width="200" />
								</div>
							)
						}

						{
							!isCircle && (
								<div {...contentWrapperPropds}>
									<div className={`${className}__content`} style={{
										color: (typeof textColor != 'undefined' ? undefined : customTextColor),
										width: '0%'
									}}></div>
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