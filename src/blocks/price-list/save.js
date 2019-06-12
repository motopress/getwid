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
		const { title, currency, amount, description } = this.props.attributes;
		const { id, url, titleTag, textColor, customTextColor } = this.props.attributes;

		const textClass = getColorClassName('color', textColor);

		const wrapperPriceListProps = {
			className: classnames(`${className}`,
				{
					'has-text-color': textColor || customTextColor,
					[textClass]: textClass,
				}
			)
		}

		const textStyle = {
			color: textClass === undefined ? customTextColor : undefined
		}	

		return (
			<Fragment>
				<div {...wrapperPriceListProps}> {
						url && <div className={`${baseClass}__image-wrapper`}>{
							<img src={url} alt="" className={ `${baseClass}__image ` + (id ? `wp-image-${ id }` : null) }/>
						}
						</div>
					}

					{
						(!title && !currency && !amount && !description) ? null :

							<div className={`${baseClass}__content-wrapper`}>
								<div className={`${baseClass}__title-wrapper`}>
									{
										title && ( <RichText.Content
											tagName={titleTag}
											className={`${baseClass}__title`}
											value={title}
											style={textStyle}
										/> )
									}

									{
										title && ( <div className={`${baseClass}__price-line`} style={textStyle}></div> )
									}

									{
										currency && ( <RichText.Content
											tagName={titleTag}
											className={`${baseClass}__currency`}
											value={currency}
											style={textStyle}
										/> )
									}

									{
										amount && ( <RichText.Content
											tagName={titleTag}
											className={`${baseClass}__amount`}
											value={amount}
											style={textStyle}
										/> )
									}
								</div>

								{
									description && ( <RichText.Content
										tagName='p'
										className={`${baseClass}__description`}
										value={description}
										style={textStyle}
									/> )
								}
							</div>
					}
				</div>
			</Fragment>
		);
	}
}

export default Save;