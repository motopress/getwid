/**
* External dependencies
*/
import classnames from 'classnames';


/**
* WordPress dependencies
*/
const {
	Component,
	Fragment
}= wp.element;
const {
	RichText,
	InnerBlocks
} = wp.editor;


/**
* Component Output
*/
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
				imgAlt,
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
							alt={imgAlt}
							className={ imgId ? `wp-image-${ imgId }` : null }
						/>
					</div>
					<div className={`${className}__content-wrapper`}>

						{
							!RichText.isEmpty(title) &&
							<RichText.Content tagName={'span'} value={title} className={`${className}__title`}/>
						}
						{
							!RichText.isEmpty(subtitle) &&
							<RichText.Content tagName={'span'} value={subtitle} className={`${className}__subtitle`}/>
						}
						{
							!RichText.isEmpty(content) &&
							<RichText.Content tagName={'p'} value={content} className={`${className}__content`}/>
						}

						<InnerBlocks.Content />
					</div>
				</Fragment>
				}
			</div>
		);
	}
}

export default Save;