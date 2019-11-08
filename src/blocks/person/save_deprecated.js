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
				id,
				url,
				alt,

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
				{url &&
				<Fragment>
					<div className={`${baseClass}__image`}>
						<img
							src={url}
							alt={alt}
							className={ id ? `wp-image-${ id }` : null }
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