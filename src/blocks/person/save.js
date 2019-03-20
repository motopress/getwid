const {
	Component,
	Fragment
}= wp.element;

const {
	RichText
} = wp.editor;

class Save extends Component{

	render() {


		const {
			attributes: {
				title,
				subtitle,
				content,
				imgId,
				imgUrl,
				imgSize
			}
		} = this.props;


		return (
			<div className={'wp-block-getwid-person'}>
				{imgUrl &&
				<Fragment>
					<div className={'wp-block-getwid-person__image'}>
						<img
							src={imgUrl}
						/>
					</div>
					<div className={'wp-block-getwid-person__content-wrapper'}>

						<ul className={'wp-block-getwid-person__social-links'}>
							<li className={'wp-block-getwid-person__social-item'}>
								<a href="#" className={'wp-block-getwid-person__social-link'}>
									<i className="fab fa-linkedin"></i>
									<span className="wp-block-getwid-person__social-label">
										LinkedIn
									</span>
								</a>
							</li>
							<li className={'wp-block-getwid-person__social-item'}>
								<a href="#" className={'wp-block-getwid-person__social-link'}>
									<i className="fab fa-facebook"></i>
									<span className="wp-block-getwid-person__social-label">
										Facebook
									</span>
								</a>
							</li>
							<li className={'wp-block-getwid-person__social-item'}>
								<a href="#" className={'wp-block-getwid-person__social-link'}>
									<i className="fab fa-twitter"></i>
									<span className="wp-block-getwid-person__social-label">
										Twitter
									</span>
								</a>
							</li>
						</ul>

						{
							!RichText.isEmpty(title) &&
							<RichText.Content tagName={'h3'} value={title} className={'wp-block-getwid-person__title'}/>
						}
						{
							!RichText.isEmpty(subtitle) &&
							<RichText.Content tagName={'span'} value={subtitle}
											  className={'wp-block-getwid-person__subtitle'}/>
						}
						{
							!RichText.isEmpty(content) &&
							<RichText.Content tagName={'p'} value={content}
											  className={'wp-block-getwid-person__content'}/>
						}

					</div>
				</Fragment>
				}
			</div>
		);
	}
}

export default Save;