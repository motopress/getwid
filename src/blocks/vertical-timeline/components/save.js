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

		const backgroundClass = getColorClassName( 'background-color', backgroundColor );

		const cardInnerClass = {
			className: classnames( `${baseClass}__card-inner`,
				{
					'has-background': backgroundColor || customBackgroundColor,
					[ backgroundClass ]: backgroundClass,

					'active': colorFilling
				}
			),
			style: {
				backgroundColor: ! backgroundColor ? customBackgroundColor : undefined
			}
		};

		const arrowStyle = {
			style: {
				backgroundColor: ! backgroundColor ? customBackgroundColor : undefined
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
							<div className={`${baseClass}__content-wrapper`}>
								<InnerBlocks.Content/>
							</div>
						</div>

						<div className={`${baseClass}__card-arrow`} {...arrowStyle}></div>
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