/**
* External dependencies
*/
import classnames from 'classnames';

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
		const { title, currency, amount, description, anchor } = this.props.attributes;
		const { id, url, titleTag, textColor, customTextColor, dotted } = this.props.attributes;

		const textClass = getColorClassName( 'color', textColor );

		const wrapperPriceListProps = {
			id: anchor ? anchor : undefined,
			className: classnames( `${className}`,
				{
					'has-text-color': textColor || customTextColor,
					[ textClass ]: textClass,

					'has-dots': dotted
				}
			)
		};

		const textStyle = {
			color: textClass == undefined ? customTextColor : undefined
		};

		return (
			<Fragment>
				<div { ...wrapperPriceListProps } style={ textStyle }> {
						url && <div className={ `${baseClass}__image-wrapper` }>{
							<img src={ url } alt={ '' } className={ `${baseClass}__image ` + (id ? `wp-image-${ id }` : null) }/>
						}
						</div>
					}

					{
						( ! title && !currency && !amount && !description) ? null :

							<div className={ `${baseClass}__content-wrapper` }>
								<div className={ `${baseClass}__header` }>
									{
										title && ( <RichText.Content
											tagName={ titleTag }
											className={ `${baseClass}__title` }
											value={ title }
										/> )
									}

									{
										title && ( <div className={ `${baseClass}__price-line` }></div> )
									}

									<div className={ `${baseClass}__price-wrapper` }>
										{
											currency && ( <RichText.Content
												tagName={ titleTag }
												className={ `${baseClass }__currency` }
												value={ currency }
											/> )
										}

										{
											amount && ( <RichText.Content
												tagName={ titleTag }
												className={ `${baseClass}__amount` }
												value={ amount }
											/> )
										}
									</div>
									
								</div>

								{
									description && ( <RichText.Content
										tagName={ 'p' }
										className={ `${baseClass}__description` }
										value={ description }
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