/**
* External dependencies
*/
import classnames from 'classnames';

const { RichText } = wp.editor;
const { InnerBlocks, getColorClassName } = wp.editor;
const { Component, Fragment } = wp.element;

/**
* Create an Component
*/
class Save extends Component {

	constructor() {
		super(...arguments);
	}
	
	render() {
		const { url, meta } = this.props.attributes;
		const { backgroundColor, customBackgroundColor } = this.props.attributes;
		const { className, baseClass } = this.props;

		const backgroundClass = getColorClassName('background-color', backgroundColor);

		const wrapperClass = {
			className: classnames(`${baseClass}__card-inner`,
				{
					'has-background': backgroundColor || customBackgroundColor,
					[backgroundClass]: backgroundClass,
				}
			),
			style: { backgroundColor: ! backgroundColor ? customBackgroundColor : undefined }
		}

		const arrowStyle = {
			style: {
				backgroundColor: ! backgroundColor ? customBackgroundColor : undefined
			}
		}
		
		return (
			<Fragment>
				<div className={`${className}`}>
					<div className={`${baseClass}__wrapper`}>
						<div className={`${baseClass}__card`}>
							<div {...wrapperClass}>
								{ url && ( <div className={`${baseClass}__image-wrapper`}>
										<img className={`${baseClass}__image`} src={url} alt={''}/>
									</div>
								) }								
								<div className={`${baseClass}__content-wrapper`}>
									<InnerBlocks.Content/>
								</div>
							</div>

							<div className={`${baseClass}__card-arrow`} {...arrowStyle}></div>
						</div>

						<div className={`${baseClass}__point`}>
							<div className={`${baseClass}__point-content`}></div>
						</div>						

						<div className={`${baseClass}__meta`}>
							{
								meta && ( <RichText.Content
									tagName={ 'p' }
									className={ `${baseClass}__meta-content` }
									value={ meta }
								/> )
							}
						</div>
					</div>
				</div>
			</Fragment>
		);
	}
}

export default Save;