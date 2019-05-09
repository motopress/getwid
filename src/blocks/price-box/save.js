import classnames from 'classnames';

const { Component, Fragment } = wp.element;

const {
	RichText,
	getColorClassName,
	InnerBlocks
} = wp.editor;

class Save extends Component {
	render() {
		const {
			attributes: {
				title,
				currency,
				amount,
				period,
				features,

				headerTag,

				backgroundColor,
				textColor,

				customBackgroundColor,
				customTextColor
			},

			className,
			baseClass

		} = this.props;

		const textClass = getColorClassName('color', textColor);
		const backgroundClass = getColorClassName('background-color', backgroundColor);

		const textStyle = {
			color: (typeof textColor != 'undefined' ? undefined : customTextColor),
		}

		const wrapperPriceBoxProps = {
			className: classnames(`${className}`,
				{
					'has-background': backgroundColor || customBackgroundColor,
					[backgroundClass]: backgroundClass,

					'has-text-color': textColor || customTextColor,
					[textClass]: textClass,
				}
			),
			style: { backgroundColor: (backgroundColor ? undefined : customBackgroundColor) }
		}

		const displayPrice = () => {

			return (!currency && !amount && !period) ? null :

				<div className={`${baseClass}__pricing`}>
					{
						currency && <RichText.Content
							tagName='p'
							className={`${baseClass}__currency`}
							value={currency}
							style={textStyle}
						/>
					}

					{
						amount && <RichText.Content
							tagName='p'
							className={`${baseClass}__amount`}
							value={amount}
							style={textStyle}
						/>
					}

					{
						period && <RichText.Content
							tagName='p'
							className={`${baseClass}__period`}
							value={period}
							style={textStyle}
						/>
					}

				</div>
		}

		return (
			<Fragment>
				<div {...wrapperPriceBoxProps}>
					{
						title && <RichText.Content
							tagName={ headerTag }
							className={`${baseClass}__title`}
							value={ title }
							style={ textStyle }
						/>
					}
					{ displayPrice() }
					{
						features && <RichText.Content
							tagName='ul'
							className={`${baseClass}__features`}
							value={ features }
							style={ textStyle }
						/>
					}

					<InnerBlocks.Content />
				</div>
			</Fragment>
		);
	}
}

export default Save;