/**
 * External dependencies
 */
import classnames from 'classnames';

/**
* WordPress dependencies
*/
const { Component, Fragment } = wp.element;
const { RichText, getColorClassName, InnerBlocks } = wp.blockEditor || wp.editor;

/**
* Create an Component
*/
class Save extends Component {

	constructor() {
		super(...arguments);
	}

	render() {
		const { className, baseClass } = this.props;
		const { title, currency, amount, period, features, headerTag } = this.props.attributes;
		const { backgroundColor, textColor, customBackgroundColor, customTextColor } = this.props.attributes;

		const textClass = getColorClassName('color', textColor);
		const backgroundClass = getColorClassName('background-color', backgroundColor);

		const wrapperPriceBoxProps = {
			className: classnames(`${className}`,
				{
					'has-background': backgroundColor || customBackgroundColor,
					[backgroundClass]: backgroundClass,

					'has-text-color': textColor || customTextColor,
					[textClass]: textClass,
				}
			),
			style: {
				backgroundColor: backgroundColor ? undefined : customBackgroundColor,
				color: typeof textColor != 'undefined' ? undefined : customTextColor
			}
		}

		const displayPrice = () => {

			return ( !currency && !amount && !period ) ? null :

				<div className={`${baseClass}__pricing`}>
					{
						currency && ( <RichText.Content
							tagName='p'
							className={`${baseClass}__currency`}
							value={currency}
						/> )
					}

					{
						amount && ( <RichText.Content
							tagName='p'
							className={`${baseClass}__amount`}
							value={amount}
						/> )
					}

					{
						period && ( <RichText.Content
							tagName='p'
							className={`${baseClass}__period`}
							value={period}
						/> )
					}

				</div>
		}

		return (
			<Fragment>
				<div {...wrapperPriceBoxProps}>
					{
						title && ( <RichText.Content
							tagName={ headerTag }
							className={`${baseClass}__title`}
							value={ title }
						/> )
					}
					{ displayPrice() }
					{
						features && ( <RichText.Content
							tagName='ul'
							className={`${baseClass}__features`}
							value={ features }
						/> )
					}

					<InnerBlocks.Content/>
				</div>
			</Fragment>
		);
	}
}

export default Save;