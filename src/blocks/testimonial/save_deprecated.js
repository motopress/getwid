
import classnames from "classnames";
/**
* WordPress dependencies
*/
const {
	Component
}= wp.element;
const {
	RichText
} = wp.blockEditor || wp.editor;


/**
* Module Constants
*/
const baseClass = 'wp-block-getwid-testimonial';


/**
* Component Output
*/
class Save extends Component{
	render() {
		const {
			attributes: {
				title,
				subtitle,
				content,
				imgId,
				imgUrl,
				imgAlt,

				className,
			},
		} = this.props;

		const testimonialClasses = classnames(
			className,
			{
				['has-image'] : imgUrl !== undefined
			}
		);

		return (
			<div className={testimonialClasses}>
				<div className={`${baseClass}__wrapper`}>
					{!RichText.isEmpty(content) &&
						<div className={`${baseClass}__content-wrapper`}>
							<RichText.Content tagName={'p'} value={content}
											  className={`${baseClass}__content`}/>
						</div>
					}
					<div className={`${baseClass}__header`}>
						{imgUrl &&
						<div className={`${baseClass}__image-wrapper`}>
							<div className={`${baseClass}__image`}>
								<img
									src={imgUrl}
									alt={imgAlt}
									className={imgId ? `wp-image-${ imgId }` : null}
								/>
							</div>
						</div>
						}
						{(!RichText.isEmpty(title) && !RichText.isEmpty(subtitle)) &&
							<div className={`${baseClass}__heading`}>
								{
									!RichText.isEmpty(title) &&
									<RichText.Content tagName={'span'} value={title}
													  className={`${baseClass}__title`}/>
								}
								{
									!RichText.isEmpty(subtitle) &&
									<RichText.Content tagName={'span'} value={subtitle}
													  className={`${baseClass}__subtitle`}/>
								}
							</div>
						}
					</div>
				</div>
			</div>
		);
	}
}

export default Save;