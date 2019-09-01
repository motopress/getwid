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
		const { backgroundColor, customBackgroundColor, pointColor } = this.props.attributes;
		const { textColor, customTextColor } = this.props.attributes;

		const backgroundClass = getColorClassName( 'background-color', backgroundColor );
		const textClass       = getColorClassName( 'color'           , textColor       );

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

		const contentWrapperClass = {
			className: classnames( `${baseClass}__content-wrapper`, {
					'has-text-color': textColor || customTextColor,
					[ textClass ]: textClass
				}
			),
			style: {
				color: ! textColor ? customTextColor : undefined
			}
		};

		const wrapperClass = {
			className: classnames( `${baseClass}__wrapper`, {
				'has-card-left' : cardPosition == 'left',
				'has-card-right': cardPosition == 'right'
			} )
		};

		return (
			<div className={`${className}`}>
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
								className={ `${baseClass}__meta-content` }
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