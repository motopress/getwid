/**
* External dependencies
*/
import classnames from 'classnames';

const { RichText } = wp.editor;
const { InnerBlocks, getColorClassName } = wp.editor;
const { Component } = wp.element;

/**
* Create an Component
*/
class Save extends Component {

	constructor() {
		super(...arguments);
	}
	
	render() {
		const { className, baseClass } = this.props;
		const { id, url, meta, cardPosition, colorFilling } = this.props.attributes;

		const { outerParent } = this.props.attributes;
		const customBackgroundColor = outerParent && outerParent.attributes.customBackgroundColor ? outerParent.attributes.customBackgroundColor : undefined;
		const backgroundColor       = outerParent && outerParent.attributes.backgroundColor       ? outerParent.attributes.backgroundColor       : undefined;
		const customTextColor       = outerParent && outerParent.attributes.customTextColor       ? outerParent.attributes.customTextColor       : undefined;
		const pointColor            = outerParent && outerParent.attributes.pointColor            ? outerParent.attributes.pointColor            : undefined;
		const textColor             = outerParent && outerParent.attributes.textColor             ? outerParent.attributes.textColor             : undefined;

		const backgroundClass = getColorClassName( 'background-color', backgroundColor );
		const textClass       = getColorClassName( 'color'           , textColor       );

		const textColorClass = {
			'has-text-color': textColor || customTextColor,
			[ textClass ]: textClass
		};

		const contentWrapperClass = {
			className: classnames( `${baseClass}__content-wrapper`, {
					...textColorClass
				}
			),
			style: {
				paddingTop   : outerParent && outerParent.attributes.paddingTop    ? outerParent.attributes.paddingTop    : undefined,
				paddingBottom: outerParent && outerParent.attributes.paddingBottom ? outerParent.attributes.paddingBottom : undefined,
				paddingLeft  : outerParent && outerParent.attributes.paddingLeft   ? outerParent.attributes.paddingLeft   : undefined,		
				paddingRight : outerParent && outerParent.attributes.paddingRight  ? outerParent.attributes.paddingRight  : undefined,
				
				color: ! textColor ? customTextColor : undefined
			}
		};

		const metaContentClass = {
			className: classnames( `${baseClass}__meta-content`, {
					...textColorClass
				}
			)
		};

		const bgColorStyle = {
			style: {
				backgroundColor: ! backgroundColor ? customBackgroundColor : undefined
			}
		};

		const bgColorClass = {
			'has-background': backgroundColor || customBackgroundColor,
			[ backgroundClass ]: backgroundClass
		};

		const cardInnerClass = {
			className: classnames( `${baseClass}__card-inner`, {
					...bgColorClass,
					'active': colorFilling
				}
			),
			...bgColorStyle
		};

		const cardArrowClass = {
			className: classnames( `${baseClass}__card-arrow`, {
					...bgColorClass,
				}
			),
			...bgColorStyle
		};

		const wrapperClass = {
			className: classnames( `${baseClass}__wrapper`, {
				'has-card-left' : cardPosition == 'left',
				'has-card-right': cardPosition == 'right'
			} )
		};

		const timeLineStyle = {
			style: {
				marginBottom: outerParent && outerParent.attributes.marginBottom ? outerParent.attributes.marginBottom : undefined
			}
		};

		return (
			<div className={`${className}`} {...timeLineStyle}>
				<div {...wrapperClass}>
					<div className={`${baseClass}__card`}>
						<div {...cardInnerClass}>
							{ url && ( <div className={`${baseClass}__image-wrapper`}>
									<img className={`${baseClass}__image ` + ( id ? `wp-image-${ id }` : null )} src={url} alt={''}/>
								</div>
							) }								
							<div {...contentWrapperClass}>
								<InnerBlocks.Content/>
							</div>
						</div>

						<div {...cardArrowClass}></div>
					</div>

					<div className={`${baseClass}__point`} data-point-color={pointColor}>
						<div className={`${baseClass}__point-content`}></div>
					</div>

					<div className={`${baseClass}__meta`}>
						{ meta && (
							<RichText.Content
								tagName={ 'p' }
								{...metaContentClass}
								style={ {
									color: ! textColor ? customTextColor : undefined
								} }
								value={ meta }
							/>
						) }
					</div>
				</div>
			</div>
		);
	}
}

export default Save;