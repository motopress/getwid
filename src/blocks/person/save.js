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
* Module Constants
*/
const baseClass = 'wp-block-getwid-person';


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

				className,
			}
		} = this.props;

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
					<div className={`${baseClass}__image`}>
						<img
							src={imgUrl}
							alt={imgAlt}
							className={ imgId ? `wp-image-${ imgId }` : undefined }
						/>
					</div>
					<div className={`${baseClass}__content-wrapper`}>

						{
							!RichText.isEmpty(title) &&
							<RichText.Content tagName={'span'} value={title} className={`${baseClass}__title`}/>
						}
						{
							!RichText.isEmpty(subtitle) &&
							<RichText.Content tagName={'span'} value={subtitle} className={`${baseClass}__subtitle`}/>
						}
						{
							!RichText.isEmpty(content) &&
							<RichText.Content tagName={'p'} value={content} className={`${baseClass}__content`}/>
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