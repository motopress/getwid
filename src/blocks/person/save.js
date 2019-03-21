import classnames from 'classnames';

const {
	Component,
	Fragment
}= wp.element;

const {
	RichText,
	InnerBlocks
} = wp.editor;

class Save extends Component{

	render() {


		const {
			attributes: {
				imageSize,
				imageCrop,
				title,
				subtitle,
				content,
				imgId,
				imgUrl,
			}
		} = this.props;

		const className = 'wp-block-getwid-person';

		return (
			<div
			className={
				classnames(
					className,
					imageCrop ? `is-image-cropped` : null
				)
			}>
				{imgUrl &&
				<Fragment>
					<div className={`${className}__image`}>
						<img
							src={imgUrl}
						/>
					</div>
					<div className={`${className}__content-wrapper`}>

						<InnerBlocks.Content />

						{
							!RichText.isEmpty(title) &&
							<RichText.Content tagName={'h3'} value={title} className={`${className}__title`}/>
						}
						{
							!RichText.isEmpty(subtitle) &&
							<RichText.Content tagName={'span'} value={subtitle} className={`${className}__subtitle`}/>
						}
						{
							!RichText.isEmpty(content) &&
							<RichText.Content tagName={'p'} value={content} className={`${className}__content`}/>
						}

					</div>
				</Fragment>
				}
			</div>
		);
	}
}

export default Save;