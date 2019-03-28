/**
* WordPress dependencies
*/
const {
	Component
}= wp.element;
const {
	RichText
} = wp.editor;


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
				imgAlt
			},
			className
		} = this.props;

		return (
			<div className={className}>
				<div className={'wp-block-getwid-testimonial__wrapper'}>
					{!RichText.isEmpty(content) &&
						<div className={'wp-block-getwid-testimonial__content-wrapper'}>
							<RichText.Content tagName={'p'} value={content}
											  className={'wp-block-getwid-testimonial__content'}/>
						</div>
					}
					<div className={'wp-block-getwid-testimonial__header'}>
						<div className={'wp-block-getwid-testimonial__image-wrapper'}>
							<div className={'wp-block-getwid-testimonial__image'}>
								{imgUrl &&
									<img
										src={imgUrl}
										alt={imgAlt}
										className={ imgId ? `wp-image-${ imgId }` : null }
									/>
								}
							</div>
						</div>
						{(!RichText.isEmpty(title) && !RichText.isEmpty(subtitle)) &&
							<div className={'wp-block-getwid-testimonial__heading'}>
								{
									!RichText.isEmpty(title) &&
									<RichText.Content tagName={'span'} value={title}
													  className={'wp-block-getwid-testimonial__title'}/>
								}
								{
									!RichText.isEmpty(subtitle) &&
									<RichText.Content tagName={'span'} value={subtitle}
													  className={'wp-block-getwid-testimonial__subtitle'}/>
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